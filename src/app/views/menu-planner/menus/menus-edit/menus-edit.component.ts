import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule, FormArray, FormBuilder   } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { MenuApiService } from '../../../../shared/services/menu-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AddRecipeModel } from '../../../../shared/models/add-recipe.model';
import { UpdateMenuModel } from '../../../../shared/models/update-menu.model';
import { RecipeProductModel } from 'src/app/shared/models/recipe-product.model';
import { AddProductRecipeModalComponent } from '../../../../shared/components/add-product-recipe-modal/add-product-recipe-modal.component';
import { AddRecipeMenuModalComponent } from '../../../../shared/components/add-recipe-menu-modal/add-recipe-menu-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RecipeModel } from 'src/app/shared/models/recipe.model';

@Component({
  selector: 'app-menus-edit',
  templateUrl: './menus-edit.component.html',
  styleUrls: ['./menus-edit.component.scss']
})
export class MenusEditComponent implements OnInit, OnDestroy {
  menuForm!: FormGroup;
  routeParamsSub!: Subscription;
  mode!: string;
  menuId?:number;
  menuName?:string;
  products:RecipeProductModel[] = [];
  recipes: RecipeModel[] = [];
  editor!: Editor;
  bsModalRef!: BsModalRef;
  
  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];
  colorPresets = ['red', '#FF0000', 'rgb(255, 0, 0)'];
  constructor(private apiService: MenuApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService){}

    ngOnInit(): void {
      this.editor = new Editor();
      this.loadMenu();
      this.menuForm = this.fb.group({
        name: this.fb.control('', [Validators.required]),
        cookingInstructions: this.fb.control('', [Validators.required]),
      });
      this.modalService.onHidden.subscribe(() => {
        this.products = [];
        this.recipes = [];
        this.loadMenu();
      });
    }
  
    get name(){
      return this.menuForm.get('name');
    }
  
    get cookingInstructions(){
      return this.menuForm.get('cookingInstructions');
    }
  
    private loadMenu(){
      this.routeParamsSub = this.route.params.subscribe(r => {
        var id = r['id'];
        if (id == undefined){
          this.mode='new';
        } else {
          this.mode='edit';
          this.menuId = JSON.parse(id);
          this.apiService.get(id).subscribe(r => {
            this.menuName = r.name;
            this.menuForm.patchValue({
              name: r.name,
              cookingInstructions: r.cookingInstructions
            });
            if (r.products){
              r.products?.forEach(p => {
                this.products.push(p);
              })
            }
            if (r.recipes){
              r.recipes.forEach(p => {
                this.recipes.push(p);
              });
            }
          });
        }
  
      });
    }
  
    removeProduct(productId:number){
      this.apiService.deleteProduct(this.menuId, productId).subscribe(d => {
        this.products = [];
        this.recipes = [];
        this.loadMenu();
      });
    }  

    removeRecipe(recipeId:number){
      this.apiService.deleteRecipe(this.menuId, recipeId).subscribe(d => {
        this.products = [];
        this.recipes = [];
        this.loadMenu();
      });
    }

 
    openModal(){
      const initialState = {
        menuId: this.menuId,
        name: this.menuName
      };
  
      this.bsModalRef = this.modalService.show(AddProductRecipeModalComponent, { initialState });
      this.bsModalRef.setClass('modal-lg');
    }

    openRecipeModal(){
      const initialState = {
        menuId: this.menuId,
        name: this.menuName
      };
  
      this.bsModalRef = this.modalService.show(AddRecipeMenuModalComponent, { initialState });
      this.bsModalRef.setClass('modal-lg');
    }
  
    submit(){
      if(this.mode == "new"){
        const newCategory:AddRecipeModel = {
          name: this.name?.value,
          cookingInstructions: this.cookingInstructions?.value
        };

        this.apiService.add(newCategory).subscribe(d => {
          let responseCode = d.responseCode > 0 ? 0 : d.responseCode;
          this.showToastrMessage(responseCode, d.responseMessage);
          if(d.responseCode > 0){
            this.router.navigate(['menu-planner/menus/edit/'+d.responseCode]);
          }
        });
      }else{
        const editProduct:UpdateMenuModel = {
          menuId: this.menuId,
          name: this.name?.value,
          cookingInstructions: this.cookingInstructions?.value,
        };
        this.apiService.update(editProduct).subscribe(d => {
          this.showToastrMessage(d.responseCode, d.responseMessage);
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
  
    // make sure to destory the editor
    ngOnDestroy(): void {
      this.editor?.destroy();
    }
   
  }
