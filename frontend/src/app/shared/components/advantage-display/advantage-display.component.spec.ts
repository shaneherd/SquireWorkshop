import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdvantageDisplayComponent} from './advantage-display.component';

xdescribe('AdvantageDisplayComponent', () => {
  let component: AdvantageDisplayComponent;
  let fixture: ComponentFixture<AdvantageDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvantageDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvantageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
