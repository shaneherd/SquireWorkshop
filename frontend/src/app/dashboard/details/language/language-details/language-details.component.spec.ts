import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDetailsComponent } from './language-details.component';

xdescribe('LanguageDetailsComponent', () => {
  let component: LanguageDetailsComponent;
  let fixture: ComponentFixture<LanguageDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
