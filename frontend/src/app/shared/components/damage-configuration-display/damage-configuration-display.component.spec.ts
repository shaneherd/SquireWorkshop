import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageConfigurationDisplayComponent } from './damage-configuration-display.component';

xdescribe('DamageConfigurationDisplayComponent', () => {
  let component: DamageConfigurationDisplayComponent;
  let fixture: ComponentFixture<DamageConfigurationDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageConfigurationDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageConfigurationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
