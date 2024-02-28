import {Component} from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {Router} from '@angular/router';
import {SKIP_LOCATION_CHANGE} from '../../../constants';
import {CharacterService} from '../../../core/services/creatures/character.service';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent {
  characters: MenuItem[] = [];
  loading = false;

  constructor(
    public characterService: CharacterService,
    private router: Router
  ) {
  }

  onMenuItemSelect(menuItem: MenuItem): void {
    this.router.navigate(['/home/dashboard',
      {outlets: {'left-nav': ['characters']}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
  }
}
