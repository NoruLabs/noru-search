const fs = require('fs');
let code = fs.readFileSync('app/news/SpaceNewsPanel.tsx', 'utf8');

const startIdx = code.indexOf('<div className="flex gap-4 shrink-0 animate-marquee');
const endIdx = code.indexOf(') : (\n          displayItems.map((item) => (');

// Wait, the end of the `carousel` true arm is:
//          </div>
//        ) : (
const exactEnd = code.indexOf('</div>\n        ) : (', startIdx);
if (startIdx > -1 && exactEnd > -1) {
  const block = code.substring(startIdx, exactEnd + 6); // include "</div>\n"
  const newBlock = block + block.replace('animate-marquee', 'animate-marquee" aria-hidden="true');
  code = code.replace(block, newBlock);
  fs.writeFileSync('app/news/SpaceNewsPanel.tsx', code);
  console.log('Duplicated carousel block');
} else {
  console.log('Failed to find block boundaries.');
}