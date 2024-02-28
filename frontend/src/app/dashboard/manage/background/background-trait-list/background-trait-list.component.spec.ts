import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BackgroundTraitListComponent} from './background-trait-list.component';

xdescribe('BackgroundTraitListComponent', () => {
  let component: BackgroundTraitListComponent;
  let fixture: ComponentFixture<BackgroundTraitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundTraitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundTraitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
