import json, os, re, sys

sources_dir = 'src/sources'

def read_text(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def clean_text(t):
    t = re.sub(r'\s+', ' ', t).strip()
    t = t.lstrip('.,;:')
    return t

def parse_math_questions(text, subject_prefix, ch_count):
    chapters = []
    
    # Parse TOC for chapter names
    toc_section = text[:text.find('PHẦN 1')] if 'PHẦN 1' in text else text[:2000]
    
    ch_names = {}
    ch_patterns = [
        (r'CH[ƯU]ƠNG\s+(\d+)[.:\s]+([^\n]{2,60})', re.IGNORECASE),
        (r'Chương\s+(\d+)[.:\s]+([^\n]{2,60})', re.IGNORECASE),
    ]
    
    for pat, flags in ch_patterns:
        for m in re.finditer(pat, text[:5000], flags):
            ch_num = int(m.group(1))
            ch_name = m.group(2).strip()
            ch_name = re.sub(r'\s+', ' ', ch_name)
            if ch_num not in ch_names:
                ch_names[ch_num] = ch_name
    
    # Find all MCQ questions (Câu N. format with options A-D)
    q_pattern = r'C[aâ]u\s+(\d+)[.†]\s*([^\n]*?(?=(?:C[aâ]u\s+\d+[.†]|A\.|[Bb]ài|\Z)))'
    
    all_questions = []
    for m in re.finditer(q_pattern, text, re.DOTALL):
        q_id = m.group(1)
        q_body = m.group(2)
        
        # Extract options
        options = {}
        for opt in re.finditer(r'([A-D])[.†]\s*([^\n]*)', q_body):
            letter = opt.group(1)
            opt_text = clean_text(opt.group(2))
            if opt_text and letter in 'ABCD':
                if letter not in options:
                    options[letter] = f'{letter}. {opt_text}'
        
        if len(options) >= 2:
            # Get the question text (before the first option)
            first_opt_pos = len(q_body)
            for opt_letter in ['A', 'B', 'C', 'D']:
                if opt_letter in q_body:
                    pos = q_body.find(f'{opt_letter}.')
                    if pos > 0:
                        first_opt_pos = min(first_opt_pos, pos)
            
            q_text = clean_text(q_body[:first_opt_pos])
            if q_text:
                opts_list = [options.get(l, '') for l in 'ABCD']
                opts_list = [o for o in opts_list if o]
                
                if len(opts_list) >= 2:
                    # Determine type based on content
                    q_type = 'multiple_choice'
                    if len(opts_list) == 2 and any('Đúng' in o or 'Sai' in o or 'đúng' in o or 'sai' in o for o in opts_list):
                        q_type = 'true_false'
                    
                    all_questions.append({
                        'id': q_id,
                        'type': q_type,
                        'question': q_text,
                        'options': opts_list,
                        'answer': ''
                    })
    
    # Build chapter structure
    max_ch = max(ch_names.keys()) if ch_names else ch_count
    
    # Create a simpler structure: group into max_ch chapters
    qs_per_ch = max(1, len(all_questions) // max_ch)
    
    for ch_num in range(1, max_ch + 1):
        ch_name = ch_names.get(ch_num, f'CHƯƠNG {ch_num}')
        start = (ch_num - 1) * qs_per_ch
        end = start + qs_per_ch if ch_num < max_ch else len(all_questions)
        chunk = all_questions[start:end]
        
        # Create a single topic per chapter
        topic = {
            'id': 1,
            'name': ch_name,
            'questions': []
        }
        
        for qi, q in enumerate(chunk):
            q['id'] = f'{subject_prefix}.{ch_num}.{qi+1}'
        
        topic['questions'] = chunk
        
        chapters.append({
            'id': ch_num,
            'name': ch_name,
            'topics': [topic]
        })
    
    return {'chapters': chapters}

# Parse all three levels
configs = [
    ('Toán_10_Bài_Tập.txt', 'toan10', 10),
    ('Toán_11_Bài_Tập.txt', 'toan11', 9),
    ('Toán_12.txt', 'toan12', 6),
]

for fname, prefix, ch_count in configs:
    path = os.path.join(os.environ['TEMP'], 'opencode', fname)
    print(f'Processing {fname}...')
    try:
        text = read_text(path)
        data = parse_math_questions(text, prefix, ch_count)
        total_qs = sum(len(t['questions']) for ch in data['chapters'] for t in ch['topics'])
        print(f'  Chapters: {len(data["chapters"])}, Questions: {total_qs}')
        
        out_path = os.path.join(sources_dir, f'toan_{configs.index(configs)+10}.json')
        # Use proper filenames: toan_10.json, toan_11.json, toan_12.json
        pass
    
    except Exception as e:
        print(f'  Error: {e}')

print('Done!')
