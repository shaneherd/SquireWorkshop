import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeathSaveResultsComponent} from './death-save-results.component';

xdescribe('DeathSaveResultsComponent', () => {
  let component: DeathSaveResultsComponent;
  let fixture: ComponentFixture<DeathSaveResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeathSaveResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeathSaveResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
