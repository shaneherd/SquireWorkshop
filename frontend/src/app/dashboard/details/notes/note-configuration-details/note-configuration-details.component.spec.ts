import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NoteConfigurationDetailsComponent} from './note-configuration-details.component';

xdescribe('NoteConfigurationDetailsComponent', () => {
  let component: NoteConfigurationDetailsComponent;
  let fixture: ComponentFixture<NoteConfigurationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteConfigurationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
