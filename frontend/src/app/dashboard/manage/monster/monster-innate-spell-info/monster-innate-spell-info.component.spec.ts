import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterInnateSpellInfoComponent} from './monster-innate-spell-info.component';

xdescribe('MonsterInnateSpellInfoComponent', () => {
  let component: MonsterInnateSpellInfoComponent;
  let fixture: ComponentFixture<MonsterInnateSpellInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterInnateSpellInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterInnateSpellInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
