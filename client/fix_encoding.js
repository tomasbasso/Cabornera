
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'index.css');
const content = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

console.log(`Overwriting ${filePath} with clean UTF-8...`);
try {
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    console.log('Success: File written without BOM.');
} catch (e) {
    console.error('Error writing file:', e);
}
