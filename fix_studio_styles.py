import re

with open('src/components/agent-node-studio.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Canvas section background
target1 = """      <section className="relative overflow-hidden rounded-lg border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60 flex flex-col">"""
replacement1 = """      <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-[#0a0a0a] shadow-[0_0_80px_rgba(245,158,11,0.05)] flex flex-col">"""
text = text.replace(target1, replacement1)

# 2. Canvas upper toolbar
target2 = """        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-white/10">"""
replacement2 = """        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-brand/10 px-5 py-4 bg-surface/40">"""
text = text.replace(target2, replacement2)

# 3. Canvas upper toolbar buttons
target3_btn1 = """className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-stone-200\""""
replacement3_btn1 = """className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-foreground shadow-sm hover:bg-surface-strong hover:text-brand transition\""""
text = text.replace(target3_btn1, replacement3_btn1)

# 4. Canvas inner area
target4 = """        <div className="relative h-[580px] min-w-[940px] overflow-auto bg-[linear-gradient(rgba(245,158,11,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.015)_1px,transparent_1px)] bg-[size:28px_28px] dark:bg-neutral-950 grid-bg-overlay flex-grow">"""
replacement4 = """        <div className="relative h-[580px] min-w-[940px] overflow-auto bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:24px_24px] bg-[#0a0a0a] flex-grow">"""
text = text.replace(target4, replacement4)

# 5. Nodes style
target5_base = """"absolute h-[100px] w-[168px] rounded-xl border p-3 text-left shadow-lg transition duration-300 backdrop-blur-sm bg-neutral-950/45 node-animation-pop hover:scale-[1.03] hover:border-brand/40","""
replacement5_base = """"absolute h-[100px] w-[168px] rounded-xl border p-3 text-left shadow-lg transition-all duration-300 backdrop-blur-md bg-neutral-900/90 node-animation-pop hover:scale-[1.05] hover:border-brand/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]","""
text = text.replace(target5_base, replacement5_base)

target5_selected = """selected.id === node.id ? "ring-2 ring-brand/60 border-brand/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "","""
replacement5_selected = """selected.id === node.id ? "scale-[1.05] ring-2 ring-brand border-brand shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-neutral-900/100 z-10" : "","""
text = text.replace(target5_selected, replacement5_selected)

# 6. Sidebar
target6 = """        <div className="rounded-lg border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60 space-y-4">"""
replacement6 = """        <div className="rounded-2xl border border-line bg-surface/50 p-5 shadow-xl backdrop-blur-md space-y-4">"""
text = text.replace(target6, replacement6)

with open('src/components/agent-node-studio.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Styles updated successfully!")
