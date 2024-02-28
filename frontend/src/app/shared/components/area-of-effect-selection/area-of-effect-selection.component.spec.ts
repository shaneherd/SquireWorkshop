import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaOfEffectSelectionComponent } from './area-of-effect-selection.component';

xdescribe('AreaOfEffectSelectionComponent', () => {
  let component: AreaOfEffectSelectionComponent;
  let fixture: ComponentFixture<AreaOfEffectSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaOfEffectSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaOfEffectSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
