import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CasterTypeInfoComponent} from './caster-type-info.component';

xdescribe('CasterTypeInfoComponent', () => {
  let component: CasterTypeInfoComponent;
  let fixture: ComponentFixture<CasterTypeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasterTypeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasterTypeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
