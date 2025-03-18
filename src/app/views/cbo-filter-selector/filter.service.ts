import { Injectable } from '@angular/core';
import {
  CboFilter,
  FilterPageType,
} from '../cbo-filter-selector/cbo-filter-selector.models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  getFilter(filters: CboFilter[], name:string):CboFilter{
    return filters.find(n => n.name == name) ?? filters[0];
  }

  getFilterValue(filters: CboFilter[], name:string): string{
    let filter = filters.find(n => n.name == name) ?? filters[0];
    return this.getFilterValueFromFilter(filter);
  }

  private getFilterValueFromFilter(filter: CboFilter): string{
    var query = '';
    switch(filter.type){
      case FilterPageType.Text:
        query=filter.value ? filter.value : '';
        break;
      case FilterPageType.SelectList:
        var selectedOption = filter.listArray?.find((x) => x.Value == filter.value);
        query = selectedOption?.Id?.toString() ?? '';
        break;
      case FilterPageType.MultiSelectList:
        if (filter.listArray !== undefined){
          filter.listArray.filter((x:any) => x.Selected)
            .forEach((x:any) => {
              query += `${x.Id},`;
            });
          }
        if (query.includes(',')) query = query.substring(0, query.length - 1);
        break;
    }
    return query;
  }

  generateQuery(filters: CboFilter[]): string {
    var query = '';
    filters.forEach(async (i) => {
      if (query === ''){
        query += `?`;
      }
      else{
        query += `&`;
      }

      switch (i.type) {
        case FilterPageType.Text:
          query += `${i.name}=${i.value ? i.value : ''}`;
          break;
        case FilterPageType.SelectList:
          var selectedOption = i.listArray?.find((x) => x.Value == i.value);
          query += `${i.name}=${
            selectedOption && selectedOption.Id !== undefined
              ? selectedOption.Id
              : ''
          }`;
          break;
        case FilterPageType.MultiSelectList:
          query += `${i.name}=`;
          if (i.listArray !== undefined){
            i.listArray.filter((x:any) => x.Selected)
            .forEach((x:any) => {
              query += `${x.Id},`;
            });
          }
          if (query.includes(',')) query = query.substring(0, query.length - 1);
          break;
        case FilterPageType.Checkbox:
          query += `${i.name}=${i.value ? i.value : false}`;
          break;
      }
    });
    return query;
  }

  // generatePostObject(filters: CboFilter[]): object{
  //   var postObj: {[index: string]:any};
  //   filters.forEach(async (i:any) => {
  //     switch (i.type) {
  //       case FilterPageType.Text:
  //         postObj[i.name] = i.value;
  //         //query += `?${i.name}=${ ? i.value : ''}`;
  //         break;
  //     }
  //   });
  //   return postObj;
  // }

  buildParamUrl(filter: any): any {
    const postOjbect = {};

    this.getPostObj(
      filter,
      postOjbect,
      this.valueNotDisabled,
      this.filterObjByName,
      this.getPostObj
    );
    return {
      urlString: new URLSearchParams(postOjbect).toString(),
      populatedObject: postOjbect,
    };
  }

  getPostObj(
    filter: any,
    postOjbect: {[index: string]:any},
    valueNotDisabled: Function,
    filterObjByName: Function,
    callBack?: Function
  ): any {
    filter.forEach((x: any) => {
      if (x.value && valueNotDisabled(x, filter, filterObjByName)) {
        switch (x.type) {
          case FilterPageType.Checkbox:
            postOjbect[x.name] = x.value ? x.value : false;
            break;
          case FilterPageType.DatePicker:
            postOjbect[x.name] = x.value
              ? moment(x.value).format('YYYY-MM-DD')
              : '';
            break;
          case FilterPageType.Group:
            if (callBack && x.groupFilters && x.groupFilters.filters) {
              callBack(
                x.groupFilters.filters,
                postOjbect,
                valueNotDisabled,
                filterObjByName,
                null
              );
            }
            break;
          default:
            postOjbect[x.name] = x.value ? x.value : '';
        }
      }
    });
  }

  valueNotDisabled(x: any, filter: any, filterObjByName: Function) {
    if (x.disableWatcher) {
      if (
        x.disabledObject.matchValue.toString() ===
        filterObjByName(
          filter,
          x.disabledObject.dependencyName
        ).value.toString()
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  filterObjByName(filtersArray: any, name: string) {
    let returnObj = null;
    filtersArray.forEach((x: any) => {
      if (x.name === name) {
        returnObj = x;
      }
    });
    return returnObj;
  }
 
}
