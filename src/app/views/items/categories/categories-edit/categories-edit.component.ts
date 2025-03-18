import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { CategoriesApiService } from '../../../../shared/services/categories-api.service'
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewItemModel } from 'src/app/shared/models/new-item.model';
import { EditItemModel } from 'src/app/shared/models/edit-item.model';

@Component({
  selector: 'app-categories-edit',
  templateUrl: './categories-edit.component.html',
  styleUrls: ['./categories-edit.component.scss']
})
export class CategoriesEditComponent implements OnInit {
  categoryForm!: FormGroup;
  routeParamsSub!: Subscription;
  mode!: string;
  categoryId?:number;

  constructor(
    private apiService: CategoriesApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.loadCategory();
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });
  }

  get name(){
    return this.categoryForm.get('name');
  }

  private loadCategory(){
    this.routeParamsSub = this.route.params.subscribe((r) => {
      var id = r['id'];
      if (id == undefined){
        this.mode='new';
      }
      else{
        this.mode='edit';
        this.categoryId = JSON.parse(id);
        this.apiService.getCategory(id).subscribe(c => {
          this.categoryForm.patchValue({
            name: c.name
          });
        });
      }
    });
  }

  submit(){
    if(this.mode == "new"){
      const newCategory:NewItemModel = {
        name: this.name?.value
      };
      this.apiService.addCategory(newCategory).subscribe(d => {
        this.showToastrMessage(d.responseCode, d.responseMessage);
      });
    }else{
      const editProduct:EditItemModel = {
        id: this.categoryId,
        name: this.name?.value,
      };
      this.apiService.updateCategory(editProduct).subscribe(d => {
        this.showToastrMessage(d.responseCode, d.responseMessage);
      });
  }
  localStorage.removeItem('categories');
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
