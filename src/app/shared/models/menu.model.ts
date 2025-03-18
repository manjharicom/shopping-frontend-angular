import { IngredientModel } from "./ingredient.model";
import { RecipeProductModel } from "./recipe-product.model";
import { RecipeModel } from "./recipe.model";

export interface MenuModel {
    menuId: number;
    name: string;
    cookingInstructions: string;
    products?: RecipeProductModel[];
    recipes?: RecipeModel[];
    ingredients: IngredientModel[];
}
