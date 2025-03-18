import { RecipeProductModel } from "./recipe-product.model";

export interface IngredientModel {
    id: number;
    name: string;
    products: RecipeProductModel[];
}
