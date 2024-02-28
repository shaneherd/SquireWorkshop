import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagColorConfigurationSlideInComponent } from './tag-color-configuration-slide-in.component';

xdescribe('TagColorConfigurationSlideInComponent', () => {
  let component: TagColorConfigurationSlideInComponent;
  let fixture: ComponentFixture<TagColorConfigurationSlideInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagColorConfigurationSlideInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagColorConfigurationSlideInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
