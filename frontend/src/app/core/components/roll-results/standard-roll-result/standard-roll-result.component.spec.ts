import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardRollResultComponent } from './standard-roll-result.component';

xdescribe('StandardRollResultComponent', () => {
  let component: StandardRollResultComponent;
  let fixture: ComponentFixture<StandardRollResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardRollResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardRollResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
