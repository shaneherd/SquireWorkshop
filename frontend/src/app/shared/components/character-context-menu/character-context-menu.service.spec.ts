import { TestBed } from '@angular/core/testing';

import { CharacterContextMenuService } from './character-context-menu.service';

xdescribe('CharacterContextMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharacterContextMenuService = TestBed.get(CharacterContextMenuService);
    expect(service).toBeTruthy();
  });
});
