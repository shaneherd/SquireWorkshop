import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LevelListComponent} from './level-list.component';

xdescribe('LevelListComponent', () => {
  let component: LevelListComponent;
  let fixture: ComponentFixture<LevelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
