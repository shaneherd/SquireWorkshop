import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollResultDetailsComponent } from './roll-result-details.component';

xdescribe('RollResultDetailsComponent', () => {
  let component: RollResultDetailsComponent;
  let fixture: ComponentFixture<RollResultDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollResultDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollResultDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
