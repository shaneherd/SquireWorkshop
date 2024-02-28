import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilitySaveDetailsComponent } from './ability-save-details.component';

xdescribe('AbilitySaveDetailsComponent', () => {
  let component: AbilitySaveDetailsComponent;
  let fixture: ComponentFixture<AbilitySaveDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilitySaveDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilitySaveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
