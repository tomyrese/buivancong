import re

with open(r'C:\Users\Wuys\AppData\Local\Temp\opencode\Toán_10_Bài_Tập.txt', 'r', encoding='utf-8') as f:
    text = f.read()

idx = 30403
snippet = text[idx:idx+100]

# Show exact character codes
out = []
for i, ch in enumerate(snippet[:30]):
    out.append(f"  char {i}: U+{ord(ch):04X} = {repr(ch)}")

out.append(f"\nFull snippet: {repr(snippet[:100])}")

# Try matching with the exact characters
pattern = r'\xbb\s*C[aà]u\s+\d+\.'
matches = list(re.finditer(pattern, text))
out.append(f"\nExact hex pattern '\\xbb C[aà]u': {len(matches)} matches")

# Check what character is at position 30403
out.append(f"\nChar at 30403: U+{ord(text[30403]):04X}")
out.append(f"Char at 30404: U+{ord(text[30404]):04X}")
out.append(f"Char at 30405: U+{ord(text[30405]):04X}")

# Try matching 'Câu' 
matches2 = list(re.finditer(r'Câu\s+\d+\.', text))
out.append(f"\nPattern 'Câu \\\\d+\\\\.': {len(matches2)} matches")
for m in matches2[:3]:
    out.append(f"  pos {m.start()}: {repr(text[m.start():m.end()+50])}")

with open(r'C:\Users\Wuys\AppData\Local\Temp\opencode\debug_math2.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))
print('Debug2 saved')
