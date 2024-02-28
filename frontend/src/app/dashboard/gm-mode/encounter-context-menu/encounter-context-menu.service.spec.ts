import { TestBed } from '@angular/core/testing';

import { EncounterContextMenuService } from './encounter-context-menu.service';

xdescribe('EncounterContextMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncounterContextMenuService = TestBed.get(EncounterContextMenuService);
    expect(service).toBeTruthy();
  });
});
