import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeMenuModalComponent } from './add-recipe-menu-modal.component';

describe('AddRecipeMenuModalComponent', () => {
  let component: AddRecipeMenuModalComponent;
  let fixture: ComponentFixture<AddRecipeMenuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRecipeMenuModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecipeMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
