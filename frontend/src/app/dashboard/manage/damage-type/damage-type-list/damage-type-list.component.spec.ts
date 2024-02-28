import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DamageTypeListComponent} from './damage-type-list.component';

xdescribe('DamageTypeListComponent', () => {
  let component: DamageTypeListComponent;
  let fixture: ComponentFixture<DamageTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DamageTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
