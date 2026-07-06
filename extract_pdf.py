import fitz, os

base = 'src/pdf/Suy Luận Khoa Học'
outdir = os.path.join(os.environ['TEMP'], 'opencode')
os.makedirs(outdir, exist_ok=True)

for f in sorted(os.listdir(base)):
    if not f.endswith('.pdf'):
        continue
    path = os.path.join(base, f)
    doc = fitz.open(path)
    text = ''
    for page in doc:
        text += page.get_text()
    name = f.replace('.pdf', '')
    outpath = os.path.join(outdir, name + '.txt')
    with open(outpath, 'w', encoding='utf-8') as fp:
        fp.write(text)
    doc.close()
    print(f'Saved: {outpath}')

# Also extract Toán PDFs
base2 = 'src/pdf/Toán'
for grade in sorted(os.listdir(base2)):
    gpath = os.path.join(base2, grade)
    if not os.path.isdir(gpath):
        continue
    for f in sorted(os.listdir(gpath)):
        if not f.endswith('.pdf'):
            continue
        path = os.path.join(gpath, f)
        doc = fitz.open(path)
        text = ''
        for page in doc:
            text += page.get_text()
        name = f.replace('.pdf', '')
        outpath = os.path.join(outdir, name + '.txt')
        with open(outpath, 'w', encoding='utf-8') as fp:
            fp.write(text)
        doc.close()
        print(f'Saved: {outpath}')
