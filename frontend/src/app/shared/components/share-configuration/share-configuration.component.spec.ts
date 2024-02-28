import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShareConfigurationComponent} from './share-configuration.component';

xdescribe('ShareConfigurationComponent', () => {
  let component: ShareConfigurationComponent;
  let fixture: ComponentFixture<ShareConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
