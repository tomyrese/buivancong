const fs = require('fs');
const path = require('path');

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/courses.json'), 'utf8'));

courses.forEach(c => {
  if (c.id === 'physics-12') {
    Object.keys(c).forEach(key => {
      const val = c[key];
      const text = JSON.stringify(val).toLowerCase();
      if (text.includes('sinh') || text.includes('di truyền') || text.includes('biology')) {
        console.log(`Matching key: ${key}`);
        console.log(`Value:`, val);
      }
    });
  }
});
