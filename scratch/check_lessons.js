const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/lessons.json');
try {
  const content = fs.readFileSync(file, 'utf8');
  const lessons = JSON.parse(content);
  lessons.forEach(l => {
    console.log(`ID: ${l.id}`);
    console.log(`Course: ${l.courseId}`);
    console.log(`Title: ${l.title}`);
    console.log(`Content snippet: ${l.content.substring(0, 150).replace(/\n/g, ' ')}...`);
    console.log('---');
  });
} catch(e) {
  console.error(e);
}
