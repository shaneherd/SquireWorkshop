import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsEquippableConfigurationComponent } from './is-equippable-configuration.component';

xdescribe('IsEquippableConfigurationComponent', () => {
  let component: IsEquippableConfigurationComponent;
  let fixture: ComponentFixture<IsEquippableConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsEquippableConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsEquippableConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
