export interface FullProductModel {
    productId: number;
    name: string;
    displayName: string;
    categoryId: number;
    category: string;
    areaId: number;
    area: string;
    shoppingListId?: number;
    isShipped: boolean;
    uomId?: number;
    uom: string;
    priceUomId?: number;
    priceUom: string;
}
