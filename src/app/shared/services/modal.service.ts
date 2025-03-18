import { Injectable } from '@angular/core';
import { ProductModalComponent } from '../components/product-modal/product-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: ProductModalComponent[] = [];
  constructor() { }

    add(modal: ProductModalComponent) {
        // ensure component has a unique id attribute
        if (!modal.id) {
            throw new Error('id not found. modal must have a unique id attribute');
        }
        if (this.modals.find(x => x.id === modal.id)) {
            return;
        }

        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(modal: ProductModalComponent) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x === modal);
    }

    open(id: string, productId: number, name?: string) {
        // open modal specified by id
        const modal = this.modals.find(x => x.id === id);
        //console.log(modal);

        if (!modal) {
            throw new Error(`modal '${id}' not found`);
        }

        modal.open(productId, name);
    }

    close() {
        // close the modal that is currently open
        const modal = this.modals.find(x => x.isOpen);
        modal?.close();
    }
}
