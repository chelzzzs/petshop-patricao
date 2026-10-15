// Textos e fotos da página. Contatos reais (WhatsApp, telefone, Instagram, endereço) vêm do .env —
// veja .env.example; ausentes ou vazias, valem os placeholders abaixo.
import {
  PETSHOP_ADDRESS_DISTRICT,
  PETSHOP_ADDRESS_LINE,
  PETSHOP_INSTAGRAM,
  PETSHOP_PHONE,
  PETSHOP_WHATSAPP,
} from 'astro:env/server';

export type Img = { src: string; srcset: string };

export type Product = {
  title: string;
  icon: string;
  text: string;
  price?: string;
  image: Img;
  alt: string;
};

export type Photo = { image: Img; alt: string };

// Fotos do Unsplash em várias larguras: o navegador baixa só a que serve pra tela (via srcset/sizes).
const unsplashUrl = (id: string, w: number, ratio: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * ratio)}&q=70`;
const unsplash = (id: string, ratio: number, widths: number[]): Img => ({
  src: unsplashUrl(id, widths[widths.length - 1], ratio),
  srcset: widths.map((w) => `${unsplashUrl(id, w, ratio)} ${w}w`).join(', '),
});

export const site = {
  name: 'PatriCão',
  tagline: 'Tudo de patrão pro seu pet.',
  subline: 'Ração, petiscos e brinquedos pra quem é da família.',
  description:
    'PatriCão Pet Shop: rações, petiscos, brinquedos e acessórios para cães e gatos. Peça pelo WhatsApp.',

  whatsapp: {
    number: (PETSHOP_WHATSAPP || '5511900000000').replace(/\D/g, ''), // placeholder
    message: 'Oi, PatriCão! Quero saber dos produtos 🐾',
  },
  phone: PETSHOP_PHONE || '+55 11 90000-0000', // placeholder
  instagram: (PETSHOP_INSTAGRAM || 'patricao.petshop').replace(/^@/, ''), // placeholder

  address: {
    line: PETSHOP_ADDRESS_LINE || 'Rua dos Latidos, 123', // placeholder
    district: PETSHOP_ADDRESS_DISTRICT || 'Vila Feliz · São Paulo', // placeholder
  },

  hours: [
    { days: 'Seg a Sex', time: '08h – 19h' },
    { days: 'Sábado', time: '08h – 16h' },
    { days: 'Domingo', time: 'Fechado' },
  ],

  products: [
    {
      title: 'Rações',
      icon: 'Package',
      text: 'Para cães e gatos, de filhote a sênior.',
      price: 'várias marcas',
      image: unsplash('photo-1714068691210-073dc52c6c1d', 9 / 7, [360, 560, 720]),
      alt: 'Cachorro comendo ração em uma tigela',
    },
    {
      title: 'Petiscos',
      icon: 'Bone',
      text: 'Ossinhos, bifinhos e mimos pra recompensar.',
      image: unsplash('photo-1568640347023-a616a30bc3bd', 9 / 7, [360, 560, 720]),
      alt: 'Petiscos em formato de osso sobre fundo rosa',
    },
    {
      title: 'Brinquedos',
      icon: 'Volleyball',
      text: 'Pelúcias, bolinhas e mordedores.',
      image: unsplash('photo-1591946614720-90a587da4a36', 9 / 7, [360, 560, 720]),
      alt: 'Golden retriever segurando um brinquedo de pelúcia',
    },
    {
      title: 'Acessórios',
      icon: 'Tag',
      text: 'Coleiras, guias, caminhas e comedouros.',
      image: unsplash('photo-1667716705760-233650f8f3fe', 9 / 7, [360, 560, 720]),
      alt: 'Cachorro usando uma coleira vermelha',
    },
  ] satisfies Product[],

  gallery: [
    { image: unsplash('photo-1583511655826-05700d52f4d9', 1.28, [260, 420, 560]), alt: 'Filhote de pijama em fundo amarelo' },
    { image: unsplash('photo-1514888286974-6c03e2ca1dba', 1.28, [260, 420, 560]), alt: 'Gato preto e branco deitado' },
    { image: unsplash('photo-1548199973-03cce0bbc87b', 1.28, [260, 420, 560]), alt: 'Dois cachorros correndo na estrada' },
    { image: unsplash('photo-1537151608828-ea2b11777ee8', 1.28, [260, 420, 560]), alt: 'Filhote marrom e branco' },
    { image: unsplash('photo-1573865526739-10659fec78a5', 1.28, [260, 420, 560]), alt: 'Gato laranja em cima da mesa' },
    { image: unsplash('photo-1561037404-61cd46aa615b', 1.28, [260, 420, 560]), alt: 'Cachorro preto e branco' },
    { image: unsplash('photo-1560807707-8cc77767d783', 1.28, [260, 420, 560]), alt: 'Filhote de pelo longo' },
    { image: unsplash('photo-1592194996308-7b43878e84a6', 1.28, [260, 420, 560]), alt: 'Gato de pelo longo' },
  ] satisfies Photo[],

  cta: {
    title: 'Bora mimar seu pet?',
    image: unsplash('photo-1646640237574-34c1c733f452', 2 / 3, [640, 1024, 1600]),
    alt: 'Cachorros brancos correndo e brincando em um parque',
    // Degradê das letras do título nas cores da foto do parque: folhas de outono, luz e grama
    fill: 'linear-gradient(105deg, #ffd27a 0%, #f2a65a 18%, #fff1d6 36%, #9fcf8f 52%, #d6e6a8 66%, #f2a65a 84%, #ffd27a 100%)',
  },

  about: {
    kicker: 'Sobre a gente',
    statement: 'Aqui todo pet é tratado como patrão: ração boa, petisco gostoso e brinquedo novo.',
    image: unsplash('photo-1632498301446-5f78baad40d0', 1.25, [420, 640, 860]),
    alt: 'Mulher dando um beijo na bochecha do seu cachorro',
  },
};

export const whatsappLink = (message = site.whatsapp.message) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const mapsLink = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.address.line}, ${site.address.district}`,
  )}`;
