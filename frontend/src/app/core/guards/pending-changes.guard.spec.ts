import {inject, TestBed} from '@angular/core/testing';

import {PendingChangesGuard} from './pending-changes.guard';

xdescribe('PendingChangesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PendingChangesGuard]
    });
  });

  it('should ...', inject([PendingChangesGuard], (guard: PendingChangesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
