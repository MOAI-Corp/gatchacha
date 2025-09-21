import { GachaTemplate, createGachaItems } from './gacha';

export const gachaTemplates: GachaTemplate[] = [
  {
    id: "default",
    name: "기본 뽑기",
    theme: "classic",
    items: createGachaItems(1, 3, 12, 40, 100) // 총 156개
  },
  {
    id: "premium",
    name: "프리미엄 뽑기",
    theme: "golden",
    items: createGachaItems(2, 4, 15, 50, 120).map(item => ({ // 총 191개
      ...item,
      name: item.name.replace("아이템", "프리미엄")
    }))
  },
  {
    id: "fantasy",
    name: "판타지 뽑기",
    theme: "magical",
    items: createGachaItems(1, 3, 10, 35, 80).map(item => ({ // 총 129개
      ...item,
      name: item.name.replace("아이템", "마법 아이템")
    }))
  },
  {
    id: "cyber",
    name: "사이버 뽑기",
    theme: "neon",
    items: createGachaItems(1, 2, 8, 25, 60).map(item => ({ // 총 96개
      ...item,
      name: item.name.replace("아이템", "사이버 칩")
    }))
  },
  {
    id: "retro",
    name: "레트로 뽑기",
    theme: "vintage",
    items: createGachaItems(2, 5, 18, 60, 140).map(item => ({ // 총 225개
      ...item,
      name: item.name.replace("아이템", "빈티지")
    }))
  },
  {
    id: "space",
    name: "우주 뽑기",
    theme: "cosmic",
    items: createGachaItems(1, 4, 14, 45, 110).map(item => ({ // 총 174개
      ...item,
      name: item.name.replace("아이템", "우주석")
    }))
  }
];

export function getTemplate(id: string): GachaTemplate | undefined {
  return gachaTemplates.find(template => template.id === id);
}