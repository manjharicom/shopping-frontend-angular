export enum FilterPageType {
    Text = 0,
    SelectList = 1,
    DatePicker = 2,
    Checkbox = 3,
    Empty = 4,
    Group = 5,
    MultiSelectList = 6,
  }
  
  export class CboFilterModel {
    apiData: Array<any> = [];
    apiCallState: ApiCallState = ApiCallState.New;
    columns?: Array<CboFilterColumnArray> = [];
    rows?: Array<any> = [];
    sorts?: Array<any> = [];
    filters: Array<CboFilter> = [];
    buttons?: Array<CboFilterButton> = [];
    changeListener?: any;
    totals?: any;
  }
  
  export enum ApiCallState {
    New = 0,
    Pending = 1,
    Loaded = 2,
    Error = 3,
  }
  
  export class CboFilter {
    label: string | undefined;
    name: string | undefined;
    type: FilterPageType | undefined;
    listArray?: Array<CboFilterListArray>;
    disableWatcher?: boolean; // does this control need to be disabled?
    disabledObject?: DisabledObject;
    value?: any;
    visibleWatcher?: boolean; // does this control need to be disabled?
    visibleObject?: DisabledObject;
    hide?: boolean;
    message?: MessageObject;
    groupFilters?: GroupFiltersObject = new GroupFiltersObject();
    cssClass?: string;
    showMultiOptions?: boolean = false;
  }
  
  export class GroupFiltersObject {
    cssClass?: string;
    filters?: Array<CboFilter> = [];
    message?: MessageObject;
  }
  
  export class CboFilterColumnArray {
    prop: string | undefined;
    label?: string;
    tooltip?: any;
  }
  
  export class CboFilterListArray {
    Value: any;
    Name: string | undefined;
    Selected?: boolean;
    Id?: number;
  }
  
  export class CboFilterButton {
    name: string | undefined;
    label: string | undefined;
    cssClasses?: string;
    function: any;
    disabled?: boolean;
    hide?: boolean;
  }
  
  export class DisabledObject {
    dependencyName: string | undefined; // name of dependant option
    matchValue: any; // value to match in order to enable
  }
  
  export class MessageObject {
    show: boolean | undefined;
    text: string | undefined;
    cssClass: string | undefined;
  }
  