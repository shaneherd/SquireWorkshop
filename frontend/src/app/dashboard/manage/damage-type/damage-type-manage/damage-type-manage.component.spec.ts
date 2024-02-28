import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DamageTypeManageComponent} from './damage-type-manage.component';

xdescribe('DamageTypeManageComponent', () => {
  let component: DamageTypeManageComponent;
  let fixture: ComponentFixture<DamageTypeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageTypeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageTypeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
