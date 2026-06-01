import sys

with open('src/components/criar-conteudo-client.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Target 1: Delete the Cream BG block
target1_start = text.find("{/* ── Creation Card (hero, cream bg) ── */}")
if target1_start != -1:
    target1_end = text.find("{activeTab !== \"videos\" ? (", target1_start)
    if target1_end != -1:
        text = text[:target1_start] + text[target1_end:]

# Target 2: Wrap the layout in grid
header_end = text.find("          </div>\n        </div>\n\n            {activeTab !== \"videos\" ? (")
if header_end != -1:
    # We found the end of the header
    replacement2 = """          </div>
        </div>

        {/* ── 12-Column Responsive Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* 1. Left Column (Top) - Creation Engine */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {activeTab !== "videos" ? ("""
    text = text.replace("""          </div>\n        </div>\n\n            {activeTab !== "videos" ? (""", replacement2)

# Target 3: Wrap Controle de IA
target3 = "{/* ── Controle de IA & Sintonia (below creation panel, full width) ── */}"
replacement3 = """          </div>

          {/* 2. Right Column - AI Control & Carousel */}
          <div className="lg:col-span-4 lg:row-span-2 flex flex-col gap-6">
            {/* ── Controle de IA & Sintonia ── */}"""
text = text.replace(target3, replacement3)

# Target 4: Bottom row layout
target4 = "{/* ── Bottom row layout: Operational Acervo or Video Studio (placed below) ── */}"
replacement4 = """          </div>

          {/* 3. Left Column (Bottom) - Acervo / Video Studio */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* ── Bottom row layout: Operational Acervo or Video Studio (placed below) ── */}"""
text = text.replace(target4, replacement4)

# Target 5: Add closing divs at the very end
target5 = """      </div>
    </div>
  );
}"""
replacement5 = """          </div>
        </div>
      </div>
    </div>
  );
}"""
text = text.replace(target5, replacement5)

with open('src/components/criar-conteudo-client.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Layout updated safely!")
