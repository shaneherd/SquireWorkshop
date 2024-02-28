import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClassSpellInfoComponent} from './class-spell-info.component';

xdescribe('ClassSpellInfoComponent', () => {
  let component: ClassSpellInfoComponent;
  let fixture: ComponentFixture<ClassSpellInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSpellInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSpellInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
