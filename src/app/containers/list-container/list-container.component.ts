import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ListItem } from './list-types/list-item';
import { ProductModel } from '../../shared/models/product.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxBootstrapModalComponent } from '../../shared/components/ngx-bootstrap-modal/ngx-bootstrap-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss']
})
export class ListContainerComponent implements OnChanges {
  @Input() listTitle?: string;
  @Input() listItems?: ListItem[];
  @Input() showViewBtn: boolean = true;
  @Input() showEditBtn: boolean = true;
  @Input() showStopBtn: boolean = true;
  @Input() isLoading: boolean = false;
  @Input() getStatusClassFn!: (status: string) => string;

  @Output() onAddClick: EventEmitter<any> = new EventEmitter();
  @Output() onRemoveClick: EventEmitter<any> = new EventEmitter();
  @Output() onAddProductClick: EventEmitter<any> = new EventEmitter();

  constructor(private toastr: ToastrService,
    protected listModelService: BsModalService){}

  ngOnChanges(changes: SimpleChanges): void {}
  onAddBtnClick(item: any) {
    this.onAddClick.emit(item);
  }

  onRemoveBtnClick(item: any) {
    this.onRemoveClick.emit(item);
  }

  onAddProductBtnClick(item: any) {
    this.onAddProductClick.emit(item);
  }

  onRowHeaderClick(item: ListItem) {
    if (item.SubItems !== null) {
      item.isSubItemExpanded = !item.isSubItemExpanded;

      var certDashboardExpansion = localStorage.getItem(
        'certificate_dashboard'
      );
      var headers;
      if (certDashboardExpansion) {
        headers = JSON.parse(certDashboardExpansion);
        var existingItem = headers.find((x:any) => x == item.Id);
        if (existingItem == undefined && item.isSubItemExpanded) {
          headers.push(item.Id);
        }

        if (existingItem && !item.isSubItemExpanded) {
          var index = headers.indexOf(item.Id);
          headers.splice(index, 1);
        }
      } else if (item.isSubItemExpanded) {
        headers = [item.Id];
      }

      localStorage.setItem('certificate_dashboard', JSON.stringify(headers));
    }
  }

  openListModal(product: ProductModel) {
    const modalRef = this.listModelService.show(NgxBootstrapModalComponent, Object.assign({}, { class: 'gray modal-lg' }));
    modalRef.content.product = product;
    modalRef.content.modalRef = modalRef;
    modalRef.content.added.subscribe((p:any) => {
      this.handleAdded(p);
    });
  }

  handleAdded(e:any){
    this.toastr.success('Product "' + e.product + '" Successfully Added to Shopping List "' + e.name + '"');
    this.onAddProductClick.emit(e);
  }

}
