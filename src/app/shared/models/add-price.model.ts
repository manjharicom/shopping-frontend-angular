import { AddPriceItemModel } from "./add-price-item.model";

export interface AddPriceModel {
    shoppingListId: number;
    shoppingDate: Date;
    prices: AddPriceItemModel[];
}
