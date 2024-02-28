import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFeatureUseRegainComponent } from './character-feature-use-regain.component';

describe('CharacterFeatureUseRegainComponent', () => {
  let component: CharacterFeatureUseRegainComponent;
  let fixture: ComponentFixture<CharacterFeatureUseRegainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterFeatureUseRegainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterFeatureUseRegainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
