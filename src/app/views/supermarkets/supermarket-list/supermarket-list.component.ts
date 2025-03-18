import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SuperMarketModel } from 'src/app/shared/models/super-market.model';
import { SupermarketApiService } from '../../../shared/services/supermarket-api.service';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../cbo-filter-selector/filter.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supermarket-list',
  templateUrl: './supermarket-list.component.html',
  styleUrls: ['./supermarket-list.component.scss']
})
export class SupermarketListComponent implements OnInit {
  constructor(
    private apiService: SupermarketApiService,
    private router: Router,
    private toastr: ToastrService,
    private filterService: FilterService,){}

    filterModel: CboFilterModel = new CboFilterModel();
    filterModelClearState: any;
    isLoading: boolean = false;
    superMarketFilters: CboFilterListArray[] = [];
    superMarkets: SuperMarketModel[] = [];

  ngOnInit(): void{
    this.loadFilterOptions();
    this.loadSuperMarkets();
  }

  private loadSuperMarkets(query?: string){
    //console.log(query);
    this.apiService.getSuperMarkets(query).subscribe({
      next: sups => {
        this.superMarkets = sups;
      }
    });
  }

  private loadFilterOptions(){
    this.isLoading = true;

    this.apiService.getSuperMarkets().subscribe(d => {
      this.superMarketFilters.push({
        Value: undefined,
        Name: 'All Super Markets',
        Selected: true,
        Id: undefined
      });
      d.forEach((s) => {
        this.superMarketFilters.push({
          Value: s.superMarketId,
          Name: s.name,
          Selected: false,
          Id: s.superMarketId
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
          label: "Shop",
          name: "superMarketIds",
          type: FilterPageType.SelectList,
          listArray: this.superMarketFilters,
          value: "Select SuperMarket"
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
    }
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
    this.loadSuperMarkets(query);
    //console.log(query);
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
    this.router.navigate(['supermarkets/new/']);
  }
  
  handleEdit(prod:any){
    this.router.navigate(['supermarkets/edit/'+prod.superMarketId]);
  }
  
  handleOnAddClick(prod:any){}
  
  handleOnRemoveClick(prod:any){}

  handleDelete(supermarketId: number){
    this.apiService.deleteSuperMarket(supermarketId).subscribe(() => {
      var query = this.filterService.generateQuery(this.filterModel.filters);
      this.toastr.success("SuperMarket deleted.")
      this.loadSuperMarkets(query);
    });
  }
}
