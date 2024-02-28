import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagColorConfigurationComponent } from './tag-color-configuration.component';

xdescribe('TagColorConfigurationComponent', () => {
  let component: TagColorConfigurationComponent;
  let fixture: ComponentFixture<TagColorConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagColorConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagColorConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
