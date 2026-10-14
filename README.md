# PatriCão · Landing page

Landing page do **PatriCão**, pet shop de bairro que nesta fase vende **produtos** para cães e gatos (rações, petiscos, brinquedos e acessórios). Página única, rápida no celular e com foco em levar o visitante para o WhatsApp.

## Destaques

- **Mascote interativo** em SVG: olhos e cabeça seguem o cursor, clique na cabeça faz carinho e segurar o focinho deixa ele feliz.
- **Fundo do hero em WebGL** (shader com gradiente orgânico nas cores da marca, reage ao mouse).
- **Motion design**: entradas com spring, cards que viram (flip), galeria em marquee, frase revelada no scroll e parallax em camadas.
- **Popovers nativos** (Popover API) para horários e menu mobile.
- **Leve**: shader em resolução reduzida a 30 fps e pausado fora da tela, fontes self-hosted, fotos com `srcset`, logo otimizada no build.
- **Acessível**: HTML semântico, foco visível, flip por teclado e `prefers-reduced-motion` desliga as animações.

## Stack

| | |
|---|---|
| Framework | [Astro 7](https://astro.build) (site estático) |
| Estilo | [Tailwind CSS v4](https://tailwindcss.com) |
| Animações | [Motion](https://motion.dev) (vanilla) |
| Ícones | [Lucide](https://lucide.dev) (`lucide-static`, renderizado no build) |
| Fontes | Fredoka + Nunito via [Fontsource](https://fontsource.org) |
| Fotos | [Unsplash](https://unsplash.com) |

## Começando

Requisitos: Node.js ≥ 22.12.

```bash
npm install
cp .env.example .env   # opcional: preencha com os dados reais
npm run dev            # http://localhost:4321/petshop-patricao/
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento em `localhost:4321/petshop-patricao/` |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve o build localmente para conferir antes do deploy |

## Dados de contato (`.env`)

WhatsApp, telefone, Instagram e endereço **não ficam no repositório**: são lidos de variáveis de ambiente no momento do build (`astro:env`). Ausentes ou vazias, a página usa placeholders fictícios (definidos em `src/data/site.ts`).

| Variável | Exemplo | Observação |
|---|---|---|
| `PETSHOP_WHATSAPP` | `5511987654321` | DDI + DDD; caracteres não numéricos são removidos |
| `PETSHOP_PHONE` | `+55 11 98765-4321` | Como aparece na página |
| `PETSHOP_INSTAGRAM` | `patricao.petshop` | Com ou sem `@` |
| `PETSHOP_ADDRESS_LINE` | `Rua Exemplo, 100` | |
| `PETSHOP_ADDRESS_DISTRICT` | `Bairro · Cidade` | |

- **Local:** copie `.env.example` para `.env` e preencha. O `.env` está no `.gitignore`.
- **Produção (GitHub Pages):** cadastre as mesmas variáveis em *Settings → Secrets and variables → Actions → Variables*. O workflow de deploy repassa elas para o build.
- Nunca commite os dados reais: mesmo apagados depois, eles continuam no histórico do git.

> Os dados aparecem na página publicada (é o objetivo dela). O `.env` só evita que fiquem expostos no código-fonte.

## Deploy

Publicado no **GitHub Pages** em <https://chelzzzs.github.io/petshop-patricao/>.

- Todo push na `main` dispara [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): `npm ci` → `npm run build` → publica `dist/`.
- Também dá para rodar manualmente em *Actions → Deploy no GitHub Pages → Run workflow* (ex.: depois de alterar as Variables).
- Em *Settings → Pages*, a fonte deve ser **GitHub Actions**.
- O site fica no subcaminho `/petshop-patricao` (`base` em `astro.config.mjs`). Ao usar domínio próprio, troque `site` e remova `base`.

## Editando o conteúdo

Textos, produtos, horários e fotos ficam em [`src/data/site.ts`](src/data/site.ts). Trocar um texto ali atualiza todos os lugares onde ele aparece, inclusive as mensagens pré-preenchidas do WhatsApp.

## Estrutura

```text
src/
├── assets/logo.webp        # logo (otimizada no build: header, footer, favicon, og:image)
├── components/
│   ├── Header.astro        # menu fixo + menu mobile (popover)
│   ├── Hero.astro          # shader + mascote + CTA
│   ├── Mascot.astro        # desenho do mascote em SVG por camadas
│   ├── Products.astro      # cards com flip
│   ├── Gallery.astro       # faixa de fotos em marquee
│   ├── About.astro         # frase revelada no scroll
│   ├── Visit.astro         # endereço + popover de horários
│   ├── Footer.astro        # CTA final + rodapé
│   └── Icon.astro          # ícones Lucide inline
├── data/site.ts            # todo o conteúdo da página
├── layouts/Base.astro      # <head>, SEO, fontes
├── pages/index.astro       # monta as seções
├── scripts/
│   ├── motion.ts           # reveals, flip, parallax, header
│   ├── mascot.ts           # interações do mascote
│   └── shader.ts           # fundo WebGL do hero
└── styles/global.css       # tema (cores, fontes) e animações CSS
```

Ajustes rápidos:
- **Velocidade do parallax:** atributo `style="--speed:0.25"` (ou `--speed-x`) no próprio elemento. `0` = rola junto, positivo = fica para trás.
- **Cores e fontes:** bloco `@theme` em `src/styles/global.css`.

## Documentação do projeto

Especificação, decisões e histórico ficam em [`.specs/`](.specs/) (spec-driven development):
- [`CONSTITUTION.md`](.specs/CONSTITUTION.md): princípios do projeto
- [`features/001-landing-page/spec.md`](.specs/features/001-landing-page/spec.md): requisitos da página
- [`project/STATE.md`](.specs/project/STATE.md): decisões e lições
- [`project/ROADMAP.md`](.specs/project/ROADMAP.md): próximos passos

## Antes de publicar

- [ ] Preencher as Variables de contato no GitHub e rodar o deploy de novo
- [ ] Baixar as fotos do Unsplash para o projeto (hoje são carregadas direto do Unsplash)
- [ ] Revisar horários em `src/data/site.ts`
- [ ] Configurar domínio

## Créditos

Fotos: [Unsplash](https://unsplash.com). Ícones: [Lucide](https://lucide.dev) (ISC).
