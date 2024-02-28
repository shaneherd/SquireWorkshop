import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageTypeDetailsComponent } from './damage-type-details.component';

xdescribe('DamageTypeDetailsComponent', () => {
  let component: DamageTypeDetailsComponent;
  let fixture: ComponentFixture<DamageTypeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageTypeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
