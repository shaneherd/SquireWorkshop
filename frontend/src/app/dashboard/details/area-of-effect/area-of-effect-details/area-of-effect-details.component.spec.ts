import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaOfEffectDetailsComponent } from './area-of-effect-details.component';

xdescribe('AreaOfEffectDetailsComponent', () => {
  let component: AreaOfEffectDetailsComponent;
  let fixture: ComponentFixture<AreaOfEffectDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaOfEffectDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaOfEffectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
