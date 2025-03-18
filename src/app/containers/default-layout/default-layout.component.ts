import { Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;
  public currentYear: number = 2022;
  showModal: boolean = false;
  modalTitle: string | undefined;
  handleOnOk: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    document.body.classList.add('header-fixed');
    document.body.classList.add('sidebar-lg-show');
    // document.body.classList.add('sidebar-show');
    document.body.classList.add('sidebar-fixed');
    this.currentYear = new Date().getFullYear();

  }

  toggle() {
    if (window.innerWidth > 991.98) {
      document.body.classList.remove('sidebar-show');
      document.body.classList.toggle('sidebar-lg-show');
    } else {
      document.body.classList.toggle('sidebar-show');
    }
  }

  onOk() {
    if (this.handleOnOk) {
      this.handleOnOk();
    }
    this.showModal = false;
  }

  onCancel() {
    this.showModal = false;
  }

}
