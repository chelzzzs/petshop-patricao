# STATE

Última atualização: 2026-10-14

## Fase atual
Feature 001-landing-page: esboço inicial implementado, aguardando ajustes do usuário.

## Decisões
- 2026-10-14: stack Astro 7 + Tailwind v4 + motion (vanilla) + lucide-static (ícones).
- 2026-10-14: nome PatriCão, logo do filhote com joinha (`public/logo.webp`).
- 2026-10-14: fotos via hotlink do Unsplash (baixar para `public/` antes de publicar).
- 2026-10-14: depoimentos fora (sem dados reais).
- 2026-10-14: FAB/balão do WhatsApp removidos a pedido; parallax scrolling via `[data-speed]`/`[data-speed-x]` + `--speed`/`--speed-x`.
- 2026-10-14: negócio inicia só com produtos → seção Serviços virou Produtos (Rações, Petiscos, Brinquedos, Acessórios); textos/CTAs de "agendar" viraram "pedir".
- 2026-10-14: mascote interativo em SVG (opção D) no lugar da logo no hero; Rive fica como upgrade futuro (o mesmo slot).
- 2026-10-14: testado parallax via CSS Scroll-driven Animations e revertido a pedido; mantido o parallax em JS (motion `scroll`).
- 2026-10-14: Constitution v2.0.0, motion design permitido (P4) e regra clean/direto (P7).

- 2026-10-14: otimização de performance — shader em resolução reduzida (0.5 desktop / 0.3 mobile) a 30 fps, 4 octaves, pausa fora da tela/aba; sem blur animado; logo via astro:assets; fontes self-hosted (@fontsource); srcset nas fotos; mascote e parallax limitados a 1 atualização por quadro.

## Lições
- O motion força `transform-box: fill-box` em SVG → use `transform-origin` em % do próprio elemento.
- O preflight do Tailwind zera `margin` → popover centralizado precisa de `m-auto`.
- O `::backdrop` não deve se aplicar a `popover="manual"` (o balão do WhatsApp borrava a página).

## Deferred
- Logo com fundo transparente (a atual tem fundo branco, e por isso fica dentro de um círculo).
- Deploy e domínio (M2).
