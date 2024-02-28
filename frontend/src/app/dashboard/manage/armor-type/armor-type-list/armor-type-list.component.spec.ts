import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ArmorTypeListComponent} from './armor-type-list.component';

xdescribe('ArmorTypeListComponent', () => {
  let component: ArmorTypeListComponent;
  let fixture: ComponentFixture<ArmorTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmorTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmorTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
