import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveRaceComponent} from './add-remove-race.component';

xdescribe('AddRemoveRaceComponent', () => {
  let component: AddRemoveRaceComponent;
  let fixture: ComponentFixture<AddRemoveRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
