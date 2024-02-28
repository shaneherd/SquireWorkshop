import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CursedTagComponent} from './cursed-tag.component';

xdescribe('CursedTagComponent', () => {
  let component: CursedTagComponent;
  let fixture: ComponentFixture<CursedTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CursedTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CursedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
