import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListPricesComponent } from './shopping-list-prices.component';

describe('ShoppingListPricesComponent', () => {
  let component: ShoppingListPricesComponent;
  let fixture: ComponentFixture<ShoppingListPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingListPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingListPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
