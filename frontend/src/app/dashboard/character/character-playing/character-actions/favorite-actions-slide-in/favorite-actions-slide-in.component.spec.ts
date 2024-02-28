import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteActionsSlideInComponent } from './favorite-actions-slide-in.component';

xdescribe('FavoriteActionsSlideInComponent', () => {
  let component: FavoriteActionsSlideInComponent;
  let fixture: ComponentFixture<FavoriteActionsSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteActionsSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteActionsSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
