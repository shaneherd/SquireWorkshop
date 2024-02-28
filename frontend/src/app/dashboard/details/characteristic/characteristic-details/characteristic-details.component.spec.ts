import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacteristicDetailsComponent } from './characteristic-details.component';

xdescribe('CharacteristicDetailsComponent', () => {
  let component: CharacteristicDetailsComponent;
  let fixture: ComponentFixture<CharacteristicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacteristicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacteristicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
