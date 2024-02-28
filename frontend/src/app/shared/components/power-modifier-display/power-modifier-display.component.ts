import {Component, Input, OnInit} from '@angular/core';
import {CharacterLevel} from '../../models/character-level';
import {ModifierConfigurationCollection} from '../../models/modifier-configuration-collection';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {ListObject} from '../../models/list-object';
import {ModifierConfiguration} from '../../models/modifier-configuration';
import {ModifierService} from '../../../core/services/modifier.service';

@Component({
  selector: 'app-power-modifier-display',
  templateUrl: './power-modifier-display.component.html',
  styleUrls: ['./power-modifier-display.component.scss']
})
export class PowerModifierDisplayComponent implements OnInit {
  @Input() modifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();
  @Input() isSpell = false;
  @Input() baseLevel = 1;
  @Input() characterLevel: CharacterLevel = null;

  characterLevels: CharacterLevel[] = [];

  constructor(
    private characterLevelService: CharacterLevelService,
    private modifierService: ModifierService
  ) { }

  ngOnInit() {
    this.initializeLevels();
  }

  private initializeLevels(): void {
    this.characterLevels = [];
    this.characterLevelService.getLevelsDetailed().then((characterLevels: CharacterLevel[]) => {
      this.characterLevels = characterLevels;
    });
  }

  hasLevel(level: ListObject): boolean {
    for (let i = 0; i < this.modifierConfigurationCollection.advancementModifierConfigurations.length; i++) {
      const current = this.modifierConfigurationCollection.advancementModifierConfigurations[i];
      if (current.level.id === level.id) {
        return true;
      }
    }
    return false;
  }

  //todo - optimize this
  getName(modifierConfiguration: ModifierConfiguration): string {
    return this.modifierService.getConfigurationDisplayName(modifierConfiguration);
  }

}
