import { Component, OnInit, TemplateRef, EventEmitter, Input, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';  
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { AreaModel } from 'src/app/shared/models/area.model';
import { CategoryModel } from 'src/app/shared/models/category.model';
import { NewProductModel } from 'src/app/shared/models/new-product.model';
import { AreasApiService } from '../../services/areas-api.service'
import { CategoriesApiService } from '../../services/categories-api.service'
import { ProductsapiService } from '../../services/productsapi.service';
import { UomsapiService } from '../../services/uomsapi.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditProductModel } from 'src/app/shared/models/edit-product.model';
import { UomModel } from 'src/app/shared/models/uom.model';
import { NewProductResponseModel } from '../../models/new-product-response.model';

@Component({
  selector: 'app-add-edit-product-modal',
  templateUrl: './add-edit-product-modal.component.html',
  styleUrls: ['./add-edit-product-modal.component.scss']
})
export class AddEditProductModalComponent implements OnInit {

@Input('product') product?: number;
@Input('mode') mode?: string;
@Output() added = new EventEmitter<NewProductResponseModel>();

constructor(
    private productsApiService: ProductsapiService,
    private areasApiService: AreasApiService,
    private categoriesApiService: CategoriesApiService,
    private uomapiService: UomsapiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    ) {}

  modalRef!: BsModalRef; 
  productForm!: FormGroup;
  categories: CategoryModel[] = [];
  areas: AreaModel[] = [];
  uoms: UomModel[] = [];
  routeParamsSub!: Subscription;
  productId?:number;
  
  ngOnInit(): void {
    this.productForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      area: new FormControl('', [Validators.required]),
      uom: new FormControl('', [Validators.required]),
      priceUom: new FormControl('', [Validators.required]),
    });
  }

  get productName(){
    return this.productForm.get('productName');
  }

  get category(){
    return this.productForm.get('category');
  }

  get area(){
    return this.productForm.get('area');
  }

  get uom(){
    return this.productForm.get('uom');
  }

  get priceUom(){
    return this.productForm.get('priceUom');
  }

  openModalWithClass(template: TemplateRef<any>) {  
    this.loadProduct();
    this.modalRef = this.modalService.show(  
      template,  
      Object.assign({}, { class: 'gray modal-lg' })
    );  
  }  

  submit(){
      if(this.mode == "new"){
        const newProduct:NewProductModel = {
          name: this.productName?.value,
          categoryId: Number(this.category?.value),
          areaId: Number(this.area?.value),
          uomId: Number(this.uom?.value),
          priceUomId: Number(this.priceUom?.value)
        };
        this.productsApiService.addProduct(newProduct).subscribe(d => {
          this.added.emit(d);
          this.modalRef.hide();
          });
      }else{
        const editProduct:EditProductModel = {
          productId: this.productId,
          name: this.productName?.value,
          categoryId: Number(this.category?.value),
          areaId: Number(this.area?.value),
          uomId: Number(this.uom?.value),
          priceUomId: Number(this.priceUom?.value)
        };
        this.productsApiService.updateProduct(editProduct).subscribe(d => {
          this.added.emit(d);
          this.modalRef.hide();
          });
    }
  }

  private loadCategories(){
    var categories = sessionStorage.getItem('categories');
    if (categories){
      this.categories = JSON.parse(categories);
    } else {
        this.categoriesApiService.getCategories(false).subscribe(cats => {
          sessionStorage.setItem('categories', JSON.stringify(cats));
          this.categories = cats;
      });
    }
  }

  private loadAreas(){
    var areas = sessionStorage.getItem('areas');
    if (areas){
      this.areas = JSON.parse(areas);
    } else {
        this.areasApiService.getAreas(false).subscribe(ars => {
          sessionStorage.setItem('areas', JSON.stringify(ars));
          this.areas = ars;
      });
    }
  }

  private loadUoms(){
    var ums = sessionStorage.getItem('uoms');
    if (ums){
      this.uoms = JSON.parse(ums);
    } else {
      this.uomapiService.getUoms().subscribe(u => {
        sessionStorage.setItem('uoms', JSON.stringify(u));
        this.uoms = u;
      });
    }
  }
  
  private loadProduct(){
    if (this.product == undefined){
        this.loadCategories();
        this.loadAreas();
        this.loadUoms();
    } else {
      this.productId = this.product;
      this.productsApiService.getProduct(this.productId).subscribe(p => {
        var categories = sessionStorage.getItem('categories');
        var areas = sessionStorage.getItem('areas');
        var ums = sessionStorage.getItem('uoms');
        if (categories && areas && ums){
          this.categories = JSON.parse(categories);
          this.areas = JSON.parse(areas);
          this.uoms = JSON.parse(ums);
          this.productForm.patchValue({
            productName: p.name,
            category: Number(p.categoryId),
            area: Number(p.areaId),
            uom: p.uomId,
            priceUom: p.priceUomId
          });
        }else{
          forkJoin([
            this.categoriesApiService.getCategories(false)
          , this.areasApiService.getAreas(false)
          , this.uomapiService.getUoms()]).subscribe(d => {
          this.categories = d[0];
          this.areas = d[1];
          this.uoms = d[2];
          sessionStorage.setItem('categories', JSON.stringify(this.categories));
          sessionStorage.setItem('areas', JSON.stringify(this.areas));
          sessionStorage.setItem('uoms', JSON.stringify(this.uoms));
          this.productForm.patchValue({
            productName: p.name,
            category: Number(p.categoryId),
            area: Number(p.areaId),
            uom: p.uomId,
            priceUom: p.priceUomId
          });
          });
        }
      });
  }
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
