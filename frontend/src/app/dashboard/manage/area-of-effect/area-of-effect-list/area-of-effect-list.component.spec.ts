import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AreaOfEffectListComponent} from './area-of-effect-list.component';

xdescribe('AreaOfEffectListComponent', () => {
  let component: AreaOfEffectListComponent;
  let fixture: ComponentFixture<AreaOfEffectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaOfEffectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaOfEffectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
