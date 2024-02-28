import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterSettings} from '../../../../shared/models/creatures/characters/character-settings';
import {EVENTS} from '../../../../constants';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EventsService} from '../../../../core/services/events.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CostUnit} from '../../../../shared/models/items/cost-unit';
import {CreatureWealthAmount} from '../../../../shared/models/creatures/creature-wealth-amount';
import {CreatureWealth} from '../../../../shared/models/creatures/creature-wealth';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import * as _ from 'lodash';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

export class CostUnitConfiguration {
  creatureWealthAmount: CreatureWealthAmount;
  costUnit: CostUnit;
  display: boolean;
}

@Component({
  selector: 'app-creature-wealth-configuration',
  templateUrl: './creature-wealth-configuration.component.html',
  styleUrls: ['./creature-wealth-configuration.component.scss']
})
export class CreatureWealthConfigurationComponent implements OnInit {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  playerCharacter: PlayerCharacter = null;
  settings = new CharacterSettings();
  costUnitConfigurations: CostUnitConfiguration[] = [];

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeConfigurations();
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      this.playerCharacter = this.creature as PlayerCharacter;
    }
  }

  private initializeConfigurations(): void {
    const configs: CostUnitConfiguration[] = [];
    this.creature.creatureWealth.amounts.forEach((creatureWealthAmount: CreatureWealthAmount) => {
      const config = new CostUnitConfiguration();
      config.creatureWealthAmount = creatureWealthAmount;
      config.costUnit = creatureWealthAmount.costUnit;
      config.display = creatureWealthAmount.display;
      configs.push(config);
    });
    this.costUnitConfigurations = configs;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.costUnitConfigurations, event.previousIndex, event.currentIndex);
  }

  displayChange(event: MatCheckboxChange, config: CostUnitConfiguration): void {
    config.display = event.checked;
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    const promises: Promise<any>[] = [];
    const updatedWealth = new CreatureWealth();
    updatedWealth.amounts = this.getUpdatedAmounts();
    promises.push(this.creatureService.updateCreatureWealth(this.creature, updatedWealth));

    if (this.playerCharacter != null) {
      const settings = _.cloneDeep(this.playerCharacter.characterSettings);
      settings.equipment = this.settings.equipment;
      promises.push(this.characterService.updateCharacterSettings(this.playerCharacter, settings).then(() => {
        this.playerCharacter.characterSettings.equipment = settings.equipment;
      }));
    }
    Promise.all(promises).then(() => {
      this.creature.creatureWealth = updatedWealth;
      this.eventsService.dispatchEvent(EVENTS.CarryingUpdated);
      this.save.emit();
    });
  }

  private getUpdatedAmounts(): CreatureWealthAmount[] {
    const amounts: CreatureWealthAmount[] = [];
    this.costUnitConfigurations.forEach((config: CostUnitConfiguration, index: number) => {
      const creatureWealthAmount = config.creatureWealthAmount;
      creatureWealthAmount.display = config.display;
      creatureWealthAmount.displayOrder = index;
      amounts.push(creatureWealthAmount);
    });
    return amounts;
  }

}
