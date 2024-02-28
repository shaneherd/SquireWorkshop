import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickReferencesSlideInComponent } from './quick-references-slide-in.component';

xdescribe('QuickReferencesSlideInComponent', () => {
  let component: QuickReferencesSlideInComponent;
  let fixture: ComponentFixture<QuickReferencesSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickReferencesSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickReferencesSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
