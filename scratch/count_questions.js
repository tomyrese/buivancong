const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/courses/scientific_reasoning/physics12.json');
try {
  const content = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(content);
  data.chapters.forEach(c => {
    console.log(`Chapter: ${c.name}`);
    c.topics.forEach(t => {
      console.log(`  Topic: ${t.name}`);
      console.log(`    Questions count: ${t.questions ? t.questions.length : 0}`);
      if (t.questions) {
        console.log(`    First Question: ${t.questions[0].question}`);
        console.log(`    Last Question: ${t.questions[t.questions.length - 1].question}`);
      }
    });
  });
} catch(e) {
  console.error(e);
}
