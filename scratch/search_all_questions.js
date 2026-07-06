const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/courses/scientific_reasoning');
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (f.endsWith('.json')) {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const data = JSON.parse(content);
    console.log(`File: ${f}`);
    let physicsCount = 0;
    let bioCount = 0;
    
    const checkText = (text) => {
      const t = text.toLowerCase();
      if (t.includes('nhiệt') || t.includes('phấn hoa') || t.includes('vật lý') || t.includes('kelvin') || t.includes('celsius')) {
        physicsCount++;
      }
      if (t.includes('dna') || t.includes('gen') || t.includes('di truyền') || t.includes('phả hệ') || t.includes('nhiễm sắc thể') || t.includes('tế bào')) {
        bioCount++;
      }
    };

    data.chapters.forEach(ch => {
      if (ch.topics) {
        ch.topics.forEach(t => {
          if (t.questions) {
            t.questions.forEach(q => {
              const text = (q.question + ' ' + (q.options || []).join(' '));
              checkText(text);
            });
          }
        });
      }
    });
    
    console.log(`  Physics keywords count: ${physicsCount}`);
    console.log(`  Biology keywords count: ${bioCount}`);
  }
});
