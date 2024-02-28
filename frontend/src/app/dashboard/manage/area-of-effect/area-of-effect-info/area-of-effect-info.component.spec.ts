import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AreaOfEffectInfoComponent} from './area-of-effect-info.component';

xdescribe('AreaOfEffectInfoComponent', () => {
  let component: AreaOfEffectInfoComponent;
  let fixture: ComponentFixture<AreaOfEffectInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaOfEffectInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaOfEffectInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
