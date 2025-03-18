import { ProductModel } from "./product.model";

export interface AreaModel {
    areaId: number;
    name: string;
    products: ProductModel[];
    hasProducts: boolean;
    isShipped: boolean;
}
