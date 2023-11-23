import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLeftSvgMaskComponent } from './car-left-svg-mask.component';

describe('CarLeftSvgMaskComponent', () => {
  let component: CarLeftSvgMaskComponent;
  let fixture: ComponentFixture<CarLeftSvgMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarLeftSvgMaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarLeftSvgMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
