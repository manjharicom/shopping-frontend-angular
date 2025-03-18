import { RecipeProductModel } from "./recipe-product.model";

export interface RecipeModel {
    recipeId: number;
    name: string;
    cookingInstructions: string;
    products?: RecipeProductModel[]
}
