import re, sys

with open(r'C:\Users\Wuys\AppData\Local\Temp\opencode\Toán_10_Bài_Tập.txt', 'r', encoding='utf-8') as f:
    text = f.read()

out = []
# Find "Câu hỏi" sections 
idx = text.find('Câu hỏi')
if idx >= 0:
    out.append(f"'Câu hỏi' found at index {idx}")
    out.append(f"Context: {repr(text[idx:idx+200])}")
else:
    out.append("'Câu hỏi' NOT found")

# Check for '»' character
idx2 = text.find('»')
out.append(f"'»' first at index {idx2}")
if idx2 >= 0:
    out.append(f"Context: {repr(text[idx2:idx2+200])}")

# Try different patterns  
for pattern_name, pattern in [
    ("Câu \\d+[.]", r"C[aà]u\s+\d+\."),
    ("» Câu", r"»\s*C[aà]u"),
    ("Câu \\d+[.†]", r"C[aà]u\s+\d+[.†]"),
]:
    matches = list(re.finditer(pattern, text))
    out.append(f"\nPattern '{pattern_name}': {len(matches)} matches")
    for m in matches[:3]:
        start = max(0, m.start()-20)
        end = min(len(text), m.end()+80)
        out.append(f"  pos {m.start()}: ...{repr(text[start:end])[:150]}...")

with open(r'C:\Users\Wuys\AppData\Local\Temp\opencode\debug_math.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
print('Debug saved')
