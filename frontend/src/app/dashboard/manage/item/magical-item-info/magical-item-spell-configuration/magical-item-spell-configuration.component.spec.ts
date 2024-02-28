import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MagicalItemSpellConfigurationComponent} from './magical-item-spell-configuration.component';

xdescribe('MagicalItemSpellConfigurationComponent', () => {
  let component: MagicalItemSpellConfigurationComponent;
  let fixture: ComponentFixture<MagicalItemSpellConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicalItemSpellConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicalItemSpellConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
