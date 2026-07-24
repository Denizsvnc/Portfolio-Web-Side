import { AiService } from './src/modules/ai/ai.service';
AiService.generateBlogFlow('test topic').then(res => console.log('SUCCESS:', res)).catch(err => console.error('ERROR:', err.message));
