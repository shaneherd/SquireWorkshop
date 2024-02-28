import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbilityScoreDetailsComponent } from './ability-score-details.component';

xdescribe('AbilityScoreDetailsComponent', () => {
  let component: AbilityScoreDetailsComponent;
  let fixture: ComponentFixture<AbilityScoreDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbilityScoreDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbilityScoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
