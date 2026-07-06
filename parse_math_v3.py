import json, os, re, sys

sys.stdout.reconfigure(encoding='utf-8')

sources_dir = 'src/sources'
TEMP = os.environ['TEMP']

def read_text(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def find_file(fname_base):
    """Find file in temp dir matching base name."""
    d = os.path.join(TEMP, 'opencode')
    for f in os.listdir(d):
        if f.startswith(fname_base) and f.endswith('.txt') and 'Dap' not in f and 'Đáp' not in f and 'dap' not in f:
            return os.path.join(d, f)
    return None

def extract_toc(text):
    """Extract chapters from TOC."""
    chs = {}
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if i > 300:
            break
        m = re.match(r'(?:CH[UƯ]ƠNG|Chương)\s+(\d+)\s*[.:†]\s*(.{2,60})', line)
        if m:
            chs[int(m.group(1))] = re.sub(r'\s+', ' ', m.group(2)).strip().rstrip('.')
    return chs

def extract_mcqs(text):
    """Extract MCQ questions from text."""
    qs = []
    
    # Pattern: Câu N. followed by options A., B., C., D.
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Check if this line starts a question
        qm = re.match(r'C[aâ]u\s+(\d+)\s*[.†]', line)
        if qm:
            q_num = qm.group(1)
            q_text = line[qm.end():].strip()
            
            # Look ahead for options
            opts = {}
            j = i + 1
            while j < len(lines) and j < i + 15:
                next_line = lines[j].strip()
                om = re.match(r'([A-D])\s*[.†]\s*(.+)', next_line)
                if om:
                    opts[om.group(1)] = f'{om.group(1)}. {om.group(2).strip()}'
                elif next_line and not re.match(r'[A-D]\s*[.†]', next_line) and not re.match(r'C[aâ]u\s+\d+', next_line):
                    # Continuation of question text
                    if not opts:
                        q_text += ' ' + next_line
                elif re.match(r'C[aâ]u\s+\d+', next_line):
                    j -= 1
                    break
                j += 1
            
            if len(opts) >= 2:
                q_text = re.sub(r'\s+', ' ', q_text).strip('.,;: ')
                if len(q_text) > 10:
                    opt_list = [opts.get(l, '') for l in 'ABCD']
                    opt_list = [o for o in opt_list if o]
                    qs.append({'question': q_text, 'options': opt_list})
            
            i = j
        else:
            i += 1
    
    return qs

def build_json(text, prefix, max_ch=10):
    chs = extract_toc(text)
    qs = extract_mcqs(text)
    
    print(f'  Chapters: {len(chs)}, Questions: {len(qs)}')
    
    # Build structured JSON
    chapters = []
    
    if not chs:
        # Fallback: single chapter
        topic_qs = []
        for qi, q in enumerate(qs[:50]):
            topic_qs.append({
                'id': f'{prefix}.1.{qi+1}',
                'type': 'multiple_choice',
                'question': q['question'],
                'options': q['options'],
                'answer': ''
            })
        chapters.append({
            'id': 1,
            'name': 'Bài tập',
            'topics': [{'id': 1, 'name': 'Tổng hợp', 'questions': topic_qs}]
        })
        return {'chapters': chapters}
    
    max_ch_num = max(chs.keys()) if chs else max_ch
    qs_per_ch = max(1, len(qs) // max_ch_num) if qs else 0
    
    for ch_num in range(1, max_ch_num + 1):
        ch_name = chs.get(ch_num, f'Chương {ch_num}')
        start = (ch_num - 1) * qs_per_ch
        end = start + qs_per_ch if ch_num < max_ch_num else len(qs)
        chunk = qs[start:end]
        
        topic_qs = []
        for qi, q in enumerate(chunk):
            topic_qs.append({
                'id': f'{prefix}.{ch_num}.{qi+1}',
                'type': 'multiple_choice',
                'question': q['question'],
                'options': q['options'],
                'answer': ''
            })
        
        chapters.append({
            'id': ch_num,
            'name': ch_name,
            'topics': [{'id': 1, 'name': ch_name, 'questions': topic_qs}]
        })
    
    return {'chapters': chapters}

# Process files
for fname_base, prefix, max_ch in [
    ('Toán_10_Bài_Tập', 'toan10', 10),
    ('Toán_11_Bài_Tập', 'toan11', 9),
    ('Toán_12', 'toan12', 6),
]:
    print(f'=== {prefix} ===')
    fpath = find_file(fname_base)
    if not fpath:
        print(f'  File not found for {fname_base}')
        continue
    print(f'  Reading: {fpath}')
    text = read_text(fpath)
    data = build_json(text, prefix, max_ch)
    
    out_path = os.path.join(sources_dir, f'{prefix.replace("toan", "toan_")}.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    total = sum(len(t['questions']) for ch in data['chapters'] for t in ch['topics'])
    print(f'  Saved: {total} questions to {out_path}')

print('=== Complete ===')
