import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModifierListComponent} from './modifier-list.component';

xdescribe('ModifierListComponent', () => {
  let component: ModifierListComponent;
  let fixture: ComponentFixture<ModifierListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifierListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
