import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeityManageComponent} from './deity-manage.component';

xdescribe('DeityManageComponent', () => {
  let component: DeityManageComponent;
  let fixture: ComponentFixture<DeityManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeityManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeityManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
