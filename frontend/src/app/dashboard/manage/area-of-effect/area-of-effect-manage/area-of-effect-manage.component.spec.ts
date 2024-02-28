import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AreaOfEffectManageComponent} from './area-of-effect-manage.component';

xdescribe('AreaOfEffectManageComponent', () => {
  let component: AreaOfEffectManageComponent;
  let fixture: ComponentFixture<AreaOfEffectManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaOfEffectManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaOfEffectManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
