import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterActionConfigurationComponent} from './monster-action-configuration.component';

xdescribe('MonsterActionConfigurationComponent', () => {
  let component: MonsterActionConfigurationComponent;
  let fixture: ComponentFixture<MonsterActionConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterActionConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterActionConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
