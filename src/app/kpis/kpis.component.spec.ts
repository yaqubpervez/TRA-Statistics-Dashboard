import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KPIsComponent } from './kpis.component';

describe('KPIsComponent', () => {
  let component: KPIsComponent;
  let fixture: ComponentFixture<KPIsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KPIsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KPIsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
