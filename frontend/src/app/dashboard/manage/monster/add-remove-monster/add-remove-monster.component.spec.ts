import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRemoveMonsterComponent} from './add-remove-monster.component';

xdescribe('AddRemoveMonsterComponent', () => {
  let component: AddRemoveMonsterComponent;
  let fixture: ComponentFixture<AddRemoveMonsterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveMonsterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveMonsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
