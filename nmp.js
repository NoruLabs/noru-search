const fs = require('fs');
let code = fs.readFileSync('app/nasa-media/NasaMediaPanel.tsx', 'utf8');

const sIdx = code.indexOf('<div className="flex flex-col md:flex-row md:items-center');
const eIdx = code.indexOf('{/* Error state */}');

if (sIdx > -1 && eIdx > -1 && !code.includes('!hideHeader && (<div className="flex flex-col')) {
  const block = code.substring(sIdx, eIdx);
  code = code.replace(block, '{!hideHeader && (\n        ' + block.trim() + '\n      )}\n\n      ');
  fs.writeFileSync('app/nasa-media/NasaMediaPanel.tsx', code);
  console.log('Hiding header updated');
} else {
  console.log('Could not find block', sIdx, eIdx);
}
