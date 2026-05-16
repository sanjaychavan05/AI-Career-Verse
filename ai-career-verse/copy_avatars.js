const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'frontend', 'public', 'avatars');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const srcDir = 'C:\\Users\\Asus\\.gemini\\antigravity\\brain\\df42b652-3609-43d5-b92d-6a1ff1267757';
const copies = {
  'avatar_priya_1778928171849.png': 'priya.png',
  'avatar_rahul_1778928187443.png': 'rahul.png',
  'avatar_james_1778928202362.png': 'james.png',
  'avatar_nina_1778928242094.png': 'nina.png',
  'avatar_sneha2_1778928302876.png': 'sneha.png',
  'avatar_ryan_1778928274255.png': 'ryan.png',
  'avatar_user_default_1778928318134.png': 'default.png',
};

Object.entries(copies).forEach(([src, dest]) => {
  const srcPath = path.join(srcDir, src);
  const destPath = path.join(destDir, dest);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${dest}`);
  } catch (e) {
    console.error(`Failed ${dest}: ${e.message}`);
  }
});
console.log('Done!');
