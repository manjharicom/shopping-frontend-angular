import { Component, EventEmitter,Input,  OnInit,  Output,  Renderer2 } from '@angular/core';
import {
  CboFilter,
  CboFilterListArray,
  FilterPageType,
} from './cbo-filter-selector.models';

@Component({
  selector: 'app-cbo-filter-selector',
  templateUrl: './cbo-filter-selector.component.html',
  styleUrls: ['./cbo-filter-selector.component.scss']
})
export class CboFilterSelectorComponent implements OnInit {
  isMultiOptionShow: boolean = false;
  selectedAll: boolean = false;
  selectAllText: string = "";
  numOfSelectedItems: number = 2;
  @Input() model: any;
  @Output() dateChanged = new EventEmitter<any>();

  FilterPageType = FilterPageType;
  rows = [];
  dpConfig: any = {
    containerClass: 'theme-bidone',
    dateInputFormat: 'DD-MM-YYYY',
  };

  constructor(
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.selectedAll = false;
    this.selectAllText = 'Select All';
  }

  submit() {
    // console.log('filter submit clicked');
  }

  emitChange(name: any) {
    if (typeof this.model.changeListener !== 'undefined') {
      this.model.changeListener(name);
    }
  }

  closeDropdown(filter: any) {
    if (filter.showMultiOptions) {
      filter.showMultiOptions = false;
    }
  }

  checkDisableStatus(filter: any) {
    const dependency = this.model.filters.filter((x:any) => {
      return x.name === filter.disabledObject.dependencyName;
    })[0];
    // values set parsed to strings as default enum id's are of type integer then changed back to string on dropdowns
    return !(
      dependency.value.toString() ===
      filter.disabledObject.matchValue.toString()
    );
  }

  checkHideStatus(filter: any) {
    const dependency = this.model.filters.filter((x:any) => {
      return x.name === filter.visibleObject.dependencyName;
    })[0];
    // values set parsed to strings as default enum id's are of type integer then changed back to string on dropdowns
    return !(
      dependency.value.toString() === filter.visibleObject.matchValue.toString()
    );
  }

  fetch(cb: any) {
    const req = new XMLHttpRequest();
    req.open('GET', `/assets/GetSellThruReport.json`);

    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };

    req.send();
  }

  onDateValueChange(date: Date, name: string): void {
    this.dateChanged.emit({ date: date, name: name });
  }

  multiSelectOnClick(filter: CboFilter) {
    filter.showMultiOptions = !filter.showMultiOptions;
    // this.isMultiOptionShow = !this.isMultiOptionShow;
  }

  selectOrUnSelectAll(filter: CboFilter) {
    if (filter.listArray && filter.listArray.length > 0) {
      this.selectedAll = !this.selectedAll;
      filter.listArray.forEach((i) => (i.Selected = this.selectedAll));
      this.selectAllText = this.selectedAll
        ? 'UnSelect All'
        : 'Select All';
    }
  }

  onOptionClick(option: CboFilterListArray, filter: CboFilter) {
    option.Selected = !option.Selected;

    this.selectedAll =
      filter.listArray?.filter((i) => i.Selected).length ===
      filter.listArray?.length;
    this.selectAllText = this.selectedAll ? 'Unselect All' : 'Select All';
  }

  selectedOptions(filter: CboFilter): CboFilterListArray[] {
    if(filter.listArray != undefined){
      return filter.listArray.filter((i, index) => i.Selected && i.Name !== filter.value).slice(0, this.numOfSelectedItems);
    }
    else{
      return [];
    }
  }

  howManyMoreToShow(filter: CboFilter): number {
    var selectedLength = filter.listArray?.filter((i) => i.Selected).length;

    if(selectedLength != undefined){
      return selectedLength - this.numOfSelectedItems;
    }
    else{
      return this.numOfSelectedItems;
    }
  }
}
