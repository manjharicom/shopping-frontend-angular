import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UomModel } from 'src/app/shared/models/uom.model';
import { UomsapiService } from 'src/app/shared/services/uomsapi.service';

@Component({
  selector: 'app-uoms',
  templateUrl: './uoms.component.html',
  styleUrls: ['./uoms.component.scss']
})
export class UomsComponent implements OnInit {
  constructor(
    private apiService: UomsapiService,
    private toastr: ToastrService,
    private router: Router){}

  uoms: UomModel[] = [];

  
  ngOnInit(): void{
    this.loadUoms();
  }

  private loadUoms(query?: string){
    //console.log(query);
    this.apiService.getUoms(query).subscribe({
      next: u => {
        this.uoms = u;
      }
    });
  }
 
  onAdd(){
    this.router.navigate(['items/uoms/new']);
  }
  
  onEdit(uom:any){
    this.router.navigate(['items/uoms/edit/'+uom.uomId]);
  }
}
