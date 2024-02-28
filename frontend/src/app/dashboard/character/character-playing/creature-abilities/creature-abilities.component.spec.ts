import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureAbilitiesComponent } from './creature-abilities.component';

xdescribe('CharacterAbilitiesComponent', () => {
  let component: CreatureAbilitiesComponent;
  let fixture: ComponentFixture<CreatureAbilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureAbilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
