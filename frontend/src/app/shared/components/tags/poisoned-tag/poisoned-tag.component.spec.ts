import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PoisonedTagComponent} from './poisoned-tag.component';

xdescribe('PoisonedTagComponent', () => {
  let component: PoisonedTagComponent;
  let fixture: ComponentFixture<PoisonedTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoisonedTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoisonedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
