import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {Creature} from '../../../../shared/models/creatures/creature';

export class CharacterProficiencyDisplay {
  name: string;
  children: string[] = [];
}

@Component({
  selector: 'app-creature-proficiencies',
  templateUrl: './creature-proficiencies.component.html',
  styleUrls: ['./creature-proficiencies.component.scss']
})
export class CreatureProficienciesComponent implements OnInit {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;

  armorProfs: CharacterProficiencyDisplay[] = [];
  weaponProfs: CharacterProficiencyDisplay[] = [];
  toolProfs: string[] = [];
  languageProfs: string[] = [];

  constructor(
  ) { }

  ngOnInit() {
    this.armorProfs = this.getCharacterProficiencyDisplay(this.collection.proficiencyCollection.armorProficiencies);
    this.weaponProfs = this.getCharacterProficiencyDisplay(this.collection.proficiencyCollection.weaponProficiencies);
    this.toolProfs = this.getChildlessProfs(this.collection.proficiencyCollection.toolProficiencies, true);
    this.languageProfs = this.getChildlessProfs(this.collection.proficiencyCollection.languageProficiencies, false);
  }

  private getCharacterProficiencyDisplay(collection: CreatureListProficiency[]): CharacterProficiencyDisplay[] {
    const list: CharacterProficiencyDisplay[] = [];
    collection.forEach((prof: CreatureListProficiency) => {
      const display = new CharacterProficiencyDisplay();
      display.name = prof.item.name;
      display.children = this.getProfs(prof);
      list.push(display);
    });
    return list;
  }

  private getProfs(prof: CreatureListProficiency): string[] {
    const profs: string[] = [];
    if (this.isProficient(prof)) {
      prof.childrenProficiencies.forEach((child: CreatureListProficiency) => {
        profs.push(child.item.name);
      });
    } else {
      prof.childrenProficiencies.forEach((child: CreatureListProficiency) => {
        if (this.isProficient(child)) {
          profs.push(child.item.name);
        }
      });
    }
    return profs;
  }

  private getChildlessProfs(collection: CreatureListProficiency[], nested: boolean): string[] {
    const profs: string[] = [];
    collection.forEach((prof: CreatureListProficiency) => {
      if (nested) {
        prof.childrenProficiencies.forEach((childProf: CreatureListProficiency) => {
          if (this.isProficient(childProf)) {
            profs.push(childProf.item.name);
          }
        });
      } else {
        if (this.isProficient(prof)) {
          profs.push(prof.item.name);
        }
      }
    });
    return profs;
  }

  private isProficient(prof: CreatureListProficiency): boolean {
    return prof.proficient || prof.inheritedFrom.length > 0;
  }
}
