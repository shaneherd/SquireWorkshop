import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterColumnComponent } from './encounter-column.component';

xdescribe('EncounterColumnComponent', () => {
  let component: EncounterColumnComponent;
  let fixture: ComponentFixture<EncounterColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncounterColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncounterColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
