import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRacesComponent} from './add-races.component';

xdescribe('AddRacesComponent', () => {
  let component: AddRacesComponent;
  let fixture: ComponentFixture<AddRacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
