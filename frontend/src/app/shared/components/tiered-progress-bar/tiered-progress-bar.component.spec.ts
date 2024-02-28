import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TieredProgressBarComponent} from './tiered-progress-bar.component';

xdescribe('TieredProgressBarComponent', () => {
  let component: TieredProgressBarComponent;
  let fixture: ComponentFixture<TieredProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TieredProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TieredProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
