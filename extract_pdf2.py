import fitz, os, sys

outdir = os.path.join(os.environ['TEMP'], 'opencode')
os.makedirs(outdir, exist_ok=True)

def extract_all(pdf_path):
    doc = fitz.open(pdf_path)
    text = ''
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

# Suy Luận Khoa Học
base = 'src/pdf/Suy Luận Khoa Học'
for f in sorted(os.listdir(base)):
    if not f.endswith('.pdf'):
        continue
    path = os.path.join(base, f)
    text = extract_all(path)
    name = f.replace('.pdf', '').replace(' ', '_')
    outpath = os.path.join(outdir, name + '.txt')
    with open(outpath, 'w', encoding='utf-8') as fp:
        fp.write(text)

# Toán
base2 = 'src/pdf/Toán'
for grade in sorted(os.listdir(base2)):
    gpath = os.path.join(base2, grade)
    if not os.path.isdir(gpath):
        continue
    for f in sorted(os.listdir(gpath)):
        if not f.endswith('.pdf'):
            continue
        path = os.path.join(gpath, f)
        text = extract_all(path)
        name = f.replace('.pdf', '').replace(' ', '_')
        outpath = os.path.join(outdir, name + '.txt')
        with open(outpath, 'w', encoding='utf-8') as fp:
            fp.write(text)

# List files
for f in sorted(os.listdir(outdir)):
    if f.endswith('.txt'):
        print(f)
