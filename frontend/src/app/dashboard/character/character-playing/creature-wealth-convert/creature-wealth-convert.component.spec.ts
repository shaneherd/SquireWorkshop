import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureWealthConvertComponent } from './creature-wealth-convert.component';

xdescribe('CharacterWealthConvertComponent', () => {
  let component: CreatureWealthConvertComponent;
  let fixture: ComponentFixture<CreatureWealthConvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureWealthConvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureWealthConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
