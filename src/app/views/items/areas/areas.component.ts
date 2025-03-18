import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { AreasApiService } from '../../../shared/services/areas-api.service'
import { ProductsapiService } from '../../../shared/services/productsapi.service';
import { AreaModel } from '../../../shared/models/area.model';
import { ListItem } from '../../../containers/list-container/list-types/list-item';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';

import { FilterService } from '../../cbo-filter-selector/filter.service'
import { ModalService } from '../../../shared/services/modal.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {
  constructor(
    private apiService: AreasApiService,
    private productsApiService: ProductsapiService,
    private filterService: FilterService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    protected modalService: ModalService,){}

  areasWithProducts: AreaModel[] = [];
  listItems: ListItem[] = [];
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  isFalse: boolean = false;
  areas: CboFilterListArray[] = [];

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadAreas();
  }

  private loadAreas(query?: string){
    this.apiService.getAreas(true, query).subscribe({
      next: areas => {
        this.areasWithProducts = areas;
        areas.forEach((area) => {
          if (area.hasProducts){
            this.listItems.push({
              Id: area.areaId,
              Name: area.name,
              isSubItemExpanded: true,
              SubItems: area.products
            })
          }
        });
      }
    });
  }

  private loadFilterOptions(){
    this.isLoading = true;
    this.apiService.getAreas(false).subscribe((data) => {
      data.forEach((cat) => {
        this.areas.push({
          Value: cat.areaId,
          Name: cat.name,
          Selected: false,
          Id: cat.areaId
        });
      });
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
          label: 'Storage Areas',
          name: 'areas',
          type: FilterPageType.SelectList,
          listArray: this.areas,
          value: "Select Storage Area"
        }
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
    };
  }

  getStatusIndicator = (status: string) => {
    return "Active";
  };

  handleOnAddClick(prod:any) {
    //this.modalService.open('add-product-area', prod.productId, prod.name)
    this.toastr.success('Product Successfully Added to Shopping List');
    this.handleOnFilter();
  }

  handleOnRemoveClick(prod:any) {
    this.productsApiService.removeProductFromList(prod.productId, prod.shoppingListId).subscribe(
      {
        next: p => {
          this.listItems = [];
          var query = this.generateSearchQuery();
          this.loadAreas(query);
        }
      }
    );
  }

  handleOnAddBtnClick(cat:any){
    //this.modalService.open('add-product-area', cat.productId, cat.name);
    this.toastr.success('Product Successfully Added to Shopping List');
    this.handleOnFilter();
  }

  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    this.filterModel.filters = JSON.parse(value);
  
    // clear saved expansion for each section
    localStorage.removeItem('areas');

    this.handleOnFilter();
  };

  handleOnFilter = () => {
    this.isLoading = true;
    var query = this.generateSearchQuery();
    this.listItems = [];
    this.loadAreas(query);
    this.isLoading = false;
  };

  generateSearchQuery(): string {
    var query = this.filterService.generateQuery(this.filterModel.filters);
    return query;
  }

  private saveInitialFilters() {
    var value = JSON.stringify(this.filterModel.filters);
    //console.log(value);
    this.filterModelClearState = JSON.parse(value);
  }
  
  handleAdd(){
    this.router.navigate(['items/areas/new']);
  }

  handleEdit(area:any){
    this.router.navigate(['items/areas/edit/'+area.areaId]);
  }

  handleAdded(x:any){
    this.toastr.success('Product Successfully Added to Shopping List');
    this.handleOnFilter();
    this.modalService.close();

  }
}
