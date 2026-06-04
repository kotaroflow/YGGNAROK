"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/lib/utils";

type NodeData = {
  id: string;
  name: string;
  x: number;
  y: number;
  receita: number;
  variacao: number;
  ia: string;
  ativo: boolean;
  color: string;
};

type EdgeData = {
  from: string;
  to: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
};

const INITIAL_NODES: NodeData[] = [
  { id: "yt", name: "Youtube", x: 0.22, y: 0.38, receita: 840, variacao: 18, ia: "KOTARO", ativo: true, color: "#ff8c00" },
  { id: "tt", name: "TikTok", x: 0.58, y: 0.28, receita: 1220, variacao: 34, ia: "HERMES", ativo: true, color: "#a855f7" },
  { id: "prodA", name: "Produto A", x: 0.42, y: 0.62, receita: 2100, variacao: 12, ia: "HEFESTO", ativo: true, color: "#22c55e" },
  { id: "afiliado", name: "Afiliado Rede", x: 0.72, y: 0.68, receita: 520, variacao: 8, ia: "MA'AT", ativo: true, color: "#f59e0b" },
  { id: "campanha", name: "Anime Shorts", x: 0.34, y: 0.16, receita: 921, variacao: 614, ia: "KOTARO", ativo: true, color: "#ec4899" },
  { id: "blog", name: "Blog Isekai", x: 0.10, y: 0.72, receita: 310, variacao: 5, ia: "HERMES", ativo: false, color: "#6b7280" },
  { id: "newsletter", name: "Newsletter", x: 0.88, y: 0.42, receita: 670, variacao: 22, ia: "MA'AT", ativo: true, color: "#3b82f6" },
  { id: "produtoB", name: "Produto B", x: 0.55, y: 0.82, receita: 450, variacao: -3, ia: "HEFESTO", ativo: true, color: "#84cc16" },
];

const INITIAL_EDGES: EdgeData[] = [
  { from: "yt", to: "prodA" },
  { from: "tt", to: "prodA" },
  { from: "campanha", to: "yt" },
  { from: "campanha", to: "tt" },
  { from: "prodA", to: "afiliado" },
  { from: "blog", to: "prodA" },
  { from: "newsletter", to: "prodA" },
  { from: "produtoB", to: "afiliado" },
  { from: "produtoB", to: "newsletter" },
];

const AGENTS = [
  { icon: "🧠", name: "HERMES", status: "Caçando oportunidades", detail: "12 programas · 3 aprovados", cor: "#a855f7" },
  { icon: "🎬", name: "KOTARO", status: "Produzindo criativos", detail: "5 vídeos · 2 imagens", cor: "#ff8c00" },
  { icon: "⚖️", name: "MA'AT", status: "Analisando risco", detail: "ROI estável · score 92%", cor: "#22c55e" },
  { icon: "🔨", name: "HEFESTO", status: "Criando produtos", detail: "1 novo · Isekai Pack 89%", cor: "#f59e0b" },
];

const OPPORTUNITIES = [
  { title: "Nicho Anime Retrô", growth: "+37%", confidence: "89%", action: "CAPITALIZAR" },
  { title: "Solo Leveling", growth: "+614%", confidence: "94%", action: "CRIAR CAMPANHA" },
  { title: "TikTok Shorts vs Youtube", growth: "70/30", confidence: "82%", action: "APLICAR" },
  { title: "Produto B em crescimento", growth: "+22%", confidence: "76%", action: "IMPULSIONAR" },
];

const ARSENAL_ITEMS = [
  { type: "link", label: "Links", icon: "🔗" },
  { type: "cupom", label: "Cupons", icon: "🎟️" },
  { type: "criativo", label: "Criativos", icon: "🎨" },
  { type: "video", label: "Vídeos", icon: "📹" },
  { type: "script", label: "Scripts", icon: "📜" },
  { type: "pagina", label: "Landing Pages", icon: "📄" },
];

export function UraIchibaClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fluxoAtivo, setFluxoAtivo] = useState(17.32);
  const [showArsenal, setShowArsenal] = useState(false);
  const [showCouncil, setShowCouncil] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Local state for nodes and edges to support dynamic drag and drop & click toggle
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<EdgeData[]>(INITIAL_EDGES);
  const [agentProgress, setAgentProgress] = useState(() => AGENTS.map(() => 60 + Math.random() * 35));

  const { toast, showToast } = useToast(3500);

  // Synchronize state with animation loop refs
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Dynamic simulation of agents background work
  useEffect(() => {
    const timer = setInterval(() => {
      setAgentProgress(prev => prev.map((val, idx) => {
        const nextVal = val + 0.5 + Math.random() * 2.0;
        if (nextVal >= 100) {
          const agent = AGENTS[idx];
          showToast(`🤖 ${agent.name} concluiu um lote de tarefas.`);
          return 25 + Math.random() * 25; // Loop back
        }
        return nextVal;
      }));
    }, 4500);
    return () => clearInterval(timer);
  }, [showToast]);

  // Color caching logic to avoid 60fps getComputedStyle reflows
  const colorsRef = useRef({ bg: "#FAF8F2", brand: "#7c3aed" });
  const updateCachedColors = useCallback(() => {
    if (typeof window === "undefined") return;
    const rootStyles = getComputedStyle(document.documentElement);
    colorsRef.current = {
      bg: rootStyles.getPropertyValue("--background").trim() || "#FAF8F2",
      brand: rootStyles.getPropertyValue("--brand").trim() || "#7c3aed"
    };
  }, []);

  useEffect(() => {
    updateCachedColors();
    window.addEventListener("ygn-theme-change", updateCachedColors);
    return () => window.removeEventListener("ygn-theme-change", updateCachedColors);
  }, [updateCachedColors]);

  const initParticles = useCallback((w: number, h: number) => {
    const active = nodesRef.current.filter((n) => n.ativo);
    if (active.length < 2) return;
    const p: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      const src = active[Math.floor(Math.random() * active.length)];
      const dst = active[Math.floor(Math.random() * active.length)];
      p.push({
        x: src.x * w + (Math.random() - 0.5) * 30,
        y: src.y * h + (Math.random() - 0.5) * 30,
        vx: ((dst.x - src.x) * w * 0.004 + (Math.random() - 0.5) * 0.3),
        vy: ((dst.y - src.y) * h * 0.004 + (Math.random() - 0.5) * 0.3),
        life: 0.5 + Math.random() * 0.5,
        hue: Math.random() > 0.5 ? 35 : 270,
      });
    }
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement!;
      const w = parent.clientWidth;
      const h = Math.min(w * 0.55, 520);
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      if (particlesRef.current.length === 0) initParticles(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      // Draw background
      ctx.fillStyle = colorsRef.current.bg;
      ctx.fillRect(0, 0, w, h);

      const brandColor = colorsRef.current.brand;
      const isDark = document.documentElement.classList.contains("dark");

      // Draw Edges
      edgesRef.current.forEach((edge) => {
        const from = nodesRef.current.find((n) => n.id === edge.from);
        const to = nodesRef.current.find((n) => n.id === edge.to);
        if (!from || !to) return;
        const x1 = from.x * w, y1 = from.y * h;
        const x2 = to.x * w, y2 = to.y * h;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const cpx = (x1 + x2) / 2 + (Math.random() - 0.5) * 4;
        const cpy = (y1 + y2) / 2 + (Math.random() - 0.5) * 10 - 15;
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.strokeStyle = from.ativo && to.ativo ? `${brandColor}22` : `${brandColor}0c`;
        ctx.lineWidth = from.ativo && to.ativo ? 1.5 : 0.5;
        ctx.stroke();
      });

      // Draw Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;
        if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          const active = nodesRef.current.filter((n) => n.ativo);
          if (active.length > 1) {
            const src = active[Math.floor(Math.random() * active.length)];
            const dst = active[Math.floor(Math.random() * active.length)];
            p.x = src.x * w + (Math.random() - 0.5) * 20;
            p.y = src.y * h + (Math.random() - 0.5) * 20;
            // FIXED MATH: particles now correctly scale velocity based on real canvas size
            p.vx = (dst.x - src.x) * w * 0.004 + (Math.random() - 0.5) * 0.3;
            p.vy = (dst.y - src.y) * h * 0.004 + (Math.random() - 0.5) * 0.3;
            p.life = 0.6 + Math.random() * 0.4;
            p.hue = Math.random() > 0.5 ? 35 : 270;
          } else {
            p.life = 0;
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 + p.life * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.life * 0.6})`;
        ctx.fill();

        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsla(${p.hue}, 80%, 50%, ${p.life * 0.3})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      nodesRef.current.forEach((node) => {
        const cx = node.x * w, cy = node.y * h;
        const r = node.ativo ? 16 : 10;

        ctx.beginPath();
        ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = node.ativo ? `${node.color}15` : "transparent";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = node.ativo ? node.color : "#3a3a3a";
        ctx.fill();

        if (node.ativo) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = node.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = node.ativo ? (isDark ? "#fff" : "#222") : "#666";
        ctx.font = "600 12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.name, cx, cy - r - 8);

        ctx.fillStyle = node.ativo ? (isDark ? "#f5e6d3" : "#444") : "#555";
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillText(`R$ ${node.receita} ${node.variacao >= 0 ? "+" : ""}${node.variacao}%`, cx, cy + r + 18);

        if (node.ativo) {
          ctx.fillStyle = `${node.color}aa`;
          ctx.font = "8px system-ui, sans-serif";
          ctx.fillText(node.ia, cx, cy + r + 30);
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  useEffect(() => {
    const t = setInterval(() => {
      setFluxoAtivo((v) => +(v + (Math.random() - 0.5) * 0.6).toFixed(2));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = canvas.width / devicePixelRatio;
    const h = canvas.height / devicePixelRatio;
    const mx = (e.clientX - rect.left) * (w / rect.width);
    const my = (e.clientY - rect.top) * (h / rect.height);
    setMousePos({ x: e.clientX, y: e.clientY });

    let found: NodeData | null = null;
    for (const node of nodes) {
      const dx = mx - node.x * w;
      const dy = my - node.y * h;
      if (Math.sqrt(dx * dx + dy * dy) < 24) {
        found = node;
        break;
      }
    }
    setHoveredNode(found);
  }, [nodes]);

  // Click on a node to toggle active/inactive status
  const handleCanvasClick = useCallback(() => {
    if (hoveredNode) {
      setNodes(prev => prev.map(n => {
        if (n.id === hoveredNode.id) {
          const nextActive = !n.ativo;
          showToast(`Mercado: ${n.name} está agora ${nextActive ? "ATIVO" : "INATIVO"}.`);
          return { ...n, ativo: nextActive };
        }
        return n;
      }));
    }
  }, [hoveredNode, showToast]);

  // Dynamic drag & drop handler for Arsenal Drawer items
  const handleDrop = useCallback((e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const label = e.dataTransfer.getData("text/plain");
    const canvas = canvasRef.current;
    if (!canvas || !label) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const id = `node-${Date.now()}`;
    const colors = ["#ff8c00", "#a855f7", "#22c55e", "#f59e0b", "#ec4899", "#3b82f6", "#84cc16"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNode: NodeData = {
      id,
      name: label,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      receita: Math.floor(100 + Math.random() * 900),
      variacao: Math.floor(-10 + Math.random() * 50),
      ia: "KOTARO",
      ativo: true,
      color: randomColor
    };

    setNodes(prev => {
      // Connect to closest node
      let closestNode = "prodA";
      let minDistance = Infinity;
      prev.forEach(n => {
        const dx = n.x - x;
        const dy = n.y - y;
        const d = dx * dx + dy * dy;
        if (d < minDistance) {
          minDistance = d;
          closestNode = n.id;
        }
      });

      setEdges(prevEdges => [...prevEdges, { from: id, to: closestNode }]);
      return [...prev, newNode];
    });

    showToast(`Aplicado ao mapa: ${label} nas coordenadas (${Math.round(x * 100)}%, ${Math.round(y * 100)}%)`);
  }, [showToast]);

  const councilText = [
    { model: "GPT-5", text: "TikTok está com CPM baixo, invista R$ 200.", color: "#22c55e" },
    { model: "Claude", text: "Discordo. Youtube retém cliente por mais tempo.", color: "#f59e0b" },
    { model: "Gemini", text: "Teste A/B com 30% do orçamento. Decisão: TikTok 70% / Youtube 30%.", color: "#a855f7" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-alert-pop">
          <div className="rounded-xl border border-brand/20 bg-surface-overlay backdrop-blur-xl px-4 py-2.5 text-xs font-semibold text-brand shadow-lg">
            {toast}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-line bg-surface/80 px-6 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <h1 className="font-divine text-lg font-black uppercase tracking-[0.25em] text-brand">
            裏市場
          </h1>
          <span className="hidden text-xs font-light text-muted sm:inline">Ura Ichiba · Mercado Vivo</span>
          <span className="rounded-full border border-brand/30 bg-brand/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden flex-col items-center sm:flex">
            <span className="text-[10px] uppercase tracking-wider text-muted">Fluxo ativo</span>
            <span className="font-mono text-sm font-bold text-brand">R$ {fluxoAtivo.toFixed(2)}</span>
          </div>
          <div className="hidden flex-col items-center md:flex">
            <span className="text-[10px] uppercase tracking-wider text-muted">Fontes</span>
            <span className="font-mono text-sm font-bold text-foreground">{nodes.filter((n) => n.ativo).length}</span>
          </div>
          <div className="hidden flex-col items-center md:flex">
            <span className="text-[10px] uppercase tracking-wider text-muted">Agentes</span>
            <span className="font-mono text-sm font-bold text-foreground">{AGENTS.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast("✨ IA preparando campanha otimizada para seu ecossistema...")}
              className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white dark:text-neutral-950 shadow-lg shadow-brand/20 transition hover:scale-105 hover:shadow-xl hover:shadow-brand/30 active:scale-95 animate-pulse"
            >
              + NOVA CAMPANHA
            </button>
            <button
              onClick={() => showToast("🔗 Link de afiliado gerado: yggnarok.io/af/seu-codigo")}
              className="rounded-full border border-brand/40 px-4 py-1.5 text-xs font-bold text-brand transition hover:bg-brand/10 active:scale-95"
            >
              🔗 GERAR LINK
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex flex-1 gap-0 lg:grid lg:grid-cols-[260px_1fr_280px]">
        {/* Left: Opportunities */}
        <aside className="order-2 border-l border-line/50 bg-surface/30 p-4 lg:order-1 lg:border-r">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Oportunidades</h2>
          </div>
          <div className="space-y-2">
            {OPPORTUNITIES.map((opp, i) => (
              <div
                key={i}
                className="group rounded-xl border border-line/60 bg-surface/50 p-3 transition hover:border-brand/30 hover:bg-brand/[0.02]"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{opp.title}</span>
                  <span className="text-[10px] font-bold text-brand">{opp.growth}</span>
                </div>
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-[10px] text-muted">Confiança</span>
                  <span className="text-[10px] font-mono font-bold text-brand">{opp.confidence}</span>
                </div>
                <button
                  onClick={() => showToast(`⚡ Iniciando capitalização de: ${opp.title}`)}
                  className="w-full rounded-lg border border-brand/25 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand opacity-0 transition group-hover:opacity-100 hover:bg-brand/10"
                >
                  {opp.action}
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: Economic Map */}
        <div className="order-1 flex flex-col lg:order-2">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Mapa Econômico</h2>
            <div className="flex items-center gap-3 text-[10px] text-muted">
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" /> Ativo
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-line-strong" /> Inativo
              </span>
            </div>
          </div>
          <div className="relative mx-2 mb-2 overflow-hidden rounded-2xl border border-line/60">
            <canvas
              ref={canvasRef}
              className="block w-full cursor-pointer"
              onMouseMove={handleCanvasMove}
              onClick={handleCanvasClick}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onMouseLeave={() => setHoveredNode(null)}
            />
            {hoveredNode && (
              <div
                className="pointer-events-none fixed z-50 rounded-xl border border-line/80 bg-surface/95 p-3 shadow-2xl shadow-brand/5 backdrop-blur-xl"
                style={{ left: mousePos.x + 16, top: mousePos.y - 80 }}
              >
                <p className="mb-1 text-sm font-bold text-foreground">{hoveredNode.name}</p>
                <div className="space-y-0.5 text-[11px] text-muted">
                  <p>Receita: <span className="font-mono text-brand">R$ {hoveredNode.receita}</span></p>
                  <p>Variação: <span className={`font-mono ${hoveredNode.variacao >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {hoveredNode.variacao >= 0 ? "+" : ""}{hoveredNode.variacao}%
                  </span></p>
                  <p>IA: <span className="font-mono text-foreground">{hoveredNode.ia}</span></p>
                  <p>ROI: <span className="font-mono text-brand">{hoveredNode.variacao * 4}%</span></p>
                </div>
              </div>
            )}
          </div>

          {/* Quick metrics below map */}
          <div className="mx-2 mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Receita Total", value: "R$ 7.012", change: "+18%" },
              { label: "ROI Médio", value: "312%", change: "+8%" },
              { label: "Canais Ativos", value: `${nodes.filter(n => n.ativo).length}`, change: "+2" },
              { label: "CAC", value: "R$ 12,40", change: "-5%" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-line/40 bg-surface/40 px-3 py-2">
                <p className="text-[10px] text-muted">{m.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-sm font-bold text-foreground">{m.value}</span>
                  <span className="font-mono text-[10px] text-brand">{m.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Agents */}
        <aside className="order-3 border-l border-line/50 bg-surface/30 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm">🧠</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted">Agentes</h2>
          </div>
          <div className="space-y-2">
            {AGENTS.map((agent, i) => (
              <div
                key={i}
                className="group rounded-xl border border-line/50 bg-surface/40 p-3 transition hover:border-brand/20"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">{agent.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-foreground" style={{ color: agent.cor }}>{agent.name}</p>
                    <p className="text-[10px] text-muted">{agent.status}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted/80">{agent.detail}</p>
                <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${agentProgress[i]}%`, backgroundColor: agent.cor }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-1.5">
            <button
              onClick={() => setShowCouncil(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line/60 bg-surface/30 px-3 py-2 text-xs font-bold text-brand transition hover:border-brand/30 hover:bg-brand/[0.03]"
            >
              ⚖️ CONSELHO ECONÔMICO
            </button>
            <button
              onClick={() => setShowArsenal((v) => !v)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line/60 bg-surface/30 px-3 py-2 text-xs font-bold text-foreground transition hover:border-brand/30 hover:bg-brand/[0.03]"
            >
              📦 ARSENAL
            </button>
          </div>
        </aside>
      </div>

      {/* Arsenal Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t border-line/60 bg-surface/95 backdrop-blur-2xl transition-transform duration-300 ${
          showArsenal ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted">⚙️ Arsenal · arraste para o mapa</h3>
            <button onClick={() => setShowArsenal(false)} className="text-xs text-muted hover:text-foreground">Fechar</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {ARSENAL_ITEMS.map((item) => (
              <div
                key={item.type}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", item.label)}
                className="flex cursor-grab items-center gap-2 rounded-full border border-line/60 bg-surface/50 px-4 py-2 text-xs font-medium text-foreground transition hover:border-brand/30 hover:bg-brand/[0.03] active:cursor-grabbing"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Council Modal */}
      {showCouncil && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowCouncil(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-line/60 bg-surface p-6 shadow-2xl shadow-brand/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-divine text-lg font-bold text-brand">⚖️ Conselho Econômico</h2>
              <button onClick={() => setShowCouncil(false)} className="text-lg text-muted hover:text-foreground">✕</button>
            </div>
            <div className="mb-4 space-y-3">
              {councilText.map((item) => (
                <div key={item.model} className="rounded-xl border border-line/40 bg-background/50 p-3">
                  <p className="mb-1 text-xs font-bold" style={{ color: item.color }}>{item.model}</p>
                  <p className="text-sm text-foreground/80">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mb-4 rounded-xl border border-brand/20 bg-brand/[0.03] p-3">
              <p className="text-center text-xs font-bold uppercase tracking-wider text-brand">Decisão do Conselho</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 rounded-full bg-line h-3 overflow-hidden">
                  <div className="h-full rounded-full bg-brand" style={{ width: "70%" }} />
                </div>
                <span className="font-mono text-xs font-bold text-brand">70%</span>
              </div>
              <p className="mt-1 text-center text-[10px] text-muted">TikTok 70% · Youtube 30%</p>
            </div>
            <button
              onClick={() => { showToast("✅ Decisão aplicada. Campanha redistribuída. ROI projetado +18%"); setShowCouncil(false); }}
              className="w-full rounded-full bg-brand py-2.5 text-sm font-bold text-white dark:text-neutral-950 shadow-lg shadow-brand/20 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              APLICAR DECISÃO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
