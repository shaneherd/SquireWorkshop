import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpellManageComponent} from './spell-manage.component';

xdescribe('SpellManageComponent', () => {
  let component: SpellManageComponent;
  let fixture: ComponentFixture<SpellManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
