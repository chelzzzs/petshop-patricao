// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Dados de contato vêm de variáveis de ambiente (.env local, ou Variables do repositório no GitHub Actions),
// para que os dados reais não fiquem no repositório. Ausentes ou vazias → placeholders em src/data/site.ts.
const contact = () => envField.string({ context: 'server', access: 'public', optional: true });

// https://astro.build/config
export default defineConfig({
  // GitHub Pages serve o site em https://chelzzzs.github.io/petshop-patricao/
  site: 'https://chelzzzs.github.io',
  base: '/petshop-patricao',
  env: {
    schema: {
      PETSHOP_WHATSAPP: contact(),
      PETSHOP_PHONE: contact(),
      PETSHOP_INSTAGRAM: contact(),
      PETSHOP_ADDRESS_LINE: contact(),
      PETSHOP_ADDRESS_DISTRICT: contact(),
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
