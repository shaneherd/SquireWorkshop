import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellDetailsComponent } from './spell-details.component';

xdescribe('SpellDetailsComponent', () => {
  let component: SpellDetailsComponent;
  let fixture: ComponentFixture<SpellDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
