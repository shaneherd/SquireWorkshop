import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CreatureSpellSlot} from '../../../../../shared/models/creatures/creature-spell-slot';
import {CreatureSpell} from '../../../../../shared/models/creatures/creature-spell';
import {TranslateService} from '@ngx-translate/core';

export class PrintCharacterSpell {
  name: string;
  prepared: boolean;
}

@Component({
  selector: 'app-print-character-spells-section',
  templateUrl: './print-character-spells-section.component.html',
  styleUrls: ['./print-character-spells-section.component.scss']
})
export class PrintCharacterSpellsSectionComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() level: number;
  @Input() numSpells: number;
  @Input() showPrepared = true;

  label = '';
  slots: boolean[] = [];
  spells: PrintCharacterSpell[] = [];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.level === 0) {
      this.label = this.translate.instant('Headers.Cantrips')
    } else {
      this.label = this.translate.instant('Level', {level: this.level});
    }
    this.initializeSlots();
    this.initializeSpells();
  }

  private initializeSlots(): void {
    this.slots = [];
    const creatureSpellSlot = this.getCreatureSpellSlots();
    if (creatureSpellSlot != null) {
      let max = creatureSpellSlot.calculatedMax + creatureSpellSlot.maxModifier;
      const amountUsed = max - creatureSpellSlot.remaining;
      if (max > 10) {
        max = 10;
      }
      for (let i = 0; i < max; i++) {
        const used = i + 1 <= amountUsed;
        this.slots.push(used);
      }
    }
  }

  private getCreatureSpellSlots(): CreatureSpellSlot {
    for (let i = 0; i < this.playerCharacter.creatureSpellCasting.spellSlots.length; i++) {
      const current = this.playerCharacter.creatureSpellCasting.spellSlots[i];
      if (current.level === this.level) {
        return current;
      }
    }
    return null;
  }

  private initializeSpells(): void {
    this.spells = [];
    this.playerCharacter.creatureSpellCasting.spells.forEach((creatureSpell: CreatureSpell) => {
      if (creatureSpell.spell.level === this.level) {
        const display = new PrintCharacterSpell();
        display.name = creatureSpell.spell.name;
        display.prepared = creatureSpell.prepared;
        this.spells.push(display);
      }
    });

    if (this.spells.length > this.numSpells) {
      const extraItems = this.spells.length - this.numSpells;
      this.spells.splice(this.numSpells, extraItems);
    } else if (this.spells.length < this.numSpells) {
      const current = this.spells.length;
      for (let i = current; i < this.numSpells; i++) {
        this.spells.push(new PrintCharacterSpell());
      }
    }
  }
}
