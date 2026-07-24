const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src/app/[locale]/admin');
const filesToFix = [
  'about/page.tsx',
  'ai-settings/page.tsx',
  'blogs/page.tsx',
  'contact/page.tsx',
  'images/page.tsx',
  'projects/edit/[id]/page.tsx',
  'projects/new/page.tsx',
  'projects/page.tsx',
  'skills/page.tsx'
];

filesToFix.forEach(file => {
  const targetFile = path.join(adminDir, file);
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');
    
    // Check if 'use client' is in the file but not at the top
    if (content.includes("'use client'") || content.includes('"use client"')) {
      // Remove all instances of use client
      content = content.replace(/'use client';?\n?/g, '');
      content = content.replace(/"use client";?\n?/g, '');
      
      // Prepend 'use client'; at the very top
      content = "'use client';\n" + content;
      
      fs.writeFileSync(targetFile, content);
      console.log(`Fixed 'use client' in ${file}`);
    }
  }
});
