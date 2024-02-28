import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LevelDetailsComponent} from './level-details.component';

xdescribe('LevelDetailsComponent', () => {
  let component: LevelDetailsComponent;
  let fixture: ComponentFixture<LevelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
