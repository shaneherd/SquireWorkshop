import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LevelManageComponent} from './level-manage.component';

xdescribe('LevelManageComponent', () => {
  let component: LevelManageComponent;
  let fixture: ComponentFixture<LevelManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
