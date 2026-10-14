# 001 — Landing page do PatriCão

Tamanho: **Medium** · Status: aprovada (2026-10-14) — esboço inicial, iterativo

## Identidade
- **Nome:** PatriCão
- **Logo:** filhote preto com "joinha" amarelo → `public/logo.webp`
- **Slogan (placeholder):** "Tudo de patrão pro seu cão."
- **Escopo do negócio:** nesta fase **só produtos** (rações, petiscos, brinquedos, acessórios). Sem serviços (banho, tosa, táxi dog).
- **Paleta (derivada da logo):** preto `#141210`, amarelo joinha `#FFC531`, creme `#FFF7E8`, branco
- **Tipografia:** Fredoka (títulos), Nunito (corpo)
- **Fotos:** Unsplash (hotlink `images.unsplash.com` no esboço; baixar para `public/` antes de publicar)

## Diretrizes de design
- Clean, pouco texto: 1 título + 1 linha por seção; detalhe aparece só com interação.
- Motion design: reveals no scroll, entradas com spring, parallax leve, marquee de fotos.
- Shader WebGL no hero (gradiente orgânico amarelo/creme reagindo ao mouse).
- Card flip nos produtos (frente: foto + nome; verso: 1 frase + CTA).
- Popovers (Popover API nativa) para horários/endereço e balão do WhatsApp.

## User stories
- **US-1** Entender em segundos que produtos o PatriCão vende.
- **US-2** Pedir/tirar dúvida no WhatsApp com um toque.
- **US-3** Ver endereço e horário.
- **US-4** Dono troca conteúdo em um arquivo só.

## Requisitos funcionais
| ID | Requisito |
|---|---|
| FR-001 | **Header** fixo minimalista: logo + nome, 3 âncoras, botão WhatsApp; fundo ganha blur ao rolar. Menu mobile. |
| FR-002 | **Hero**: shader de fundo, mascote interativo, título curto, 1 linha, CTA WhatsApp + "Produtos". |
| FR-003 | **Produtos**: 4 flip cards — Rações, Petiscos, Brinquedos, Acessórios. |
| FR-004 | **Galeria**: faixa de fotos em marquee infinito (pausa no hover). |
| FR-005 | **Sobre**: frase grande revelada palavra a palavra no scroll + foto. |
| FR-006 | **Visite**: card com endereço; botão abre popover de horários; link Google Maps. |
| FR-007 | **CTA final** + **footer** (redes, © ano automático). |
| FR-008 | **Parallax scrolling**: camadas com velocidades diferentes (hero, cards, galeria, sobre, CTA). |
| FR-009 | Links WhatsApp com mensagem pré-preenchida (`wa.me`). |
| FR-010 | Todo conteúdo em `src/data/site.ts`, tipado. |
| FR-011 | Preview local configurado (`.claude/launch.json` + `npm run dev`). |
| FR-012 | **Mascote interativo** (SVG + motion): olhos e cabeça seguem o cursor, piscam; clique na cabeça = carinho (orelhas + corações); segurar o focinho = cara feliz + corações. |

## Requisitos não-funcionais
| ID | Requisito |
|---|---|
| NFR-001 | Responsivo 360px → 1440px, sem scroll horizontal. |
| NFR-002 | Animações só com `transform`/`opacity`; shader pausa fora da viewport. |
| NFR-003 | SEO: title, description, Open Graph, `lang="pt-BR"`, favicon. |
| NFR-004 | A11y: contraste AA, `alt`, foco visível, flip acessível por teclado, `prefers-reduced-motion`. |
| NFR-005 | `npm run build` sem erros. |

## Plan (inline)
- Astro + Tailwind v4 (`@tailwindcss/vite`) + `motion` (vanilla: `animate`, `inView`, `scroll`).
- `src/data/site.ts` · `src/layouts/Base.astro` · `src/components/*` · `src/scripts/{motion,shader}.ts` · `src/pages/index.astro`.

## Fora de escopo
Serviços (banho, tosa, táxi dog), agendamento online, e-commerce, CMS, blog, formulário com backend, analytics, deploy, depoimentos (sem dados reais).
