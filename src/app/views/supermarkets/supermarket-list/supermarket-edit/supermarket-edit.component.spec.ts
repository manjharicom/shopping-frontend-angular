import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketEditComponent } from './supermarket-edit.component';

describe('SupermarketEditComponent', () => {
  let component: SupermarketEditComponent;
  let fixture: ComponentFixture<SupermarketEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupermarketEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupermarketEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
