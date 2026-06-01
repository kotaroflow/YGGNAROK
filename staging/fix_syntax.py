import re

with open('src/components/criar-conteudo-client.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix backslashes
text = text.replace(
    """<div className=\\"flex flex-col gap-6 lg:gap-8\\">""",
    """<div className="flex flex-col gap-6 lg:gap-8">"""
)

# Since step 10 removed a closing div, we might need to add it back if we have unbalanced divs.
# Wait, let's just make sure we have exactly one `</main>` and that the `</div>`s are balanced.
# Actually, I'll just add `</div>` before `</main>` until it balances, or check the git diff.
# The error says "Expected corresponding JSX closing tag for 'main'." which means a `</div>` is missing or extra!
# If it says "Expected corresponding JSX closing tag for 'main'", it means `<main>` was closed by `</div>` or something?
# No, it says "Expected corresponding JSX closing tag for 'main'" at line 1748, which is where `</main>` is. Wait!
# Let me look at line 1748.
# 1748:         </div>
# 1749:       </main>
# 1750:     );
# If it says that, it means there are too many open `<div>` tags inside `<main>`.

# Wait! Did step 10 remove TWO `</div>`s but only one opening `<div ...>`?
# Let's check step 10 regex:
# r"<\/div>\s*\{\/\* 3\. Left Column \(Bottom\) - Acervo \/ Video Studio \*\/.*?<div className=\"lg:col-span-8 flex flex-col gap-6\">"
# Yes! It removed `</div>` AND `<div ...>`! So the number of open divs DECREASED by 0 (one removed, one added... wait, no. It removed a closing tag AND an opening tag. So the net balance is the same).
# BUT, wait! Step 2:
# r"\{\/\* 2\. Right Column - AI Control & Carousel \*\/.*?<div className=\"lg:col-span-4 lg:row-span-2 flex flex-col gap-6\">\s*\{\/\* ── Controle de IA & Sintonia ── \*\/\}",
# It removed `<div className="lg:col-span-4 ...">` (1 opening tag removed).
# Did it remove the corresponding closing tag?
# NO! It didn't remove the closing tag for the Right Column!
# That's why there is an EXTRA `</div>` somewhere?
# No, if an opening tag is removed, there's an extra closing tag! So `<main>` would get closed early by that extra `</div>`, and then the actual `</main>` tag throws an error because `<main>` is already closed!
# YES! That's it!

# Let's remove one extra `</div>` right above `</main>`.
text = text.replace(
    """          </div>

        </div>
      </main>
    );""",
    """          </div>
      </main>
    );"""
)

with open('src/components/criar-conteudo-client.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Syntax fixed!")
