import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageConfigurationComponent } from './damage-configuration.component';

xdescribe('DamageConfigurationComponent', () => {
  let component: DamageConfigurationComponent;
  let fixture: ComponentFixture<DamageConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
