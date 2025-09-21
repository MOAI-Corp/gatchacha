export interface GachaItem {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  probability: number;
  drawn: boolean;
}

export interface GachaTemplate {
  id: string;
  name: string;
  theme: string;
  items: GachaItem[];
}

export const tierNames = {
  1: "전설",
  2: "영웅", 
  3: "희귀",
  4: "고급",
  5: "일반"
} as const;

export const tierColors = {
  1: "legendary",
  2: "epic",
  3: "rare", 
  4: "uncommon",
  5: "common"
} as const;

export function createGachaItems(tier1: number, tier2: number, tier3: number, tier4: number, tier5: number): GachaItem[] {
  const items: GachaItem[] = [];
  
  // 1등 (전설)
  for (let i = 0; i < tier1; i++) {
    items.push({
      id: `legendary-${i + 1}`,
      name: `전설 아이템 #${i + 1}`,
      tier: 1,
      probability: 0.5,
      drawn: false
    });
  }
  
  // 2등 (영웅)
  for (let i = 0; i < tier2; i++) {
    items.push({
      id: `epic-${i + 1}`,
      name: `영웅 아이템 #${i + 1}`,
      tier: 2,
      probability: 2.5,
      drawn: false
    });
  }
  
  // 3등 (희귀)
  for (let i = 0; i < tier3; i++) {
    items.push({
      id: `rare-${i + 1}`,
      name: `희귀 아이템 #${i + 1}`,
      tier: 3,
      probability: 10,
      drawn: false
    });
  }
  
  // 4등 (고급)
  for (let i = 0; i < tier4; i++) {
    items.push({
      id: `uncommon-${i + 1}`,
      name: `고급 아이템 #${i + 1}`,
      tier: 4,
      probability: 25,
      drawn: false
    });
  }
  
  // 5등 (일반)
  for (let i = 0; i < tier5; i++) {
    items.push({
      id: `common-${i + 1}`,
      name: `일반 아이템 #${i + 1}`,
      tier: 5,
      probability: 62,
      drawn: false
    });
  }
  
  return items;
}

export function drawGacha(items: GachaItem[]): GachaItem | null {
  const availableItems = items.filter(item => !item.drawn);
  if (availableItems.length === 0) return null;
  
  const totalWeight = availableItems.reduce((sum, item) => sum + (100 - item.probability + 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const item of availableItems) {
    random -= (100 - item.probability + 1);
    if (random <= 0) {
      return item;
    }
  }
  
  return availableItems[0];
}

export function resetGacha(items: GachaItem[]): void {
  items.forEach(item => item.drawn = false);
}