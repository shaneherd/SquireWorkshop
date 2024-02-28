import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilitySaveConfigurationDetailsComponent } from './ability-save-configuration-details.component';

xdescribe('AbilitySaveConfigurationDetailsComponent', () => {
  let component: AbilitySaveConfigurationDetailsComponent;
  let fixture: ComponentFixture<AbilitySaveConfigurationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilitySaveConfigurationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilitySaveConfigurationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
