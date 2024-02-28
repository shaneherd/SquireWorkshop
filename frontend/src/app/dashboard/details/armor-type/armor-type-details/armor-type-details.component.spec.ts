import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmorTypeDetailsComponent } from './armor-type-details.component';

xdescribe('ArmorTypeDetailsComponent', () => {
  let component: ArmorTypeDetailsComponent;
  let fixture: ComponentFixture<ArmorTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmorTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmorTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
