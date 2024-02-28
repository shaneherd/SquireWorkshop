import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TreasureDetailsComponent} from './treasure-details.component';

xdescribe('TreasureDetailsComponent', () => {
  let component: TreasureDetailsComponent;
  let fixture: ComponentFixture<TreasureDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
