import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductRecipeModalComponent } from './add-product-recipe-modal.component';

describe('AddProductRecipeModalComponent', () => {
  let component: AddProductRecipeModalComponent;
  let fixture: ComponentFixture<AddProductRecipeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductRecipeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductRecipeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
