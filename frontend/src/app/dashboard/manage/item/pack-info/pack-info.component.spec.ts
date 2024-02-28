import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PackInfoComponent} from './pack-info.component';

xdescribe('PackInfoComponent', () => {
  let component: PackInfoComponent;
  let fixture: ComponentFixture<PackInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
