import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foldersToScan = [
  'src/components/common',
  'src/components/layout',
  'src/components/cards',
  'src/components',
  'src/pages',
  'src/pages/auth'
];

foldersToScan.forEach((folderPath) => {
  const fullPath = path.join(__dirname, folderPath);

  const files = fs.readdirSync(fullPath)
    .filter(file =>
      file.endsWith('.jsx') || file.endsWith('.js')
    )
    .filter(file => file !== 'index.js');

  const exports = files.map(file => {
    const name = path.basename(file, path.extname(file));
    return `export { default as ${name} } from './${name}';`;
  });

  fs.writeFileSync(
    path.join(fullPath, 'index.js'),
    exports.join('\n') + '\n'
  );

  console.log(`✅ index.js generated in ${folderPath}`);
});
