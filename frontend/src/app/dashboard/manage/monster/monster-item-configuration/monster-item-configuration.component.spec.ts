import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterItemConfigurationComponent} from './monster-item-configuration.component';

xdescribe('MonsterItemConfigurationComponent', () => {
  let component: MonsterItemConfigurationComponent;
  let fixture: ComponentFixture<MonsterItemConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterItemConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterItemConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
