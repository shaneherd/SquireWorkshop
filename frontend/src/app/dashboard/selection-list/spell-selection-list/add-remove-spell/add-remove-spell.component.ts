import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {PowerService} from '../../../../core/services/powers/power.service';
import {SpellMenuItem} from '../spell-selection-list.component';
import {Spell} from '../../../../shared/models/powers/spell';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-add-remove-spell',
  templateUrl: './add-remove-spell.component.html',
  styleUrls: ['./add-remove-spell.component.scss']
})
export class AddRemoveSpellComponent implements OnInit {
  @Input() spell: SpellMenuItem;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingSpell: Spell = null;

  constructor(
    private powerService: PowerService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.powerService.getPower(this.spell.spell.id).then((spell: Spell) => {
      this.viewingSpell = spell;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.spell);
  }
}
