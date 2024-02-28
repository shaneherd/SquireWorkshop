import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatureWealthConfigurationComponent } from './creature-wealth-configuration.component';

xdescribe('CharacterWealthConfigurationComponent', () => {
  let component: CreatureWealthConfigurationComponent;
  let fixture: ComponentFixture<CreatureWealthConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatureWealthConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatureWealthConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
