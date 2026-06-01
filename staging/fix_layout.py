import re

with open('src/components/criar-conteudo-client.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the old Creation Card
pattern1 = r"\{\/\* ── Creation Card \(hero, cream bg\) ── \*\/}.*?(?=\{\/\* ── Controle de IA & Sintonia|\{activeTab !== \"videos\" \? \()"
content = re.sub(pattern1, r"", content, flags=re.DOTALL)

# Wrap everything in a grid
pattern2 = r"(<div className=\"mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between\">.*?</div>\s*</div>)"
replacement2 = r"\1\n\n        {/* ── 12-Column Responsive Grid Layout ── */}\n        <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start\">\n\n          {/* 1. Left Column (Top) - Creation Engine */}\n          <div className=\"lg:col-span-8 flex flex-col gap-6\">\n"
content = re.sub(pattern2, replacement2, content, count=1, flags=re.DOTALL)

# Wrap Controle de IA
pattern3 = r"(\{\/\* ── Controle de IA & Sintonia \(below creation panel, full width\) ── \*\/})"
replacement3 = r"          </div>\n\n          {/* 2. Right Column - AI Control & Carousel */}\n          <div className=\"lg:col-span-4 lg:row-span-2 flex flex-col gap-6\">\n            \1"
content = re.sub(pattern3, replacement3, content, count=1)

# Close Right Column and Wrap Bottom row layout
pattern4 = r"(\{\/\* ── Bottom row layout: Operational Acervo or Video Studio \(placed below\) ── \*\/})"
replacement4 = r"          </div>\n\n          {/* 3. Left Column (Bottom) - Acervo / Video Studio */}\n          <div className=\"lg:col-span-8\">\n            \1"
content = re.sub(pattern4, replacement4, content, count=1)

# Finally, close the grid div at the very end
pattern5 = r"(      </div>\n    </div>\n  \);\n})"
replacement5 = r"          </div>\n        </div>\n\n\1"
content = re.sub(pattern5, replacement5, content, count=1)

with open('src/components/criar-conteudo-client.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Layout updated!")
