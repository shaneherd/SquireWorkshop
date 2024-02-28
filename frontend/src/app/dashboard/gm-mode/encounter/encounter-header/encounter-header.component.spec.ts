import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterHeaderComponent } from './encounter-header.component';

xdescribe('EncounterHeaderComponent', () => {
  let component: EncounterHeaderComponent;
  let fixture: ComponentFixture<EncounterHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
