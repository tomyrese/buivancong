const fs = require('fs');
const path = require('path');

const dir1 = path.join(__dirname, '../src/courses/scientific_reasoning');
fs.readdirSync(dir1).forEach(f => {
  if (f.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(dir1, f), 'utf8'));
    console.log(`File: src/courses/scientific_reasoning/${f}`);
    console.log(`  Document: ${JSON.stringify(data.document ? data.document.title : 'No document key')}`);
    if (data.chapters) {
      console.log(`  First Chapter: ${data.chapters[0].name}`);
    }
  }
});

const dir2 = path.join(__dirname, '../src/courses/math');
fs.readdirSync(dir2).forEach(f => {
  if (f.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(dir2, f), 'utf8'));
    console.log(`File: src/courses/math/${f}`);
    console.log(`  Document: ${JSON.stringify(data.document ? data.document.title : 'No document key')}`);
    if (data.chapters) {
      console.log(`  First Chapter: ${data.chapters[0].name}`);
    }
  }
});
