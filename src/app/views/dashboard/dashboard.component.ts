import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  dashboardContent: string = '<p>Shopping List Manager is a work in progress.</p><p>You can expect to see some exciting changes as we continue to introduce new features and functionality.</p><p>Use menu items on the left to access features as they become available.</p>';
}
