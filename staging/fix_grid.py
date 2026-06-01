import re

with open('src/components/criar-conteudo-client.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Wrap the layout in grid
pattern = r"(<div className=\"mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between\">.*?</div>\s*</div>\s*)(?=\{activeTab !== \"videos\" \? \()"

replacement = r"""\1
        {/* ── 12-Column Responsive Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* 1. Left Column (Top) - Creation Engine */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            """

text = re.sub(pattern, replacement, text, count=1, flags=re.DOTALL)

with open('src/components/criar-conteudo-client.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Grid wrapper applied successfully!")
