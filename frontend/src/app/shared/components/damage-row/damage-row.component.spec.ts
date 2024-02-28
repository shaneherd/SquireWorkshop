import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DamageRowComponent} from './damage-row.component';

xdescribe('DamageRowComponent', () => {
  let component: DamageRowComponent;
  let fixture: ComponentFixture<DamageRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
