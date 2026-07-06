const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/courses/math/math10.json');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all matches of the pattern
  const regex = /\s*\(Câu\s+\d+\s+trang\s+\d+\)/gi;
  const matches = content.match(regex);
  
  console.log(`Found ${matches ? matches.length : 0} matches:`);
  if (matches) {
    console.log(Array.from(new Set(matches)));
  }

  // Replace
  const cleanedContent = content.replace(regex, '');
  
  // Parse to verify it's still valid JSON
  const parsed = JSON.parse(cleanedContent);
  console.log("JSON parsing check: SUCCESS!");
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 4), 'utf8');
  console.log("Successfully wrote cleaned JSON back to math10.json!");
} catch (e) {
  console.error("Error:", e);
}
