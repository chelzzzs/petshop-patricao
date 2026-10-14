# Constitution — petshop-landing

Versão: 2.0.0 · Ratificada: 2026-10-14 · Emendada: 2026-10-14 (P4 reescrito: motion design permitido; P7 adicionado)

## Princípios

1. **Simplicidade (YAGNI)** — site estático de uma página. Sem backend, sem banco, sem CMS até haver necessidade real.
2. **Conteúdo separado do layout** — todo texto, contato, horário e preço vive em `src/data/site.ts`. Trocar informação nunca exige mexer em componente.
3. **Mobile-first** — a maioria do público chega pelo celular (Instagram/WhatsApp). Layout desenhado primeiro para 375px.
4. **Motion com performance** — motion design, shaders e transições são parte da identidade, mas: só `transform`/`opacity`/WebGL, nada que cause layout shift; shader pausa fora da tela; JS em scripts Astro (sem framework de UI). Meta: Lighthouse Performance ≥ 85, demais ≥ 90.
5. **Acessibilidade** — HTML semântico, contraste AA, `alt` em toda imagem, navegável por teclado. `prefers-reduced-motion` desliga animações e congela o shader.
6. **Placeholders explícitos** — dados inventados ficam marcados (`// PLACEHOLDER`) para serem trocados antes de publicar. Depoimentos fictícios nunca vão ao ar como se fossem reais.
7. **Clean e direto** — pouco texto por tela. Cada seção tem no máximo um título curto e uma linha de apoio; detalhe só sob interação (flip, popover).

## Restrições

- Stack: Astro + Tailwind CSS. Sem frameworks de UI adicionais.
- Sem tracking/cookies de terceiros sem decisão explícita do dono.

## Governança

Alterar um princípio exige bump de versão (MAJOR para remoção/reescrita, MINOR para adição) e nota em `project/STATE.md`.
