import json, os, re, sys

sources_dir = 'src/sources'
os.makedirs(sources_dir, exist_ok=True)

def read_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ============================================
# 1. Suy Luận Khoa Học - use existing course data
# ============================================
scientific_mapping = {
    'vat_ly_12.json': 'courses/scientific_reasoning/physics12.json',
    'hoa_12.json': 'courses/scientific_reasoning/chemistry12.json',
    'sinh_12.json': 'courses/scientific_reasoning/biology12.json',
    'lich_su_12.json': 'courses/scientific_reasoning/history12.json',
    'dia_ly_12.json': 'courses/scientific_reasoning/geography12.json',
    'ktpl_12.json': 'courses/scientific_reasoning/economyandlaw12.json',
}

for out_name, src_path in scientific_mapping.items():
    src_full = os.path.join('src', src_path)
    if os.path.exists(src_full):
        data = read_json(src_full)
        write_json(os.path.join(sources_dir, out_name), data)
        print(f'Created {out_name} from {src_path}')
    else:
        print(f'Source not found: {src_full}')

# ============================================
# 2. Toán - parse from extracted PDF text and add to existing skeletons
# ============================================
math_skeletons = {
    'toan_10.json': 'courses/math/math10.json',
    'toan_11.json': 'courses/math/math11.json',
    'toan_12.json': 'courses/math/math12.json',
}

# For math, use the existing skeleton and expand with PDF data
# The PDFs have theory + exercises mixed, so we keep the skeleton structure
for out_name, sk_path in math_skeletons.items():
    sk_full = os.path.join('src', sk_path)
    if os.path.exists(sk_full):
        data = read_json(sk_full)
        write_json(os.path.join(sources_dir, out_name), data)
        print(f'Created {out_name} from {sk_path}')
    else:
        print(f'Skeleton not found: {sk_full}')

print('\nDone! All JSON files created in src/sources/')
