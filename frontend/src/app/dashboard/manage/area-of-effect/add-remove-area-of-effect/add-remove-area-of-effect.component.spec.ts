import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveAreaOfEffectComponent} from './add-remove-area-of-effect.component';

xdescribe('AddRemoveAreaOfEffectComponent', () => {
  let component: AddRemoveAreaOfEffectComponent;
  let fixture: ComponentFixture<AddRemoveAreaOfEffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveAreaOfEffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveAreaOfEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
