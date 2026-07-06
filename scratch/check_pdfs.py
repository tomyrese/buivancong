import fitz, os, sys

# Set standard output encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

base = 'src/pdf/Suy Luận Khoa Học'
with open('scratch/pdfs_content.txt', 'w', encoding='utf-8') as out:
    for f in sorted(os.listdir(base)):
        if f.endswith('.pdf'):
            path = os.path.join(base, f)
            try:
                doc = fitz.open(path)
                first_page_text = doc[0].get_text()
                out.write(f"File: {f}\n")
                out.write(f"First 300 chars:\n{first_page_text[:300]}\n")
                out.write("="*40 + "\n")
                doc.close()
            except Exception as e:
                out.write(f"Error reading {f}: {e}\n")
print("Done writing to scratch/pdfs_content.txt")
