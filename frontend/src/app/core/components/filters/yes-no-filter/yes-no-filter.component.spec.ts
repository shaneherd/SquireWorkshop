import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoFilterComponent } from './yes-no-filter.component';

xdescribe('YesNoFilterComponent', () => {
  let component: YesNoFilterComponent;
  let fixture: ComponentFixture<YesNoFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YesNoFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
