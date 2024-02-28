import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCharacterDetailsComponent } from './player-character-details.component';

xdescribe('PlayerCharacterDetailsComponent', () => {
  let component: PlayerCharacterDetailsComponent;
  let fixture: ComponentFixture<PlayerCharacterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerCharacterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerCharacterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
