import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CasterTypeListComponent} from './caster-type-list.component';

xdescribe('CasterTypeListComponent', () => {
  let component: CasterTypeListComponent;
  let fixture: ComponentFixture<CasterTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasterTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasterTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
