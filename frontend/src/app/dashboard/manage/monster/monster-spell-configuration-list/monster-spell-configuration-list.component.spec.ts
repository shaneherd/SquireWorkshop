import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterSpellConfigurationListComponent} from './monster-spell-configuration-list.component';

xdescribe('MonsterSpellConfigurationListComponent', () => {
  let component: MonsterSpellConfigurationListComponent;
  let fixture: ComponentFixture<MonsterSpellConfigurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterSpellConfigurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterSpellConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
