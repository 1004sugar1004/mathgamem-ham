import { IngredientConfig, IngredientType, Order } from './types';

export const INGREDIENTS_CONFIG: Record<IngredientType, IngredientConfig> = {
  egg: { name: '달걀부침', total: 3 },
  patty: { name: '고기 패티', total: 4 },
  cheese: { name: '치즈', total: 6 },
  cabbage: { name: '양배추', total: 8 },
};

export const INGREDIENT_ORDER: IngredientType[] = ['egg', 'patty', 'cheese', 'cabbage'];

const getDivisors = (n: number): number[] => {
    const divisors: number[] = [];
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) {
            divisors.push(i);
        }
    }
    return divisors;
};


export const generateOrder = (): Order => {
  const order: Partial<Order> = {};
  INGREDIENT_ORDER.forEach(type => {
    const config = INGREDIENTS_CONFIG[type];
    const divisors = getDivisors(config.total);
    const randomIndex = Math.floor(Math.random() * divisors.length);
    order[type] = divisors[randomIndex];
  });
  return order as Order;
};
