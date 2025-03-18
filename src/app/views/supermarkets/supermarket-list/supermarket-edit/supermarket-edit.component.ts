import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule   } from '@angular/forms';
import { SupermarketApiService } from '../../../../shared/services/supermarket-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewItemModel } from 'src/app/shared/models/new-item.model';
import { EditItemModel } from 'src/app/shared/models/edit-item.model';

@Component({
  selector: 'app-supermarket-edit',
  templateUrl: './supermarket-edit.component.html',
  styleUrls: ['./supermarket-edit.component.scss']
})
export class SupermarketEditComponent implements OnInit {
  superMarketForm!: FormGroup;
  routeParamsSub!: Subscription;
  mode!: string;
  superMarketId?:number;

  constructor(
    private apiService: SupermarketApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
      this.loadSuperMarket();
      this.superMarketForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
      });
    }
  
  get name(){
    return this.superMarketForm.get('name');
  }

  private loadSuperMarket(){
    this.routeParamsSub = this.route.params.subscribe((r) => {
      var id = r['id'];
      if (id == undefined){
        this.mode='new';
      }
      else{
        this.mode='edit';
        this.superMarketId = JSON.parse(id);
        this.apiService.getSuperMarket(id).subscribe(c => {
          this.superMarketForm.patchValue({
            name: c.name
          });
        });
      }
    });
  }

  submit(){
    if(this.mode == "new"){
      const newsuperMarket:NewItemModel = {
        name: this.name?.value
      };
      this.apiService.addSuperMarket(newsuperMarket).subscribe(d => {
        this.showToastrMessage(d.responseCode, d.responseMessage);
      });
    }else{
      const editProduct:EditItemModel = {
        id: this.superMarketId,
        name: this.name?.value,
      };
      this.apiService.updateSuperMarket(editProduct).subscribe(d => {
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
