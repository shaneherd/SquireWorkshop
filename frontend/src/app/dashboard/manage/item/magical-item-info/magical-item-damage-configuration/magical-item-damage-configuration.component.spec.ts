import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemDamageConfigurationComponent} from './magical-item-damage-configuration.component';

xdescribe('MagicalItemDamageConfigurationComponent', () => {
  let component: MagicalItemDamageConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemDamageConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemDamageConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemDamageConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
