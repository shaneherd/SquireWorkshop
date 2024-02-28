import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEditBasicInfoComponent } from './character-edit-basic-info.component';

xdescribe('CharacterEditBasicInfoComponent', () => {
  let component: CharacterEditBasicInfoComponent;
  let fixture: ComponentFixture<CharacterEditBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterEditBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterEditBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
