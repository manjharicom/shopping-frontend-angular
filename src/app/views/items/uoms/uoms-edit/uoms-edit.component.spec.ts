import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UomsEditComponent } from './uoms-edit.component';

describe('UomsEditComponent', () => {
  let component: UomsEditComponent;
  let fixture: ComponentFixture<UomsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UomsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UomsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
