import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupermarketMergeComponent } from './supermarket-merge.component';

describe('SupermarketMergeComponent', () => {
  let component: SupermarketMergeComponent;
  let fixture: ComponentFixture<SupermarketMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupermarketMergeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupermarketMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
