import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveLanguageComponent} from './add-remove-language.component';

xdescribe('AddRemoveLanguageComponent', () => {
  let component: AddRemoveLanguageComponent;
  let fixture: ComponentFixture<AddRemoveLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
