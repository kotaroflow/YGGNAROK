import re

with open('src/components/criar-conteudo-client.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove Grid Wrapper
text = re.sub(
    r"\{\/\* ── 12-Column Responsive Grid Layout ── \*\/.*?<div className=\"lg:col-span-8 flex flex-col gap-6\">",
    r"{/* ── Main Layout (Vertical Flow for Full Width) ── */}\n        <div className=\"flex flex-col gap-6 lg:gap-8\">",
    text,
    count=1,
    flags=re.DOTALL
)

# 2. Remove Right Column wrapper
text = re.sub(
    r"\{\/\* 2\. Right Column - AI Control & Carousel \*\/.*?<div className=\"lg:col-span-4 lg:row-span-2 flex flex-col gap-6\">\s*\{\/\* ── Controle de IA & Sintonia ── \*\/\}",
    r"{/* ── Controle de IA & Sintonia ── */}",
    text,
    count=1,
    flags=re.DOTALL
)

# 3. Remove Nav Arrows
text = re.sub(
    r"<div className=\"flex items-center gap-1\.5\">\s*<button[^>]+>\s*<ChevronRight size=\{14\} className=\"rotate-180\" \/>\s*<\/button>\s*<button[^>]+>\s*<ChevronRight size=\{14\} \/>\s*<\/button>\s*<\/div>",
    r"",
    text,
    count=1
)

# 4. Replace Sliding Track with Grid
track_pattern = r"\{\/\* Sliding Track \*\/.*?<div \n\s*className=\"flex transition-transform duration-500 ease-out h-full\"[^\>]+>"
grid_replacement = r"""{/* Grid Layout (Replaced Carousel) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mt-2">"""
text = re.sub(track_pattern, grid_replacement, text, count=1, flags=re.DOTALL)

# 5. Fix Slide 0
text = text.replace(
    """{/* Slide 0: Agents or Trends */}
                  <div className="w-[33.333%] shrink-0 px-1 flex flex-col justify-between h-full">""",
    """{/* Panel 1: Agents or Trends */}
                  <div className="flex flex-col justify-between h-full space-y-4 rounded-xl border border-line bg-surface-strong/20 p-5">"""
)

# 6. Fix Slide 1
text = text.replace(
    """{/* Slide 1: Odin Supervisor */}
                  <div className="w-[33.333%] shrink-0 px-1 flex flex-col justify-between h-full">""",
    """{/* Panel 2: Odin Supervisor */}
                  <div className="flex flex-col justify-between h-full space-y-4 rounded-xl border border-line bg-surface-strong/20 p-5">"""
)

# 7. Fix Slide 2
text = text.replace(
    """{/* Slide 2: LTM & Perfection */}
                  <div className="w-[33.333%] shrink-0 px-1 flex flex-col justify-between h-full">""",
    """{/* Panel 3: LTM & Perfection */}
                  <div className="flex flex-col justify-between h-full space-y-4 rounded-xl border border-line bg-surface-strong/20 p-5">"""
)

# 8. Close Grid instead of Sliding Track inner div
text = text.replace(
    """                    </div>
                  </div>
                </div>
              </div>

              {/* Indicator Dots */""",
    """                    </div>
                  </div>
                </div>

              {/* Indicator Dots */"""
)

# 9. Remove Indicator Dots completely
dots_pattern = r"\{\/\* Indicator Dots \*\/.*?<\/div>\s*<\/div>\s*<\/div>"
text = re.sub(dots_pattern, r"</div>\n          </div>", text, count=1, flags=re.DOTALL)

# 10. Remove Left Column Bottom wrapper and extra closing div
text = re.sub(
    r"<\/div>\s*\{\/\* 3\. Left Column \(Bottom\) - Acervo / Video Studio \*\/.*?<div className=\"lg:col-span-8 flex flex-col gap-6\">",
    r"",
    text,
    count=1,
    flags=re.DOTALL
)

with open('src/components/criar-conteudo-client.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Grid layout fixed successfully!")
