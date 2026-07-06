import json, os, re, sys

sources_dir = 'src/sources'
TEMP = os.environ['TEMP']

def read_text(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# ============ Chapter name extraction from TOC ============
def extract_toc_chapters(text):
    """Extract chapter names from the TOC section (first ~200 lines)."""
    chapters = {}
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if i > 200:
            break
        m = re.match(r'(?:CH[UƯ]ƠNG|Chương)\s+(\d+)\s*[.:]\s*(.{2,60})', line, re.IGNORECASE)
        if m:
            ch = int(m.group(1))
            name = re.sub(r'\s+', ' ', m.group(2)).strip().rstrip('.')
            chapters[ch] = name
    return chapters

def extract_toc_math10(text):
    """Extract all chapter names from Toán 10 TOC."""
    chs = {}
    lines = text.split('\n')
    for line in lines[:250]:
        m = re.match(r'Chương\s+(\d+)[.†]\s*(.{2,60})', line)
        if m:
            chs[int(m.group(1))] = re.sub(r'\s+', ' ', m.group(2)).strip()
    return chs

# ============ MCQ extraction for Math ============
def extract_mcqs(text, subject_prefix):
    """Extract MCQs from 'Câu hỏi' sections."""
    questions = []
    
    # Find "Câu hỏi" sections
    sections = text.split('Câu hỏi')
    
    for sec_idx, section in enumerate(sections):
        if sec_idx == 0:
            continue
            
        # Look for numbered questions
        q_pattern = r'C[aâ]u\s+(\d+)[.†]\s*'
        q_starts = list(re.finditer(q_pattern, section))
        
        for i, qm in enumerate(q_starts):
            q_num = qm.group(1)
            
            # Determine end: next question or end of section
            if i + 1 < len(q_starts):
                block = section[qm.end():q_starts[i+1].start()]
            else:
                block = section[qm.end():]
            
            # Extract options A-D
            opts = {}
            for om in re.finditer(r'([A-D])\s*[.†]\s*([^\n]*)', block):
                letter, opt_text = om.group(1), om.group(2).strip()
                if letter in 'ABCD' and letter not in opts and len(opt_text) > 1:
                    opts[letter] = f'{letter}. {opt_text}'
            
            if len(opts) >= 2:
                # Get question text (before first option)
                first_opt_pos = len(block)
                for ol in ['A', 'B', 'C', 'D']:
                    for om2 in re.finditer(rf'{ol}\s*[.†]', block):
                        pos = om2.start()
                        if 10 < pos < first_opt_pos:
                            first_opt_pos = pos
                
                q_text = block[:first_opt_pos].strip()
                q_text = re.sub(r'\s+', ' ', q_text)
                q_text = q_text.strip('.,;: \n\r\t')
                
                if q_text and len(q_text) > 10:
                    opt_list = [opts.get(l, '') for l in 'ABCD']
                    opt_list = [o for o in opt_list if o]
                    
                    questions.append({
                        'question': q_text,
                        'options': opt_list
                    })
    
    return questions

# ============ Structure questions into chapters ============
def structure_math(chapters, questions, subject_prefix):
    result = []
    if not chapters:
        return [{'id': 1, 'name': 'Tổng hợp', 'topics': [{'id': 1, 'name': 'Bài tập', 'questions': questions[:50]}], }]
    
    qs = questions[:]
    total_ch = max(chapters.keys())
    qs_per_ch = max(1, len(qs) // total_ch) if qs else 0
    
    for ch_num in range(1, total_ch + 1):
        ch_name = chapters.get(ch_num, f'CHƯƠNG {ch_num}')
        
        start = (ch_num - 1) * qs_per_ch
        end = start + qs_per_ch if ch_num < total_ch else len(qs)
        chunk = qs[start:end]
        
        topic_qs = []
        for qi, q in enumerate(chunk):
            topic_qs.append({
                'id': f'{subject_prefix}.{ch_num}.{qi+1}',
                'type': 'multiple_choice' if len(q['options']) > 2 else 'true_false',
                'question': q['question'],
                'options': q['options'],
                'answer': ''
            })
        
        result.append({
            'id': ch_num,
            'name': ch_name,
            'topics': [{'id': 1, 'name': ch_name, 'questions': topic_qs}]
        })
    
    return result

# ============ Process each Math file ============
def process_math(fname, subject_prefix, chapter_extractor):
    path = os.path.join(TEMP, 'opencode', fname)
    if not os.path.exists(path):
        print(f'  File not found: {path}')
        # Try alternate with encoding
        for f in os.listdir(os.path.join(TEMP, 'opencode')):
            if fname.replace(' ', '_') in f or fname in f:
                path = os.path.join(TEMP, 'opencode', f)
                break
    
    print(f'  Reading: {path}')
    text = read_text(path)
    
    chapters = chapter_extractor(text)
    questions = extract_mcqs(text, subject_prefix)
    
    print(f'  Found {len(chapters)} chapters, {len(questions)} questions')
    
    data = structure_math(chapters, questions, subject_prefix)
    return {'chapters': data}

# Toán 10
print('=== Toán 10 ===')
try:
    data10 = process_math('Toán_10_Bài_Tập.txt', 'toan10', extract_toc_math10)
    out10 = os.path.join(sources_dir, 'toan_10.json')
    with open(out10, 'w', encoding='utf-8') as f:
        json.dump(data10, f, ensure_ascii=False, indent=2)
    total = sum(len(t['questions']) for ch in data10['chapters'] for t in ch['topics'])
    print(f'  Saved: {total} questions')
except Exception as e:
    print(f'  Error: {e}')

# Toán 11
print('=== Toán 11 ===')
try:
    data11 = process_math('Toán_11_Bài_Tập.txt', 'toan11', extract_toc_math10)
    out11 = os.path.join(sources_dir, 'toan_11.json')
    with open(out11, 'w', encoding='utf-8') as f:
        json.dump(data11, f, ensure_ascii=False, indent=2)
    total = sum(len(t['questions']) for ch in data11['chapters'] for t in ch['topics'])
    print(f'  Saved: {total} questions')
except Exception as e:
    print(f'  Error: {e}')

# Toán 12  
print('=== Toán 12 ===')
try:
    data12 = process_math('Toán_12.txt', 'toan12', extract_toc_math10)
    out12 = os.path.join(sources_dir, 'toan_12.json')
    with open(out12, 'w', encoding='utf-8') as f:
        json.dump(data12, f, ensure_ascii=False, indent=2)
    total = sum(len(t['questions']) for ch in data12['chapters'] for t in ch['topics'])
    print(f'  Saved: {total} questions')
except Exception as e:
    print(f'  Error: {e}')

print('=== Complete ===')
