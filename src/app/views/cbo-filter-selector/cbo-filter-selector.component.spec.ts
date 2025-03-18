import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CboFilterSelectorComponent } from './cbo-filter-selector.component';

describe('CboFilterSelectorComponent', () => {
  let component: CboFilterSelectorComponent;
  let fixture: ComponentFixture<CboFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CboFilterSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CboFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
