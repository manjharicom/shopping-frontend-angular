import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { AreasApiService } from '../../../../shared/services/areas-api.service'
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewItemModel } from 'src/app/shared/models/new-item.model';
import { EditItemModel } from 'src/app/shared/models/edit-item.model';

@Component({
  selector: 'app-areas-edit',
  templateUrl: './areas-edit.component.html',
  styleUrls: ['./areas-edit.component.scss']
})
export class AreasEditComponent {
  areaForm!: FormGroup;
  routeParamsSub!: Subscription;
  mode!: string;
  areaId?:number;

  constructor(
    private apiService: AreasApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
      this.loadArea();
      this.areaForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
      });
    }
 
    get name(){
      return this.areaForm.get('name');
    }

    private loadArea(){
      this.routeParamsSub = this.route.params.subscribe((r) => {
        var id = r['id'];
        if (id == undefined){
          this.mode='new';
        }
        else{
          this.mode='edit';
          this.areaId = JSON.parse(id);
          this.apiService.getArea(id).subscribe(c => {
            this.areaForm.patchValue({
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
        this.apiService.addArea(newCategory).subscribe(d => {
          this.showToastrMessage(d.responseCode, d.responseMessage);
        });
      }else{
        const editProduct:EditItemModel = {
          id: this.areaId,
          name: this.name?.value,
        };
        this.apiService.updateArea(editProduct).subscribe(d => {
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
  
}
