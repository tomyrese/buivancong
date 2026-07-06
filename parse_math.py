import json, os, re

sources_dir = 'src/sources'

def read_text(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def parse_mcq_questions(text):
    """Parse multiple choice questions from extracted PDF text."""
    questions = []
    
    # Split by question markers
    parts = re.split(r'»\s*C[aà]u\s+(\d+)[.†]\s*', text)
    
    if len(parts) < 2:
        return questions
    
    # parts[0] is text before first question, then alternating: id, text
    for i in range(1, len(parts)-1, 2):
        q_id = parts[i]
        q_block = parts[i+1]
        
        # Extract question text (until first option)
        options_match = re.findall(r'([A-D])[.†]\s*([^A-D]*?)(?=[A-D][.†]|$)', q_block, re.DOTALL)
        
        if len(options_match) >= 2:
            # Find where options start
            first_option_pos = len(q_block)
            for opt_letter, opt_text in options_match:
                pos = q_block.find(f'{opt_letter}.')
                if pos > 0 and pos < first_option_pos:
                    first_option_pos = pos
            
            q_text = q_block[:first_option_pos].strip()
            # Clean up the question text
            q_text = re.sub(r'\s+', ' ', q_text).strip()
            
            # Extract clean options
            letter_order = ['A', 'B', 'C', 'D']
            options_list = []
            for letter in letter_order:
                for opt_letter, opt_text in options_match:
                    if opt_letter == letter:
                        clean_opt = re.sub(r'\s+', ' ', opt_text).strip()
                        options_list.append(f'{letter}. {clean_opt}')
                        break
            
            if not q_text or len(options_list) < 2:
                continue
                
            q_text = q_text.lstrip('.,;:')
            
            questions.append({
                'id': q_id,
                'type': 'multiple_choice',
                'question': q_text,
                'options': options_list,
                'answer': ''
            })
    
    return questions

def parse_toc(text):
    """Parse table of contents to get chapter and topic structure."""
    chapters = []
    current_chapter = None
    
    lines = text.split('\n')
    for line in lines:
        line_stripped = line.strip()
        
        # Match chapter headings
        ch_match = re.match(r'(?:CH[ƯU]ƠNG|Chương)\s+(\d+)[.†]\s+(.+)', line_stripped, re.IGNORECASE)
        if ch_match:
            if current_chapter:
                chapters.append(current_chapter)
            current_chapter = {
                'id': int(ch_match.group(1)),
                'name': ch_match.group(2).strip().rstrip('.'),
                'topics': []
            }
            continue
        
        # Match topic/bài headings
        if current_chapter:
            t_match = re.match(r'(?:B[ÀA]I|Bài)\s+(\d+)[.†]\s+(.+)', line_stripped, re.IGNORECASE)
            if t_match:
                current_chapter['topics'].append({
                    'id': int(t_match.group(1)),
                    'name': t_match.group(2).strip().rstrip('.'),
                    'questions': []
                })
    
    if current_chapter:
        chapters.append(current_chapter)
    
    return chapters

def build_math_json(text):
    """Build complete math JSON from extracted text."""
    chapters = parse_toc(text)
    
    # Also parse all questions
    all_qs = parse_mcq_questions(text)
    
    # Assign questions to topics based on position in text
    if chapters:
        # Simple approach: distribute questions evenly
        q_per_topic = max(1, len(all_qs) // sum(len(ch['topics']) for ch in chapters))
        
        q_idx = 0
        chapter_offset = 1
        for ch in chapters:
            topic_offset = 1
            for topic in ch['topics']:
                chunk = all_qs[q_idx:q_idx + q_per_topic]
                for qi, q in enumerate(chunk):
                    q['id'] = f'toan{chapter_offset}.{topic_offset}.{qi+1}'
                    q['answer'] = ''
                topic['questions'] = chunk
                q_idx += q_per_topic
                topic_offset += 1
            chapter_offset += 1
    
    return {'chapters': chapters}

# Parse Toán 10
print("Parsing Toán 10...")
try:
    text10 = read_text(r'C:\Users\Wuys\AppData\Local\Temp\opencode\Toán_10_Bài_Tập.txt')
    json10 = build_math_json(text10)
    with open(os.path.join(sources_dir, 'toan_10.json'), 'w', encoding='utf-8') as f:
        json.dump(json10, f, ensure_ascii=False, indent=2)
    print(f'  Chapters: {len(json10["chapters"])}')
    total_qs = sum(len(t['questions']) for ch in json10['chapters'] for t in ch['topics'])
    print(f'  Questions: {total_qs}')
except Exception as e:
    print(f'  Error: {e}')

# Parse Toán 11
print("Parsing Toán 11...")
try:
    text11 = read_text(r'C:\Users\Wuys\AppData\Local\Temp\opencode\Toán_11_Bài_Tập.txt')
    json11 = build_math_json(text11)
    with open(os.path.join(sources_dir, 'toan_11.json'), 'w', encoding='utf-8') as f:
        json.dump(json11, f, ensure_ascii=False, indent=2)
    print(f'  Chapters: {len(json11["chapters"])}')
    total_qs = sum(len(t['questions']) for ch in json11['chapters'] for t in ch['topics'])
    print(f'  Questions: {total_qs}')
except Exception as e:
    print(f'  Error: {e}')

# Parse Toán 12
print("Parsing Toán 12...")
try:
    text12 = read_text(r'C:\Users\Wuys\AppData\Local\Temp\opencode\Toán_12.txt')
    json12 = build_math_json(text12)
    with open(os.path.join(sources_dir, 'toan_12.json'), 'w', encoding='utf-8') as f:
        json.dump(json12, f, ensure_ascii=False, indent=2)
    print(f'  Chapters: {len(json12["chapters"])}')
    total_qs = sum(len(t['questions']) for ch in json12['chapters'] for t in ch['topics'])
    print(f'  Questions: {total_qs}')
except Exception as e:
    print(f'  Error: {e}')

print("Done!")
