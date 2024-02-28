import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TreasureInfoComponent} from './treasure-info.component';

xdescribe('TreasureInfoComponent', () => {
  let component: TreasureInfoComponent;
  let fixture: ComponentFixture<TreasureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreasureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreasureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
