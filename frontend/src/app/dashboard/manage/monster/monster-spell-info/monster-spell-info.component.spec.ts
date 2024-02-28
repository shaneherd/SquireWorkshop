import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MonsterSpellInfoComponent} from './monster-spell-info.component';

xdescribe('MonsterSpellInfoComponent', () => {
  let component: MonsterSpellInfoComponent;
  let fixture: ComponentFixture<MonsterSpellInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonsterSpellInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonsterSpellInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
