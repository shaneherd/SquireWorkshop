import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpellInfoComponent} from './spell-info.component';

xdescribe('SpellInfoComponent', () => {
  let component: SpellInfoComponent;
  let fixture: ComponentFixture<SpellInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
