import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import * as _ from 'lodash';
import {ImportBackgroundDetail} from '../../../../shared/imports/import-item';

@Component({
  selector: 'app-player-character-details',
  templateUrl: './player-character-details.component.html',
  styleUrls: ['./player-character-details.component.scss']
})
export class PlayerCharacterDetailsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;

  spells: CreatureSpell[] = [];
  equipment: CreatureItem[] = [];

  constructor() { }

  ngOnInit() {
    this.initializeSpells();
    this.initializeEquipment();
  }

  private initializeSpells(): void {
    const spells = _.uniqBy(this.playerCharacter.creatureSpellCasting.spells, (creatureSpell: CreatureSpell) => { return creatureSpell.spell.name });
    this.spells = _.sortBy(spells, creatureSpell => creatureSpell.spell.name)
  }

  private initializeEquipment(): void {
    const items = this.getItemsFlatList(this.playerCharacter.items);
    const equipment = _.uniqBy(items, (creatureItem: CreatureItem) => { return creatureItem.item.name });
    this.equipment = _.sortBy(equipment, creatureItem => creatureItem.item.name);
  }

  private getItemsFlatList(list: CreatureItem[]): CreatureItem[] {
    let flatList: CreatureItem[] = [];
    list.forEach((item: CreatureItem) => {
      flatList.push(item);
      if (item.items.length > 0) {
        flatList = flatList.concat(this.getItemsFlatList(item.items));
      }
    });
    return flatList;
  }

}
