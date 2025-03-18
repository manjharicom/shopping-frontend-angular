import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusViewComponent } from './menus-view.component';

describe('MenusViewComponent', () => {
  let component: MenusViewComponent;
  let fixture: ComponentFixture<MenusViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenusViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
