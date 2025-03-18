export interface ProductModel {
    productId: number;
    name: string;
    aisleLabel: string;
    sequence: number;
    quantity: number;
    isShipped: boolean;
    shoppingListId?: number;
    uomId?: number;
    uom: string;
    priceUomId?: number;
    priceUom: string;
    displayName?:string;
    allowDecimalQuantity:boolean;
}