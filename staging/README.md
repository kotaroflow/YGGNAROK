# Demo de Transições Suaves

Este diretório **staging** contém um pequeno protótipo HTML que demonstra transições suaves usando CSS puro e JavaScript mínimo.

## Estrutura

- `index.html` – página de demonstração com três exemplos (fade, slide‑up e scale). Cada exemplo possui um botão que alterna a animação.
- `transition.css` – classes reutilizáveis para efeitos de entrada/saída. Segue a convenção **.fade-enter**, **.fade-enter-active**, etc., facilitando a composição em projetos reais.
- `README.md` – este arquivo.

## Como usar

1. Abra `staging/index.html` em um navegador moderno.
2. Clique nos botões **Alternar Fade**, **Alternar Slide** ou **Alternar Scale** para observar as transições.
3. Copie as classes de `transition.css` para seu projeto (por exemplo, dentro de um arquivo Tailwind *@layer utilities* ou CSS módulo) e adapte‑as às suas necessidades.

## Integração no Next.js

Para reutilizar estas transições em componentes React/Next.js:
```tsx
import '@/staging/transition.css'; // ajuste o caminho conforme sua configuração

function MyComponent({show}: {show: boolean}) {
  return (
    <div className={show ? 'fade-enter-active' : 'fade-exit-active'}>
      {/* conteúdo */}
    </div>
  );
}
```

> **Nota**: Mantivemos o exemplo totalmente autônomo (HTML + CSS) para que você possa avaliar rapidamente o efeito antes de integrá‑lo ao código‑base. Quando migrar para o projeto Next.js, substitua o script de toggling por estado React e use `className` dinamicamente.

---

**Placeholder**: As caixas cinza (`.placeholder`) representam áreas onde você deve inserir seu conteúdo real ou imagens de marca. Substitua‑as pelos componentes ou assets do seu produto.
