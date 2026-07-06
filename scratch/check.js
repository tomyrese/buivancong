const fs = require('fs');
const path = require('path');

const physicsPath = path.join(__dirname, '../src/courses/scientific_reasoning/physics12.json');

try {
  const content = fs.readFileSync(physicsPath, 'utf8');
  const data = JSON.parse(content);
  
  const bioKeywords = ['dna', 'di truyền', 'gen', 'nhiễm sắc thể', 'sinh học', 'tế bào', 'tiến hóa', 'phả hệ'];
  
  data.chapters.forEach((ch, cIdx) => {
    if (ch.topics) {
      ch.topics.forEach((t, tIdx) => {
        if (t.questions) {
          t.questions.forEach((q, qIdx) => {
            const text = (q.question + ' ' + (q.options || []).join(' ') + ' ' + (q.explanation || '')).toLowerCase();
            const matched = bioKeywords.filter(kw => text.includes(kw));
            if (matched.length > 0) {
              console.log(`Match in Ch ${ch.id}, Topic ${t.name}:`);
              console.log(`Question: ${q.question}`);
              console.log(`Matched Keywords: ${matched.join(', ')}`);
              console.log('---');
            }
          });
        }
      });
    }
  });
} catch (e) {
  console.error('Error:', e);
}
