import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusEditComponent } from './menus-edit.component';

describe('MenusEditComponent', () => {
  let component: MenusEditComponent;
  let fixture: ComponentFixture<MenusEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenusEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
