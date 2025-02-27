import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesGraphsComponent } from './features-graphs.component';

describe('FeaturesGraphsComponent', () => {
  let component: FeaturesGraphsComponent;
  let fixture: ComponentFixture<FeaturesGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturesGraphsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
