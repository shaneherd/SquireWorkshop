import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasterTypeDetailsComponent } from './caster-type-details.component';

xdescribe('CasterTypeDetailsComponent', () => {
  let component: CasterTypeDetailsComponent;
  let fixture: ComponentFixture<CasterTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasterTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasterTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
