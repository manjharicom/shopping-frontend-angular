import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule, FormsModule, FormArray   } from '@angular/forms';
import { Router } from '@angular/router';
import { SupermarketApiService } from '../../../shared/services/supermarket-api.service';
import {
  ApiCallState,
  CboFilterListArray,
  CboFilterModel,
  FilterPageType,
} from '../../cbo-filter-selector/cbo-filter-selector.models';
import { FilterService } from '../../cbo-filter-selector/filter.service'
import { CategorySupermarketModel } from 'src/app/shared/models/category-supermarket.model';
import { MergeCategorySupermarketModel } from 'src/app/shared/models/merge-category-supermarket.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supermarket-merge',
  templateUrl: './supermarket-merge.component.html',
  styleUrls: ['./supermarket-merge.component.scss']
})
export class SupermarketMergeComponent implements OnInit {
  constructor(
    private apiService: SupermarketApiService,
    private router: Router,
    private filterService: FilterService,
    private toastr: ToastrService,
    private fb: FormBuilder){
    }

  superMarketForm!: FormGroup;
  filterModel: CboFilterModel = new CboFilterModel();
  filterModelClearState: any;
  isLoading: boolean = false;
  superMarketFilters: CboFilterListArray[] = [];
  isLoaded: boolean = false;
  isDropDownLoaded: boolean = false;

  ngOnInit(): void{
    this.loadFilterOptions();
    this.superMarketForm = this.fb.group({
      merge: this.fb.array([]),
    });
  }

  get merge(): FormArray {
    return this.superMarketForm.get('merge') as FormArray;
  }

  buildFormArray():FormGroup{
    return new FormGroup({
      categoryId: new FormControl(''),
      category: new FormControl(''),
      aisleLabel: new FormControl(''),
      sequence: new FormControl(''),
      include: new FormControl(''),
    });
  }

  private loadFilterOptions(){
    this.isLoading = true;

    this.isDropDownLoaded = false;
    this.apiService.getSuperMarkets().subscribe(d => {
      d.forEach((s) => {
        const selected = s.superMarketId === 1 ? true : false;
        this.superMarketFilters.push({
          Value: s.superMarketId,
          Name: s.name,
          Selected: selected,
          Id: s.superMarketId
        });
        this.isDropDownLoaded = true;
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
          name: "superMarketId",
          type: FilterPageType.SelectList,
          listArray: this.superMarketFilters,
          value: "Select Shop"
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
          name: 'List',
          label: 'List',
          cssClasses: 'btn btn-primary',
          function: this.handleOnFilter,
          disabled: !this.isDropDownLoaded
        },
      ]
    }
  }
 
  private loadSuperMarkets(query: string){
    //console.log(query);
    this.isLoaded=false;
    this.merge.clear();
    this.apiService.getCategorySuperMarkets(query).subscribe(sups => {
        sups.forEach(s => {
          const mergeForm = this.fb.group({
              categoryId: [s.categoryId],
              category: [s.category],
              aisleLabel: [s.aisleLabel],
              sequence: [s.sequence]
            });
            this.merge.push(mergeForm);
          });
          this.isLoaded=true;
    });
  }
 
  handleOnClear = () => {
    var value = JSON.stringify(this.filterModelClearState);
    //console.log(value);
    this.filterModel.filters = JSON.parse(value);
    this.merge.clear();
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

  getFilterValue(): string{
    var query = this.filterService.getFilterValue(this.filterModel.filters, "superMarketId");
    return query;
  }

  private saveInitialFilters() {
    var value = JSON.stringify(this.filterModel.filters);
    //console.log(value);
    this.filterModelClearState = JSON.parse(value);
  }

  onSubmit(){
    //console.log(this.merge.controls[0].value.categoryId);
    var categorySuperMarkets = this.merge.controls.map(s => <MergeCategorySupermarketModel>{
        categoryId:s.value.categoryId,
        aisleLabel: s.value.aisleLabel,
        sequence: s.value.sequence,
        include: s.value.sequence && s.value.aisleLabel ? true : false
    });
    //console.log(categorySuperMarkets);
    var superMarketId = Number(this.getFilterValue());
    this.apiService.mergeCategorySuperMarkets(superMarketId, categorySuperMarkets).subscribe(m => {
      this.showToastrMessage(m.responseCode, m.responseMessage);
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
