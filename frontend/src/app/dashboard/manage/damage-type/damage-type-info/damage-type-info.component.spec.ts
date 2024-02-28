import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DamageTypeInfoComponent} from './damage-type-info.component';

xdescribe('DamageTypeInfoComponent', () => {
  let component: DamageTypeInfoComponent;
  let fixture: ComponentFixture<DamageTypeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageTypeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageTypeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
