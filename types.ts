
export type IngredientType = 'egg' | 'patty' | 'cabbage' | 'cheese';

export interface IngredientConfig {
  name: string;
  total: number;
}

export type Order = Record<IngredientType, number>;

export type GameStage = 'welcome' | 'stage1' | 'stage2' | 'complete';

export interface PlayerFractionInput {
    numerator: string;
    denominator: string;
}

export type PlayerFractions = Record<IngredientType, PlayerFractionInput>;
