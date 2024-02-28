import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageInfoComponent} from './language-info.component';

xdescribe('LanguageInfoComponent', () => {
  let component: LanguageInfoComponent;
  let fixture: ComponentFixture<LanguageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
