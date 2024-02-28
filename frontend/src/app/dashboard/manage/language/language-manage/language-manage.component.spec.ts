import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageManageComponent} from './language-manage.component';

xdescribe('LanguageManageComponent', () => {
  let component: LanguageManageComponent;
  let fixture: ComponentFixture<LanguageManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
