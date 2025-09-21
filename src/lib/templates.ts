import { GachaTemplate, createGachaItems } from './gacha';

export const gachaTemplates: GachaTemplate[] = [
  {
    id: "default",
    name: "기본 뽑기",
    theme: "classic",
    items: createGachaItems(1, 3, 16, 80, 200)
  },
  {
    id: "premium", 
    name: "프리미엄 뽑기",
    theme: "golden",
    items: createGachaItems(2, 5, 20, 73, 200).map(item => ({
      ...item,
      name: item.name.replace("아이템", "프리미엄")
    }))
  },
  {
    id: "fantasy",
    name: "판타지 뽑기", 
    theme: "magical",
    items: createGachaItems(1, 4, 15, 80, 200).map(item => ({
      ...item,
      name: item.name.replace("아이템", "마법 아이템")
    }))
  },
  {
    id: "cyber",
    name: "사이버 뽑기",
    theme: "neon", 
    items: createGachaItems(1, 2, 17, 80, 200).map(item => ({
      ...item,
      name: item.name.replace("아이템", "사이버 칩")
    }))
  },
  {
    id: "retro",
    name: "레트로 뽑기",
    theme: "vintage",
    items: createGachaItems(1, 3, 16, 70, 210).map(item => ({
      ...item, 
      name: item.name.replace("아이템", "빈티지")
    }))
  },
  {
    id: "space",
    name: "우주 뽑기",
    theme: "cosmic",
    items: createGachaItems(1, 4, 18, 77, 200).map(item => ({
      ...item,
      name: item.name.replace("아이템", "우주석")
    }))
  }
];

export function getTemplate(id: string): GachaTemplate | undefined {
  return gachaTemplates.find(template => template.id === id);
}