import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ArmorTypeInfoComponent} from './armor-type-info.component';

xdescribe('ArmorTypeInfoComponent', () => {
  let component: ArmorTypeInfoComponent;
  let fixture: ComponentFixture<ArmorTypeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmorTypeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmorTypeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
