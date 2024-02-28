import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellDetailsSlideInComponent } from './spell-details-slide-in.component';

xdescribe('SpellDetailsSlideInComponent', () => {
  let component: SpellDetailsSlideInComponent;
  let fixture: ComponentFixture<SpellDetailsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellDetailsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellDetailsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
