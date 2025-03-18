import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketSetComponent } from './supermarket-set.component';

describe('SupermarketSetComponent', () => {
  let component: SupermarketSetComponent;
  let fixture: ComponentFixture<SupermarketSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupermarketSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupermarketSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
