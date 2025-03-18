import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UomsComponent } from './uoms.component';

describe('UomsComponent', () => {
  let component: UomsComponent;
  let fixture: ComponentFixture<UomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UomsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
