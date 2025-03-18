import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { NewItemModel } from 'src/app/shared/models/new-item.model'
import { UomsapiService } from 'src/app/shared/services/uomsapi.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EditItemModel } from 'src/app/shared/models/edit-item.model';
import { NewUomModel } from 'src/app/shared/models/new-uom.model';
import { EditUomModel } from 'src/app/shared/models/edit-uom.model';

@Component({
  selector: 'app-uoms-edit',
  templateUrl: './uoms-edit.component.html',
  styleUrls: ['./uoms-edit.component.scss']
})
export class UomsEditComponent {
  form!: FormGroup;
  mode!: string;
  uomId!: number;
  routeParamsSub!: Subscription;

  constructor(
    private apiService: UomsapiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.loadUom();
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      allowDecimalQuantity: new FormControl('', [Validators.required]),
    });
  }

  get name(){
    return this.form.get('name');
  }

  get allowDecimalQuantity(){
    return this.form.get('allowDecimalQuantity');
  }

  private loadUom(){
    this.routeParamsSub = this.route.params.subscribe((r) => {
      var id = r['id'];
      if (id == undefined){
        this.mode='new';
      }else{
        this.mode='edit';
        this.uomId = JSON.parse(id);

        this.apiService.getUom(id).subscribe(u => {
          this.form.patchValue({
            name: u.name,
            allowDecimalQuantity: u.allowDecimalQuantity
          });
        });
      }
    });
  }

  submit(){
    if (this.mode === "new"){
      const postObj: NewUomModel = {
        name: this.name?.value,
        allowDecimalQuantity: this.allowDecimalQuantity?.value
        }
      this.apiService.addUom(postObj).subscribe(d => {
        this.showToastrMessage(d.responseCode, d.responseMessage);
      });
    }else{
      const putObj: EditUomModel = {
        id: this.uomId,
        name: this.name?.value,
        allowDecimalQuantity: this.allowDecimalQuantity?.value
        }
      this.apiService.updateUom(putObj).subscribe(d => {
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
