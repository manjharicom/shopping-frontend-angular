import { Component, EventEmitter, OnInit, TemplateRef, Input, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';  
import { ShoppinglistApiService } from '../../services/shoppinglist-api.service';
import { ProductsapiService } from '../../services/productsapi.service';
import { ShoppingListModel } from 'src/app/shared/models/shopping-list.model';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';

@Component({
  selector: 'app-modal-popup',
  templateUrl: './ngx-bootstrap-modal.component.html',
  styleUrls: ['./ngx-bootstrap-modal.component.scss']
})
export class NgxBootstrapModalComponent implements OnInit  {
  constructor(
    private apiService: ShoppinglistApiService,
    private productsApiService: ProductsapiService,
    private modalService: BsModalService) { }  

  @Input('product') product: any;
  @Output() added = new EventEmitter<any>();

  modalRef!: BsModalRef; 
  isOpen = false;
  productId!: number;
  shoppingLists : ShoppingListModel[] = [];
  name?: string;
  productForm!: FormGroup;
  errorMessages: string | undefined
  shoppingListId: number = 0;

  ngOnInit() {
    this.productForm = new FormGroup({
      shoppingList: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      purchased: new FormControl('')
    });
    this.productForm.patchValue({quantity: "1"})
    this.loadShoppingList();
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
    var savedShoppingList = sessionStorage.getItem('shoppinglist');
    var shoppingListId = sessionStorage.getItem('shoppingListId');
    if (savedShoppingList){
      this.shoppingLists = JSON.parse(savedShoppingList);
    } else {
      this.apiService.getShoppingLists().subscribe(s => {
        sessionStorage.setItem('shoppinglist', JSON.stringify(s));
        this.shoppingLists = s;
      })
    }
    const found = this.shoppingLists.find(id => id.shoppingListId.toString() == shoppingListId);
    if(found)
      this.productForm.patchValue({shoppingList: found.shoppingListId});
  }

  onChange(shoppingListId:number){
    this.shoppingListId = shoppingListId;
    sessionStorage.setItem("shoppingListId", shoppingListId.toString());
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
