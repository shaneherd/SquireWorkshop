import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterContextMenuComponent } from './encounter-context-menu.component';

xdescribe('EncounterContextMenuComponent', () => {
  let component: EncounterContextMenuComponent;
  let fixture: ComponentFixture<EncounterContextMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterContextMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
