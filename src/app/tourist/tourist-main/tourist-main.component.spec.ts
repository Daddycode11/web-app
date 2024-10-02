import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristMainComponent } from './tourist-main.component';

describe('TouristMainComponent', () => {
  let component: TouristMainComponent;
  let fixture: ComponentFixture<TouristMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
