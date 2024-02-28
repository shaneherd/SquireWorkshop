import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AttackDamageDisplayComponent} from './attack-damage-display.component';

xdescribe('AttackDamageDisplayComponent', () => {
  let component: AttackDamageDisplayComponent;
  let fixture: ComponentFixture<AttackDamageDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttackDamageDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackDamageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
