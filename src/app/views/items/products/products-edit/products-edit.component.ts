import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { AreaModel } from 'src/app/shared/models/area.model';
import { CategoryModel } from 'src/app/shared/models/category.model';
import { NewProductModel } from 'src/app/shared/models/new-product.model';
import { ApiService } from '../../../../shared/services/api.service';
import { AreasApiService } from '../../../../shared/services/areas-api.service'
import { CategoriesApiService } from '../../../../shared/services/categories-api.service'
import { ProductsapiService } from '../../../../shared/services/productsapi.service';
import { UomsapiService } from '../../../../shared/services/uomsapi.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditProductModel } from 'src/app/shared/models/edit-product.model';
import { UomModel } from 'src/app/shared/models/uom.model';

@Component({
  selector: 'app-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.scss']
})
export class ProductsEditComponent implements OnInit {
  productForm!: FormGroup;
  categories: CategoryModel[] = [];
  areas: AreaModel[] = [];
  uoms: UomModel[] = [];
  routeParamsSub!: Subscription;
  mode!: string;
  productId?:number;

  constructor(
    private productsApiService: ProductsapiService,
    private areasApiService: AreasApiService,
    private categoriesApiService: CategoriesApiService,
    private uomapiService: UomsapiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.loadProduct();
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
          this.showToastrMessage(d.responseCode, d.responseMessage);
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
          this.showToastrMessage(d.responseCode, d.responseMessage);
        });
    }
  }

  private loadCategories(){
    this.categoriesApiService.getCategories(false).subscribe({
      next: categories => {
        this.categories = categories;
      }
    });
  }

  private loadAreas(){
    this.areasApiService.getAreas(false).subscribe({
      next: areas => {
        this.areas = areas;
      }
    });
  }

  private loadUoms(){
    this.uomapiService.getUoms().subscribe(u => {
      this.uoms = u;
    });
  }

  private loadProduct(){
    this.routeParamsSub = this.route.params.subscribe((r) => {
      var id = r['id'];
      if (id == undefined){
        this.mode='new';
        this.loadCategories();
        this.loadAreas();
        this.loadUoms();
      }
      else{
        this.mode='edit';
        this.productId = JSON.parse(id);
        this.productsApiService.getProduct(id).subscribe(p => {
          forkJoin([this.categoriesApiService.getCategories(false)
            , this.areasApiService.getAreas(false)
            , this.uomapiService.getUoms()]).subscribe(d => {
            this.categories = d[0];
            this.areas = d[1];
            this.uoms = d[2];
            this.productForm.patchValue({
              productName: p.name,
              category: Number(p.categoryId),
              area: Number(p.areaId),
              uom: p.uomId,
              priceUom: p.priceUomId
            });
            });
        });
      }
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
