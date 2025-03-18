import { Component, EventEmitter, ViewEncapsulation, ElementRef, OnInit, OnDestroy, Input, Output} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { ShoppinglistApiService } from '../../services/shoppinglist-api.service';
import { ProductsapiService } from '../../services/productsapi.service';
import { ShoppingListModel } from 'src/app/shared/models/shopping-list.model';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductModalComponent implements OnInit, OnDestroy {
  @Input() id?: string;
  @Output() added = new EventEmitter<boolean>();
  isOpen = false;
  private element: any;
  productId!: number;
  shoppingLists : ShoppingListModel[] = [];
  name?: string;
  productForm!: FormGroup;

  constructor(
    private apiService: ShoppinglistApiService,
    private productsApiService: ProductsapiService,
    private toastr: ToastrService,
    private modalService: ModalService, 
    private el: ElementRef
    ) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    this.modalService.add(this);
    this.loadShoppingList();
    this.productForm = new FormGroup({
      shoppingList: new FormControl('', [Validators.required])
    });

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // close modal on background click
    this.element.addEventListener('click', (el: any) => {
        if (el.target.className === 'product-modal') {
            this.close();
        }
    });
  }

  get shoppingList(){
    return this.productForm.get('shoppingList');
  }

  ngOnDestroy(){
        // remove self from modal service
        this.modalService.remove(this);

        // remove modal element from html
        this.element.remove();
  }

  open(prodId: number, name?: string){
    this.productId = prodId;
    this.name = name;
    this.element.style.display = 'block';
    document.body.classList.add('product-modal-open');
    this.isOpen = true;
}

  close() {
    this.element.style.display = 'none';
    document.body.classList.remove('product-modal-open');
    this.isOpen = false;
  }

  private loadShoppingList(){
    this.apiService.getShoppingLists().subscribe(s => {
      this.shoppingLists = s;
    })
  }

  submit(){
    this.productsApiService.addProductToList(this.shoppingList?.value, this.productId, 1, false).subscribe(p => {
      this.added.emit(true);
    });
  }

  showToastrMessage(code: number, message: string){
    if (code < 0){
      this.toastr.error(message);
    }
    else{
      this.toastr.success(message);
    }
  }
}
