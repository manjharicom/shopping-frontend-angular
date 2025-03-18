import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AreasApiService } from '../../../shared/services/areas-api.service'
import { CategoriesApiService } from '../../../shared/services/categories-api.service'
import { ProductsapiService } from '../../../shared/services/productsapi.service';
import { ReportsapiService } from '../../../shared/services/reportsapi.service';
import { FullProductModel } from '../../../shared/models/full-product.model';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../cbo-filter-selector/filter.service'
import { ModalService } from '../../../shared/services/modal.service'
import { ToastrService } from 'ngx-toastr';
import { NewProductResponseModel } from 'src/app/shared/models/new-product-response.model';
import { ExportProductModel } from 'src/app/shared/models/export-product.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxBootstrapModalComponent } from '../../../shared/components/ngx-bootstrap-modal/ngx-bootstrap-modal.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  constructor(
    private productsApiService: ProductsapiService,
    private areasApiService: AreasApiService,
    private categoriesApiService: CategoriesApiService,
    private reportsapiService: ReportsapiService,
    private toastr: ToastrService,
    private router: Router,
    private filterService: FilterService,
    protected modalService: ModalService,
    protected listModelService: BsModalService){}

  products: FullProductModel[] = [];
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  categories: CboFilterListArray[] = [];
  areas: CboFilterListArray[] = [];
  
  ngOnInit(): void{
    this.loadFilterOptions();
    this.loadProducts();
  }

  private loadProducts(query?: string){
    //console.log(query);
    this.productsApiService.getProducts(1, query).subscribe({
      next: prods => {
        this.products = prods;
      }
    });
  }
  
  handleOnRemoveClick(prod:any) {
      this.productsApiService.removeProductFromList(prod.productId, prod.shoppingListId).subscribe(() => {
            //this.listItems = [];
            var query = this.generateSearchQuery();
            this.loadProducts(query);
        }
      );
  }

  private loadFilterOptions(){
    this.isLoading = true;

    const cats = this.categoriesApiService.getCategories(false);
    const areas = this.areasApiService.getAreas(false);
    forkJoin([cats, areas]).subscribe(d => {
      this.categories.push({
        Value: undefined,
        Name: 'Select a Category',
        Selected: true,
        Id: undefined
      });
      d[0].forEach((cat) => {
        this.categories.push({
          Value: cat.categoryId,
          Name: cat.name,
          Selected: false,
          Id: cat.categoryId
        });
      });

      this.areas.push({
        Value: undefined,
        Name: 'Select a Storage Area',
        Selected: true,
        Id: undefined
      });
      d[1].forEach((area) => {
        this.areas.push({
          Value: area.areaId,
          Name: area.name,
          Selected: false,
          Id: area.areaId
        });
      });
      //console.log(this.areas);
      this.loadFilters();
      this.saveInitialFilters();
      this.isLoading = false;
    });
  }

  private loadFilters(){
    this.filterModel = {
      apiCallState: ApiCallState.New,
      apiData: [],
      columns: [],
      sorts: [],
      filters: [
        {
          label: "Product",
          name: "searchText",
          type: FilterPageType.Text
        },
        {
          label: 'Category',
          name: 'categoryId',
          type: FilterPageType.SelectList,
          listArray: this.categories,
          value: "Select category"
        },
        {
          label: 'Storage Area',
          name: 'areaId',
          type: FilterPageType.SelectList,
          listArray: this.areas,
          value: "Select area"
        },
      ],
      buttons: [
        {
          name: 'Clear',
          label: 'Clear',
          cssClasses: 'btn btn-default border',
          function: this.handleOnClear,
        },
        {
          name: 'Filter',
          label: 'Filter',
          cssClasses: 'btn btn-primary',
          function: this.handleOnFilter,
        },
      ]
    }
  }

  private saveInitialFilters() {
    var value = JSON.stringify(this.filterModel.filters);
    //console.log(value);
    this.filterModelClearState = JSON.parse(value);
  }
 
  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    //console.log(value);
    this.filterModel.filters = JSON.parse(value);
  
    // clear saved expansion for each certificate type section
    localStorage.removeItem('products');

    this.handleOnFilter();
  };

  handleOnFilter = () => {
    this.isLoading = true;
    var query = this.generateSearchQuery();
    //console.log(query);
    this.loadProducts(query);
    //console.log(query);
    this.isLoading = false;
  };

  generateSearchQuery(): string {
    var query = this.filterService.generateQuery(this.filterModel.filters);
    return query;
  }

  handleAddedToList(e:any){
    this.toastr.success('Product "' + e.product + '" Successfully Added to Shopping List "' + e.name + '"');
    this.handleOnFilter();
    this.modalService.close();
  }

  handleEdited(d:NewProductResponseModel){
    this.showToastrMessage(d.responseCode, d.responseMessage);
    this.handleOnFilter();
    this.modalService.close();
  }

  generateExportModel():ExportProductModel{
    let textValue = this.filterService.getFilterValue(this.filterModel.filters, "searchText")
    let categoryValue = this.filterService.getFilterValue(this.filterModel.filters, "categoryId");
    let areaValue = this.filterService.getFilterValue(this.filterModel.filters, "areaId");

    const obj: ExportProductModel = {
      searchText:textValue ? textValue : undefined, 
      categoryId:categoryValue ? Number(categoryValue) : undefined, 
      areaId:areaValue ? Number(areaValue) : undefined
    }
    return obj;
  }

  handleExport(){
    let obj = this.generateExportModel();
    this.reportsapiService.exportProducts(obj).subscribe(res =>{
      const filePath = res.virtualPath;
      const baseUrl = window.location.origin;
      window.open(baseUrl + filePath);
    })
  }
  
  showToastrMessage(code: number, message: string){
    if (code < 0){
      this.toastr.error(message);
    }
    else{
      this.toastr.success(message);
    }
  }

   openListModal(product: FullProductModel) {
    const modalRef = this.listModelService.show(NgxBootstrapModalComponent, Object.assign({}, { class: 'gray modal-lg' }));
    modalRef.content.product = product;
    modalRef.content.modalRef = modalRef;
    modalRef.content.added.subscribe((p:any) => {
      this.handleAddedToList(p);
    });
  }

}
