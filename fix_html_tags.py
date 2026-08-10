import re

with open("src/components/WebshopComponent.tsx", "r") as f:
    content = f.read()

# Insert stripHtml at the top
if "const stripHtml =" not in content:
    content = content.replace(
        "const EditableText = ({ tag: Tag",
        "const stripHtml = (html: string) => {\n  if (!html) return '';\n  return html.replace(/<[^>]*>?/gm, '');\n};\n\nconst EditableText = ({ tag: Tag"
    )

replacements = [
    (r'\{activeCategory\.name\}', r'{stripHtml(activeCategory.name)}'),
    (r'\{activeSubcategory\.name\}', r'{stripHtml(activeSubcategory.name)}'),
    (r'\{activeSubcategory\.name\.toLowerCase\(\)\}', r'{stripHtml(activeSubcategory.name).toLowerCase()}'),
    (r'\{activeProduct\.name\}', r'{stripHtml(activeProduct.name)}'),
    (r'\{cat\.name\}', r'{stripHtml(cat.name)}'),
    (r'\{p\.name\}', r'{stripHtml(p.name)}')
]

for old, new in replacements:
    content = re.sub(old, new, content)

# Restore html prop assignments for EditableText
content = re.sub(r'html=\{stripHtml\((.*?)\)\}', r'html={\1}', content)

with open("src/components/WebshopComponent.tsx", "w") as f:
    f.write(content)

print("Done fixing HTML tags in WebshopComponent.tsx")
