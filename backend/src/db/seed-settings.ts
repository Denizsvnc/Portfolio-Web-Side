import { db } from "./index";
import { siteSettings } from "./schema";
import "dotenv/config";

const seedSettings = async () => {
  const defaults = [
    { key: "github_url", value: "https://github.com/Denizsvnc" },
    { key: "linkedin_url", value: "https://www.linkedin.com/in/deniz-sevinç-819529261" },
    { key: "phone_number", value: "+905478985659" },
    { key: "email_address", value: "info@denizsevinc.com.tr" },
    { key: "instagram_url", value: "https://www.instagram.com/denizsevinc0_/" },
  ];

  for (const item of defaults) {
    await db.insert(siteSettings).values(item).onConflictDoNothing();
  }
  
  console.log("Settings seeded successfully.");
  process.exit(0);
};

seedSettings();
