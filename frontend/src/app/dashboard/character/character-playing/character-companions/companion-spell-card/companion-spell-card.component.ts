import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CreatureSpell} from '../../../../../shared/models/creatures/creature-spell';

@Component({
  selector: 'app-companion-spell-card',
  templateUrl: './companion-spell-card.component.html',
  styleUrls: ['./companion-spell-card.component.scss']
})
export class CompanionSpellCardComponent implements OnInit {
  @Input() spell: CreatureSpell;
  @Input() clickDisabled = false;
  @Input() highlightActive = false;
  @Input() highlightNonActive = false;
  @Input() canActivate = false;
  @Output() cardClick = new EventEmitter<CreatureSpell>();

  level = '';

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    const level = this.spell.activeLevel > 0 ? this.spell.activeLevel : this.spell.spell.level;
    this.level = level === 0 ?
      this.translate.instant('Cantrip') :
      level.toString(10);
  }

  spellClick(): void {
    this.cardClick.emit(this.spell);
  }

}
