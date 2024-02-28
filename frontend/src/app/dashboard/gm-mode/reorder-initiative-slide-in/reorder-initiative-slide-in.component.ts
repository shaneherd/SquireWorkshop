import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Encounter} from '../../../shared/models/campaigns/encounters/encounter';
import * as _ from 'lodash';
import {EncounterMonsterGroup} from '../../../shared/models/campaigns/encounters/encounter-monster-group';
import {EncounterMonster} from '../../../shared/models/campaigns/encounters/encounter-monster';
import {EncounterCharacter} from '../../../shared/models/campaigns/encounters/encounter-character';
import {EncounterService} from '../../../core/services/encounter.service';
import {Campaign} from '../../../shared/models/campaigns/campaign';
import {
  EncounterCharacterConfiguration,
  EncounterMonsterGroupConfiguration,
  InitiativeOrderObject
} from '../../../shared/models/combat-row';

@Component({
  selector: 'app-reorder-initiative-slide-in',
  templateUrl: './reorder-initiative-slide-in.component.html',
  styleUrls: ['./reorder-initiative-slide-in.component.scss']
})
export class ReorderInitiativeSlideInComponent implements OnInit {
  @Input() encounter: Encounter;
  @Input() campaign: Campaign;
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();

  loading = false;
  initiativeOrder: InitiativeOrderObject[] = [];
  editingEncounter: Encounter = null;
  characters: EncounterCharacterConfiguration[] = [];
  groups: EncounterMonsterGroupConfiguration[] = [];

  constructor(
    private notificationService: NotificationService,
    private translate: TranslateService,
    private encounterService: EncounterService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.editingEncounter = _.cloneDeep(this.encounter);
    this.groups = this.initializeGroups(this.editingEncounter.encounterMonsterGroups);
    this.characters = this.getCharacters();
    this.initializeInitiativeOrder();
    this.loading = false;
  }

  private initializeGroups(groups: EncounterMonsterGroup[]): EncounterMonsterGroupConfiguration[] {
    const configs: EncounterMonsterGroupConfiguration[] = [];
    groups.forEach((group: EncounterMonsterGroup) => {
      const config = new EncounterMonsterGroupConfiguration(group);
      configs.push(config);

      config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
        if (encounterMonster.initiative !== 0) {
          encounterMonster.initiativeTooltip = `${encounterMonster.initiative - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
        }
      });
    });
    return configs;
  }

  private getCharacters(): EncounterCharacterConfiguration[] {
    const characters: EncounterCharacterConfiguration[] = [];
    this.editingEncounter.encounterCharacters.forEach((encounterCharacter: EncounterCharacter) => {
      const config = new EncounterCharacterConfiguration();
      config.encounterCharacter = encounterCharacter;
      this.encounterService.initializeEncounterCharacterConfiguration(config);
      characters.push(config);
    });

    return characters;
  }

  private initializeInitiativeOrder(): void {
    this.initiativeOrder = [];
    this.characters.forEach((character: EncounterCharacterConfiguration) => {
      if (character.selected) {
        this.encounterService.addCharacterToInitiative(character, this.initiativeOrder);
      }
    });

    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      this.encounterService.addGroupToInitiative(config, this.initiativeOrder, -1);
    });

    this.encounterService.initialSortInitiative(this.initiativeOrder);
    this.encounterService.updateCurrentTurn(this.initiativeOrder, this.editingEncounter.currentTurn);
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  sortClick(): void {
    this.editingEncounter.customSort = false;
    this.encounterService.sortInitiative(this.initiativeOrder, this.campaign.settings.initiative.natural20First);
    this.encounterService.updateInitOrder(this.initiativeOrder);
  }

  saveClick(): void {
    this.loading = true;
    this.editingEncounter.encounterMonsterGroups = this.encounterService.getEncounterMonsterGroups(this.groups);
    this.editingEncounter.encounterCharacters = this.encounterService.getEncounterCharacters(this.characters);
    this.encounterService.updateInitOrder(this.initiativeOrder);
    this.encounterService.updateEncounter(this.editingEncounter).then(() => {
      this.loading = false;
      this.encounter.encounterMonsterGroups = this.editingEncounter.encounterMonsterGroups;
      this.encounter.encounterCharacters = this.editingEncounter.encounterCharacters;
      this.encounter.customSort = this.editingEncounter.customSort;
      this.save.emit();
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Save.Error'));
    });
  }

  drop(event: CdkDragDrop<InitiativeOrderObject[]>) {
    if (event.previousIndex !== event.currentIndex) {
      const previous = this.encounterService.getTrueInitiativeIndex(this.initiativeOrder, event.previousIndex);
      const current = this.encounterService.getTrueInitiativeIndex(this.initiativeOrder, event.currentIndex);
      moveItemInArray(this.initiativeOrder, previous, current);
      this.editingEncounter.customSort = true;
      this.encounterService.updateInitOrder(this.initiativeOrder);
    }
  }
}
