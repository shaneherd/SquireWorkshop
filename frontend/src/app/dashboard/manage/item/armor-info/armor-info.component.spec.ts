import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ArmorInfoComponent} from './armor-info.component';

xdescribe('ArmorInfoComponent', () => {
  let component: ArmorInfoComponent;
  let fixture: ComponentFixture<ArmorInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmorInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
