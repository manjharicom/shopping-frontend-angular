import { Component, EventEmitter, OnInit, TemplateRef, Input, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';  
import { ShoppinglistApiService } from '../../services/shoppinglist-api.service';
import { ProductsapiService } from '../../services/productsapi.service';
import { ShoppingListModel } from 'src/app/shared/models/shopping-list.model';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';

@Component({
  selector: 'app-product-search-modal',
  templateUrl: './product-search-modal.component.html',
  styleUrls: ['./product-search-modal.component.scss']
})
export class ProductSearchModalComponent implements OnInit {
  constructor(
    private apiService: ShoppinglistApiService,
    private productsApiService: ProductsapiService,
    private modalService: BsModalService) { }  

  @Input('product') product: any;
  @Output() added = new EventEmitter<any>();

  modalRef!: BsModalRef; 
  productForm!: FormGroup;
  shoppingLists : ShoppingListModel[] = [];
  errorMessages: string | undefined

  ngOnInit() {
    this.loadShoppingList();
    this.productForm = new FormGroup({
      shoppingList: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required])
    });
    this.productForm.patchValue({quantity: "1"})
  }

  openModalWithClass(template: TemplateRef<any>) {  
    this.modalRef = this.modalService.show(  
      template,  
      Object.assign({}, { class: 'gray modal-lg' })
    );  
  }  

  get shoppingList(){
    return this.productForm.get('shoppingList');
  }

  get quantity(){
    return this.productForm.get('quantity');
  }

  get purchased(){
    return this.productForm.get('purchased');
  }
  
  private loadShoppingList(){
    var shoppingList = sessionStorage.getItem('shoppinglist');
    if (shoppingList){
      this.shoppingLists = JSON.parse(shoppingList);
    } else {
      this.apiService.getShoppingLists().subscribe(s => {
        sessionStorage.setItem('shoppinglist', JSON.stringify(s));
        this.shoppingLists = s;
      })
    }
  }
  
  submit(){
    if (this.productForm.invalid){
      this.errorMessages = "Please enter a value for each field in the form";
    }
    else{
      this.productsApiService.addProductToList(this.shoppingList?.value, this.product.productId, this.quantity?.value, this.purchased?.value ?? false ).subscribe(p => {
        var shoppingListName = this.shoppingLists.filter(f => f.shoppingListId === Number(this.shoppingList?.value))[0].name;
        var postObj = {
          product:this.product.name,
          name: shoppingListName
        }
        this.added.emit(postObj);
        this.modalRef.hide();
      });
      }
  }

  }
