import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule, FormArray, FormBuilder   } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { RecipeApiService } from '../../../../shared/services/recipe-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AddRecipeModel } from '../../../../shared/models/add-recipe.model';
import { UpdateRecipeModel } from '../../../../shared/models/update-recipe.model';
import { RecipeProductModel } from 'src/app/shared/models/recipe-product.model';
import { AddProductRecipeModalComponent } from '../../../../shared/components/add-product-recipe-modal/add-product-recipe-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-recipes-edit',
  templateUrl: './recipes-edit.component.html',
  styleUrls: ['./recipes-edit.component.scss']
})
export class RecipesEditComponent implements OnInit, OnDestroy{
  recipeForm!: FormGroup;
  routeParamsSub!: Subscription;
  mode!: string;
  recipeId?:number;
  recipeName?:string;
  products:RecipeProductModel[] = [];
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
  constructor(private apiService: RecipeApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService){}

  ngOnInit(): void {
    this.editor = new Editor();
    this.loadRecipe();
    this.recipeForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      cookingInstructions: this.fb.control('', [Validators.required]),
    });
    this.modalService.onHidden.subscribe(() => {
      this.products = [];
      this.loadRecipe();
    });
  }

  get name(){
    return this.recipeForm.get('name');
  }

  get cookingInstructions(){
    return this.recipeForm.get('cookingInstructions');
  }

  private loadRecipe(){
    this.routeParamsSub = this.route.params.subscribe(r => {
      var id = r['id'];
      if (id == undefined){
        this.mode='new';
      } else {
        this.mode='edit';
        this.recipeId = JSON.parse(id);
        this.apiService.get(id).subscribe(r => {
          this.recipeName = r.name;
          this.recipeForm.patchValue({
            name: r.name,
            cookingInstructions: r.cookingInstructions
          });
          if (r.products){
            r.products?.forEach(p => {
              this.products.push(p);
            })
          }
        });
      }

    });
  }

  remove(productId:number){
    this.apiService.delete(this.recipeId, productId).subscribe(d => {
      this.products = [];
      this.loadRecipe();
    });
  }

  openModal(){
    const initialState = {
      recipeId: this.recipeId,
      name: this.recipeName
    };

    this.bsModalRef = this.modalService.show(AddProductRecipeModalComponent, { initialState });
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
          this.router.navigate(['menu-planner/recipes/edit/'+d.responseCode]);
        }
      });
    }else{
      const editProduct:UpdateRecipeModel = {
        recipeId: this.recipeId,
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
