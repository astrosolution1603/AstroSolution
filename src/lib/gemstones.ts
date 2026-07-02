export type GemCategory = "Navaratna";

export interface Gemstone {
  id: string;
  name: string;
  category: GemCategory;
  price: number;
  image: string;
  planetOrSign: string;
  description: string;
}

export const gemstones: Gemstone[] = [
  {
    id: "pukhraj",
    name: "Pukhraj",
    category: "Navaratna",
    price: 2551,
    image: "https://astrotalk.store/cdn/shop/files/Pukhraj_c5630e67-c1c7-4ee3-ac35-619d1ce03ca5_large.webp?v=1771406086",
    planetOrSign: "Astrology Gem",
    description: "Wealth Magnet"
  },
  {
    id: "ceylon-pukhraj",
    name: "Ceylon Pukhraj",
    category: "Navaratna",
    price: 5126,
    image: "https://astrotalk.store/cdn/shop/files/Ceylon-Pukhraj-_Yellow-Sapphire_90bbd7f2-2617-4786-b7ce-3b526d5cfbb3_large.webp?v=1771406483",
    planetOrSign: "Astrology Gem",
    description: "Attracts Wealth"
  },
  {
    id: "neelam",
    name: "Neelam",
    category: "Navaratna",
    price: 4594,
    image: "https://astrotalk.store/cdn/shop/files/Neelam_1_42301781-0585-43cd-ad15-c9c3b361cfdb_large.webp?v=1771406033",
    planetOrSign: "Astrology Gem",
    description: "Financial Growth"
  },
  {
    id: "ceylon-neelam",
    name: "Ceylon Neelam",
    category: "Navaratna",
    price: 5225,
    image: "https://astrotalk.store/cdn/shop/files/Untitled-1_70372574-5b41-40db-8d5d-6c14b7104692_large.webp?v=1778759482",
    planetOrSign: "Astrology Gem",
    description: "Financial Stability"
  },
  {
    id: "emerald",
    name: "Emerald",
    category: "Navaratna",
    price: 6250,
    image: "https://astrotalk.store/cdn/shop/files/Emerald_Panna_b4e669b9-ca65-49d9-b0dc-8e7a76f3961a_large.webp?v=1771405657",
    planetOrSign: "Astrology Gem",
    description: "Communication Booster"
  },
  {
    id: "zambian-emerald",
    name: "Zambian Emerald",
    category: "Navaratna",
    price: 3160,
    image: "https://astrotalk.store/cdn/shop/files/Zambian-Emerald-_Panna_a3668bb9-4e90-4e9b-81a8-ec7e75536abb_large.webp?v=1771406612",
    planetOrSign: "Astrology Gem",
    description: "Business Growth"
  },
  {
    id: "fire-opal",
    name: "Fire Opal",
    category: "Navaratna",
    price: 3705,
    image: "https://astrotalk.store/cdn/shop/files/Fire-Opal_large.webp?v=1771405695",
    planetOrSign: "Astrology Gem",
    description: "Money Booster"
  },
  {
    id: "australian-fire-opal",
    name: "Australian Fire Opal",
    category: "Navaratna",
    price: 3951,
    image: "https://astrotalk.store/cdn/shop/files/Fire-Opal_2_large.webp?v=1771406715",
    planetOrSign: "Astrology Gem",
    description: "Fixes Misunderstanding"
  },
  {
    id: "ruby",
    name: "Ruby",
    category: "Navaratna",
    price: 5179,
    image: "https://astrotalk.store/cdn/shop/files/Ruby_1_ac4befe3-695e-4cc1-b1bf-28b606f075d5_large.webp?v=1771406121",
    planetOrSign: "Astrology Gem",
    description: "Wealth Attraction"
  },
  {
    id: "african-ruby",
    name: "African Ruby",
    category: "Navaratna",
    price: 4903,
    image: "https://astrotalk.store/cdn/shop/files/African-Ruby_0acfe827-fea3-4b55-b3bc-a6ea09ad258c_large.webp?v=1771406374",
    planetOrSign: "Astrology Gem",
    description: "Attracts Fame"
  },
  {
    id: "burmese-ruby",
    name: "Burmese Ruby",
    category: "Navaratna",
    price: 4572,
    image: "https://astrotalk.store/cdn/shop/files/Burmese-Ruby_6ea02624-43fc-4684-93cd-96cab438ad18_large.webp?v=1771406418",
    planetOrSign: "Astrology Gem",
    description: "Improves Leadership"
  },
  {
    id: "pearl",
    name: "Pearl",
    category: "Navaratna",
    price: 2571,
    image: "https://astrotalk.store/cdn/shop/files/South-Sea-Pearl_1_large.webp?v=1771406188",
    planetOrSign: "Astrology Gem",
    description: "Calms Mind"
  },
  {
    id: "moonga",
    name: "Moonga",
    category: "Navaratna",
    price: 5498,
    image: "https://astrotalk.store/cdn/shop/files/Moonga_Red_Coral_large.webp?v=1779364203",
    planetOrSign: "Astrology Gem",
    description: "Increases Confidence"
  },
  {
    id: "hessonite",
    name: "Hessonite",
    category: "Navaratna",
    price: 2457,
    image: "https://astrotalk.store/cdn/shop/files/Hessonite_c68dbf38-b1e8-45ee-81eb-2736a1a1241b_large.webp?v=1771405850",
    planetOrSign: "Astrology Gem",
    description: "Confidence Builder"
  },
  {
    id: "tiger-eye",
    name: "Tiger Eye",
    category: "Navaratna",
    price: 3538,
    image: "https://astrotalk.store/cdn/shop/files/Tiger_dcaa0386-5d3d-4f13-afa7-2aa6a8856754_large.webp?v=1771406221",
    planetOrSign: "Astrology Gem",
    description: "Builds Confidence"
  },
  {
    id: "cat-s-eye",
    name: "Cat's Eye",
    category: "Navaratna",
    price: 5772,
    image: "https://astrotalk.store/cdn/shop/files/Cats-Eye_large.webp?v=1771405508",
    planetOrSign: "Astrology Gem",
    description: "Financial Security"
  },
  {
    id: "sulemani-hakik",
    name: "Sulemani Hakik",
    category: "Navaratna",
    price: 6640,
    image: "https://astrotalk.store/cdn/shop/files/Hakik_d2ee7395-7cbe-4367-b6b1-e8f67f54056b_large.webp?v=1771405815",
    planetOrSign: "Astrology Gem",
    description: "Removes Negativity"
  },
  {
    id: "citrine",
    name: "Citrine",
    category: "Navaratna",
    price: 6408,
    image: "https://astrotalk.store/cdn/shop/files/Citrine_73c2652d-990a-4ec2-8eab-04e1c542dcda_large.webp?v=1771405592",
    planetOrSign: "Astrology Gem",
    description: "Job Success"
  },
  {
    id: "iolite",
    name: "Iolite",
    category: "Navaratna",
    price: 4252,
    image: "https://astrotalk.store/cdn/shop/files/Iolite_25446181-5f34-4658-b175-df497d644f49_large.webp?v=1771405880",
    planetOrSign: "Astrology Gem",
    description: "Increases Concentration"
  },
  {
    id: "amethyst",
    name: "Amethyst",
    category: "Navaratna",
    price: 3427,
    image: "https://astrotalk.store/cdn/shop/files/Amethyst_6c9b57e7-0f1d-466f-b6f6-bf0cdabaf930_large.webp?v=1771405224",
    planetOrSign: "Astrology Gem",
    description: "Relieves Stress"
  },
  {
    id: "chalcedony",
    name: "Chalcedony",
    category: "Navaratna",
    price: 6670,
    image: "https://astrotalk.store/cdn/shop/files/Chalcedony_8aca7ebd-7025-4216-a761-137d30ce7f12_large.webp?v=1771405550",
    planetOrSign: "Astrology Gem",
    description: "Mental Clarity"
  },
  {
    id: "moonstone",
    name: "Moonstone",
    category: "Navaratna",
    price: 2257,
    image: "https://astrotalk.store/cdn/shop/files/Moon-Stone_large.webp?v=1771405957",
    planetOrSign: "Astrology Gem",
    description: "Mental Peace"
  },
  {
    id: "turquoise",
    name: "Turquoise",
    category: "Navaratna",
    price: 5704,
    image: "https://astrotalk.store/cdn/shop/files/Turquoise_1_b2b11089-4a88-4b22-98da-d3971331e512_large.webp?v=1771406253",
    planetOrSign: "Astrology Gem",
    description: "Spiritual Wellness"
  },
  {
    id: "agate",
    name: "Agate",
    category: "Navaratna",
    price: 4329,
    image: "https://astrotalk.store/cdn/shop/files/Agate_a21b64dd-afc8-4a22-93f4-e23f82ab6829_large.webp?v=1771405418",
    planetOrSign: "Astrology Gem",
    description: "Calms Overthinking"
  },
  {
    id: "garnet",
    name: "Garnet",
    category: "Navaratna",
    price: 6070,
    image: "https://astrotalk.store/cdn/shop/files/Garnet_f1ef544e-caf4-467e-8f14-728ccade721f_large.webp?v=1771405727",
    planetOrSign: "Astrology Gem",
    description: "Strengthens Love"
  },
  {
    id: "zirconia",
    name: "Zirconia",
    category: "Navaratna",
    price: 2231,
    image: "https://astrotalk.store/cdn/shop/files/Zirconia_96655371-3ba4-42ce-b7c6-01098423aec9_large.webp?v=1771406326",
    planetOrSign: "Astrology Gem",
    description: "Supports Finances"
  },
  {
    id: "natural-zircon",
    name: "Natural Zircon",
    category: "Navaratna",
    price: 4230,
    image: "https://astrotalk.store/cdn/shop/files/Natural-Zircon_dfd5cfbb-5c7c-4a26-945d-bc683d15f954_large.webp?v=1771405999",
    planetOrSign: "Astrology Gem",
    description: "Attracts Luxury"
  },
  {
    id: "white-topaz",
    name: "White Topaz",
    category: "Navaratna",
    price: 6192,
    image: "https://astrotalk.store/cdn/shop/files/White-Topaz_large.webp?v=1771406292",
    planetOrSign: "Astrology Gem",
    description: "Harmony In Life"
  },
  {
    id: "blue-topaz",
    name: "Blue Topaz",
    category: "Navaratna",
    price: 2574,
    image: "https://astrotalk.store/cdn/shop/files/Blue-Topaz_large.webp?v=1771405473",
    planetOrSign: "Astrology Gem",
    description: "Secure Financial Life"
  },
  {
    id: "white-pukhraj",
    name: "White Pukhraj",
    category: "Navaratna",
    price: 2718,
    image: "https://astrotalk.store/cdn/shop/files/White-pukhraj_c1708384-d40d-4c2b-9c36-57c0b0b90405_large.webp?v=1771406577",
    planetOrSign: "Astrology Gem",
    description: "Prosperity Magnet"
  },
  {
    id: "peetambari-neelam",
    name: "Peetambari Neelam",
    category: "Navaratna",
    price: 4933,
    image: "https://astrotalk.store/cdn/shop/files/Peetambari-Neelam_e7742944-1115-4186-ab35-46ba617c73b6_large.webp?v=1771406544",
    planetOrSign: "Astrology Gem",
    description: "Wealth Protector"
  },
  {
    id: "lapis-lazuli",
    name: "Lapis Lazuli",
    category: "Navaratna",
    price: 3463,
    image: "https://astrotalk.store/cdn/shop/files/Lapis_2d8dac37-326c-4df4-a1b8-43170daefeb2_large.webp?v=1771405922",
    planetOrSign: "Astrology Gem",
    description: "Focus Enhancer"
  },
  {
    id: "italian-red-coral",
    name: "Italian Red Coral",
    category: "Navaratna",
    price: 5869,
    image: "https://astrotalk.store/cdn/shop/files/Italian_Red_Coral_Moonga_large.webp?v=1779364241",
    planetOrSign: "Astrology Gem",
    description: "Boosts Confidence"
  },
];
