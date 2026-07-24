import { db } from "../../db";
import { aiSettings, blogs, aiBlogPlans } from "../../db/schema";
import { eq, lte, and } from "drizzle-orm";
import { GoogleGenAI, Type } from '@google/genai';

export class AiService {
  /**
   * Fetch current AI Settings
   */
  static async getSettings() {
    const settingsList = await db.select().from(aiSettings).limit(1);
    let settings = settingsList[0];
    if (!settings) {
      // Create default settings if not exists
      const [newSettings] = await db.insert(aiSettings).values({}).returning();
      settings = newSettings;
    }
    if (!settings) throw new Error("Failed to load or create AI settings");
    return settings;
  }

  /**
   * Update AI Settings
   */
  static async updateSettings(data: Partial<typeof aiSettings.$inferInsert>) {
    const settings = await this.getSettings();
    const [updated] = await db.update(aiSettings)
      .set(data)
      .where(eq(aiSettings.id, settings.id))
      .returning();
    return updated;
  }

  // --- PLANS CRUD ---
  static async getPlans() {
    return await db.select().from(aiBlogPlans).orderBy(aiBlogPlans.scheduledDate);
  }

  static async addPlan(data: { topic: string; scheduledDate: string }) {
    const [newPlan] = await db.insert(aiBlogPlans).values({
      topic: data.topic,
      scheduledDate: new Date(data.scheduledDate),
      status: 'pending'
    }).returning();
    return newPlan;
  }

  static async deletePlan(id: string) {
    await db.delete(aiBlogPlans).where(eq(aiBlogPlans.id, id));
    return true;
  }
  // ------------------

  /**
   * Persona Analyzer Agent
   * Takes user's answers and generates a profile
   */
  static async analyzePersona(answers: any) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing in .env");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert AI Persona Profiler.
The user wants to automate their tech blog. Analyze their answers to the following interview questions and extract their Tone of Voice, Industry/Niche, and Topics of Interest.

User's Answers:
${JSON.stringify(answers, null, 2)}

Return the output strictly in the following JSON format:
{
  "toneOfVoice": "string describing the tone (e.g., professional, friendly, technical)",
  "industry": "string describing the industry",
  "interests": "string summarizing the topics they want to write about"
}`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_FLASH_MODEL || 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            toneOfVoice: { type: Type.STRING },
            industry: { type: Type.STRING },
            interests: { type: Type.STRING }
          },
          required: ["toneOfVoice", "industry", "interests"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Save to DB
    await this.updateSettings({
      personaData: answers,
      toneOfVoice: result.toneOfVoice,
      interests: result.interests,
    });

    return result;
  }

  /**
   * The core Auto-Blogging Multi-Agent System
   */
  static async generateBlogFlow(customTopic?: string) {
    const settings = await this.getSettings();
    if (!settings.isActive && !customTopic) {
      console.log("[AI Blog] Automation is currently disabled.");
      return;
    }
    if (!settings.interests || !settings.toneOfVoice) {
      console.log("[AI Blog] Persona is not fully setup. Missing interests or tone.");
      return;
    }

    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing in .env");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    console.log("[AI Blog] Starting generation flow...");

    // Check for pending plan if customTopic is not provided
    let activePlanId: string | null = null;
    let topicToResearch = customTopic || "";

    if (!topicToResearch) {
      const pendingPlans = await db.select().from(aiBlogPlans)
        .where(
          and(
            eq(aiBlogPlans.status, 'pending'),
            lte(aiBlogPlans.scheduledDate, new Date())
          )
        )
        .limit(1);

      const plan = pendingPlans[0];
      if (plan) {
        topicToResearch = plan.topic;
        activePlanId = plan.id;
        console.log(`[AI Blog] Picked pending plan topic: ${topicToResearch}`);
      }
    }

    const researchPrompt = topicToResearch 
      ? `Find facts, statistics, and 3 specific URL sources for a blog post about exactly this topic: "${topicToResearch}".
Return the output strictly in this JSON format:
{
  "topic": "${topicToResearch}",
  "research_notes": "Detailed facts and findings",
  "sources": [{"title": "Source Title", "url": "https://..."}]
}`
      : `Find a highly relevant, trending, and technical topic related to: ${settings.interests}.
Your goal is to gather facts, statistics, and 3 specific URL sources for a blog post.
Return the output strictly in this JSON format:
{
  "topic": "The chosen specific topic",
  "research_notes": "Detailed facts and findings",
  "sources": [{"title": "Source Title", "url": "https://..."}]
}`;

    console.log("[AI Blog] Running Researcher Agent...");
    const researchRes = await ai.models.generateContent({
      model: process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro',
      contents: researchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            research_notes: { type: Type.STRING },
            sources: { 
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            }
          },
          required: ["topic", "research_notes", "sources"]
        }
      }
    });

    const research = JSON.parse(researchRes.text || '{}');
    
    // 2. WRITER AGENT (Gemini 2.5 Pro)
    const writerPrompt = `You are an expert technical blogger. Write a comprehensive, highly engaging, and technical blog post in ENGLISH.
Topic: ${research.topic}
Research Notes: ${research.research_notes}

Tone of Voice: ${settings.toneOfVoice}
Custom Rules: ${settings.customPrompts || 'None'}

Format: Use Markdown. Include code snippets if relevant. Do NOT add a main # title (it will be handled separately). Just write the body of the blog. Make it long, detailed, and NOT soulless.`;

    console.log("[AI Blog] Running Writer Agent...");
    const writerRes = await ai.models.generateContent({
      model: process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro',
      contents: writerPrompt,
    });
    let draft = writerRes.text || '';

    // 3. REVIEWER/CRITIC AGENT (Gemini 2.5 Flash)
    console.log("[AI Blog] Running Reviewer Agent...");
    const reviewerPrompt = `You are a strict editorial reviewer. Review the following blog draft.
Draft:
${draft}

Rules to check against: Tone must be ${settings.toneOfVoice}. Must not be generic or 'soulless'. Custom rules: ${settings.customPrompts || 'None'}.
If it passes, return {"passed": true, "feedback": "none"}.
If it fails or needs improvement, return {"passed": false, "feedback": "specific instructions on what to fix"}.`;

    const reviewerRes = await ai.models.generateContent({
      model: process.env.GEMINI_FLASH_MODEL || 'gemini-2.5-flash',
      contents: reviewerPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["passed", "feedback"]
        }
      }
    });

    const review = JSON.parse(reviewerRes.text || '{}');
    if (!review.passed) {
      console.log("[AI Blog] Draft failed review. Revising...", review.feedback);
      const revisionPrompt = `Revise the following draft based on this feedback from the editor: ${review.feedback}
Draft:
${draft}`;
      const revisionRes = await ai.models.generateContent({
        model: process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro',
        contents: revisionPrompt,
      });
      draft = revisionRes.text || draft;
    }

    // 4. TRANSLATOR & SEO AGENT (Gemini 2.5 Pro)
    console.log("[AI Blog] Running Translator & SEO Agent...");
    const seoPrompt = `Translate the following English blog draft into Turkish (tr), German (de), and Russian (ru). 
Also, generate an SEO-optimized Title and Meta Description for each language. Extract SEO keywords (comma separated) in English.
Draft:
${draft}

Return strictly in this JSON format:
{
  "en": { "title": "...", "description": "...", "content": "..." },
  "tr": { "title": "...", "description": "...", "content": "..." },
  "de": { "title": "...", "description": "...", "content": "..." },
  "ru": { "title": "...", "description": "...", "content": "..." },
  "seo_keywords": "keyword1, keyword2, keyword3"
}`;

    const seoRes = await ai.models.generateContent({
      model: process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro',
      contents: seoPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            en: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, content: { type: Type.STRING } } },
            tr: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, content: { type: Type.STRING } } },
            de: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, content: { type: Type.STRING } } },
            ru: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, content: { type: Type.STRING } } },
            seo_keywords: { type: Type.STRING }
          }
        }
      }
    });

    const finalData = JSON.parse(seoRes.text || '{}');

    // 5. SAVE TO DB
    console.log("[AI Blog] Saving to database...");
    
    // Generate slug from TR title (or EN if TR missing)
    let baseSlug = (finalData.tr?.title || finalData.en?.title || "ai-blog").toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const [insertedBlog] = await db.insert(blogs).values({
      slug: baseSlug + '-' + Math.floor(Math.random() * 1000), // Append random to ensure unique for now
      icon: 'sparkles',
      img_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995', // Placeholder AI image
      
      title_tr: finalData.tr?.title || "Taslak",
      title_en: finalData.en?.title || "Draft",
      title_de: finalData.de?.title || "Entwurf",
      title_ru: finalData.ru?.title || "Проект",
      
      description_tr: finalData.tr?.content || draft,
      description_en: finalData.en?.content || draft,
      description_de: finalData.de?.content || draft,
      description_ru: finalData.ru?.content || draft,

      seo_keywords: finalData.seo_keywords,
      meta_description: finalData.en?.description,
      
      links: research.sources || [],
      isActive: settings.publishMode === 'auto_publish', // Draft if not auto publish
    }).returning();

    if (!insertedBlog) {
      if (activePlanId) {
        await db.update(aiBlogPlans).set({ status: 'failed' }).where(eq(aiBlogPlans.id, activePlanId));
      }
      throw new Error("Failed to insert the generated blog into the database.");
    }

    // Mark plan as completed
    if (activePlanId) {
      await db.update(aiBlogPlans).set({ status: 'completed' }).where(eq(aiBlogPlans.id, activePlanId));
    }

    console.log("[AI Blog] Blog generated successfully! ID:", insertedBlog.id);
    return insertedBlog;
  }
}
