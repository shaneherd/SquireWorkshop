import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectorSlideInComponent } from './image-selector-slide-in.component';

xdescribe('ImageSelectorSlideInComponent', () => {
  let component: ImageSelectorSlideInComponent;
  let fixture: ComponentFixture<ImageSelectorSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectorSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectorSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
