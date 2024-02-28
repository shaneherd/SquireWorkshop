import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CasterTypeManageComponent} from './caster-type-manage.component';

xdescribe('CasterTypeManageComponent', () => {
  let component: CasterTypeManageComponent;
  let fixture: ComponentFixture<CasterTypeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasterTypeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasterTypeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
