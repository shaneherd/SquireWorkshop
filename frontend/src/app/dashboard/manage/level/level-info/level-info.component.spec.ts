import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LevelInfoComponent} from './level-info.component';

xdescribe('LevelInfoComponent', () => {
  let component: LevelInfoComponent;
  let fixture: ComponentFixture<LevelInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
