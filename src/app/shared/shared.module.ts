import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { ReactiveFormsModule, FormsModule }   from '@angular/forms';
import { DisableControlDirective } from './directives/disable-control.directive';
import { NgxBootstrapModalComponent } from './components/ngx-bootstrap-modal/ngx-bootstrap-modal.component';
import { ModalModule, BsModalService  } from 'ngx-bootstrap/modal';
import { AddEditProductModalComponent } from './components/add-edit-product-modal/add-edit-product-modal.component';
import { ProductSearchModalComponent } from './components/product-search-modal/product-search-modal.component';
import { AddProductRecipeModalComponent } from './components/add-product-recipe-modal/add-product-recipe-modal.component';  
import { CboFilterSelectorModule } from '../views/cbo-filter-selector/cbo-filter-selector.module';
import { AddRecipeMenuModalComponent } from './components/add-recipe-menu-modal/add-recipe-menu-modal.component';

@NgModule({
    declarations: [
    ProductModalComponent,
    DisableControlDirective,
    NgxBootstrapModalComponent,
    AddEditProductModalComponent,
    ProductSearchModalComponent,
    AddProductRecipeModalComponent,
    AddRecipeMenuModalComponent
  ],
    imports: [CommonModule,
      FormsModule, 
      ReactiveFormsModule,  
      CboFilterSelectorModule,
      ModalModule.forRoot()],
    providers: [BsModalService],
    exports: [
      ProductModalComponent,
      DisableControlDirective,
      NgxBootstrapModalComponent,
      AddEditProductModalComponent
    ],
    entryComponents: [SharedModule.rootComponent],
  })
  export class SharedModule {
    static rootComponent = ProductModalComponent
  }
  