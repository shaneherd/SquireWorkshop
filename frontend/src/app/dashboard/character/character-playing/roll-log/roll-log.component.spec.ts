import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollLogComponent } from './roll-log.component';

xdescribe('RollLogComponent', () => {
  let component: RollLogComponent;
  let fixture: ComponentFixture<RollLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
