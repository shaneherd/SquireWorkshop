import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SpellConfigurationListComponent} from './spell-configuration-list.component';

xdescribe('SpellConfigurationListComponent', () => {
  let component: SpellConfigurationListComponent;
  let fixture: ComponentFixture<SpellConfigurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpellConfigurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellConfigurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
