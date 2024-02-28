import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProficiencyListComponent} from './proficiency-list.component';

xdescribe('ProficiencyListComponent', () => {
  let component: ProficiencyListComponent;
  let fixture: ComponentFixture<ProficiencyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProficiencyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProficiencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
