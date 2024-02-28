import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ArmorTypeManageComponent} from './armor-type-manage.component';

describe('ArmorTypeManageComponent', () => {
  let component: ArmorTypeManageComponent;
  let fixture: ComponentFixture<ArmorTypeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmorTypeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmorTypeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
