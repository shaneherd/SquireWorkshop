import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Encounter} from '../../../shared/models/campaigns/encounters/encounter';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {Campaign} from '../../../shared/models/campaigns/campaign';
import {EncounterMonsterGroup} from '../../../shared/models/campaigns/encounters/encounter-monster-group';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MonsterListItem} from '../../manage/monster/add-monsters/add-monsters.component';
import {EncounterMonster} from '../../../shared/models/campaigns/encounters/encounter-monster';
import {MonsterService} from '../../../core/services/creatures/monster.service';
import {MonsterSummary} from '../../../shared/models/creatures/monsters/monster-summary';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {EncounterService} from '../../../core/services/encounter.service';
import {NotificationService} from '../../../core/services/notification.service';
import {EncounterCharacter} from '../../../shared/models/campaigns/encounters/encounter-character';
import {CampaignCharacter} from '../../../shared/models/campaigns/campaign-character';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {UtilService} from '../../../core/services/util.service';
import {EditingEncounterMonsterGroup} from '../encounter-monster-group-configure-slide-in/encounter-monster-group-configure-slide-in.component';
import {EncounterSummary} from '../encounter-summary/encounter-summary.component';
import {ConfirmDialogData} from '../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';
import {Roll} from '../../../shared/models/rolls/roll';
import {DiceService} from '../../../core/services/dice.service';
import {GroupCheckType} from '../../../shared/models/group-check-type.enum';
import {
  EncounterCharacterConfiguration,
  EncounterMonsterGroupConfiguration,
  InitiativeOrderObject
} from '../../../shared/models/combat-row';

export const ENCOUNTER_MONSTER_USE_LOCAL_ROLL = true;

@Component({
  selector: 'app-encounter-configure-slide-in',
  templateUrl: './encounter-configure-slide-in.component.html',
  styleUrls: ['./encounter-configure-slide-in.component.scss']
})
export class EncounterConfigureSlideInComponent implements OnInit {
  @Input() encounter: Encounter;
  @Input() campaign: Campaign;
  @Input() active = false;
  @Input() slideLeft = true;
  @Input() showCharacters = true;
  @Input() initialPage = 0;
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter<string>();
  @Output() start = new EventEmitter();
  @Output() delete = new EventEmitter();

  loading = false;
  maxMonsters = 100;

  encounterStarted = false;
  step = 0;
  pageCount = 0;
  showEdit = false;
  showSetup = false;
  showInit = false;
  showConfirmInit = false;
  showSurprise = false;

  headerName = '';
  tertiaryLabel = '';
  editingEncounter: Encounter = new Encounter();
  clickDisabled = false;
  viewingGroup: EncounterMonsterGroupConfiguration = null;
  addingMonsters = false;

  characters: EncounterCharacterConfiguration[] = [];
  groups: EncounterMonsterGroupConfiguration[] = [];

  initiativeOrder: InitiativeOrderObject[] = [];
  debounceInterval = 500;
  debounceRefreshSort: () => void;
  debounceCharacterStealth: () => void;
  debounceMonsterStealth: () => void;
  quantityChangeDisabled = false;

  characterCount = 0;
  monsterCount = 0;

  encounterSummary: EncounterSummary = null;
  surpriseGroup: EncounterMonsterGroupConfiguration = null;
  monsterRolls: Roll[] = [];

  constructor(
    private translate: TranslateService,
    private monsterService: MonsterService,
    private encounterService: EncounterService,
    private notificationService: NotificationService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private diceService: DiceService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.groups = [];
    if (this.encounter == null) {
      this.editingEncounter = new Encounter();
      this.characters = this.getCharacters(true);
    } else {
      this.editingEncounter = _.cloneDeep(this.encounter);
      this.encounterStarted = this.editingEncounter.startedAt > 0;
      this.groups = this.initializeGroups(this.editingEncounter.encounterMonsterGroups);
      this.characters = this.getCharacters(false);
    }
    this.updateGroupInitiativeModifiers();
    this.updateGroupNumbers();
    this.initializeInitiativeOrder();
    this.initializeStealthRolls();

    this.debounceRefreshSort = this.utilService.debounce(() => {
      this.sortInitiative();
      this.updateInitOrder();
    }, this.debounceInterval);

    this.debounceCharacterStealth = this.utilService.debounce(() => {
      this.applyCharacterStealth();
    }, this.debounceInterval);

    this.debounceMonsterStealth = this.utilService.debounce(() => {
      this.applyMonsterStealth();
    }, this.debounceInterval);

    if (this.active) {
      this.pageCount = this.encounterStarted ? 3 : 4;
    } else {
      this.pageCount = this.encounterStarted ? 4 : 2;
    }

    this.setStep(this.initialPage);
    this.loading = false;
  }

  private initializeGroups(groups: EncounterMonsterGroup[]): EncounterMonsterGroupConfiguration[] {
    const configs: EncounterMonsterGroupConfiguration[] = [];
    groups.forEach((group: EncounterMonsterGroup) => {
      const config = new EncounterMonsterGroupConfiguration(group);
      config.disabled = this.encounterStarted && group.quantity > 0;
      configs.push(config);

      config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
        if (encounterMonster.initiative !== 0) {
          encounterMonster.initiativeTooltip = `${encounterMonster.initiative - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
        }
      });
    });
    return configs;
  }

  private getCharacters(defaultSelected: boolean): EncounterCharacterConfiguration[] {
    const characters: EncounterCharacterConfiguration[] = [];
    this.campaign.characters.forEach((campaignCharacter: CampaignCharacter) => {
      let character = this.getCurrentEncounterCharacter(campaignCharacter);
      const config = new EncounterCharacterConfiguration();
      config.selected = (character != null && !character.removed) || defaultSelected;
      if (character == null) {
        character = new EncounterCharacter();
        character.character = campaignCharacter;
        config.encounterCharacter = character;
        characters.push(config);
      } else {
        config.encounterCharacter = character;
        config.disabled = this.encounterStarted && !character.removed;
        characters.push(config);
      }
    });

    this.initializeCharacterInitiativeModifiers(characters);
    return characters;
  }

  private initializeCharacterInitiativeModifiers(characters: EncounterCharacterConfiguration[]): void {
    characters.forEach((character: EncounterCharacterConfiguration) => {
      this.encounterService.initializeEncounterCharacterConfiguration(character);
    });
  }

  private getCurrentEncounterCharacter(campaignCharacter: CampaignCharacter): EncounterCharacter {
    for (let i = 0; i < this.editingEncounter.encounterCharacters.length; i++) {
      const current = this.editingEncounter.encounterCharacters[i];
      if (current.character.id === campaignCharacter.id) {
        return current;
      }
    }
    return null;
  }

  private updateAllInitiatives(): void {
    this.initiativeOrder.forEach((init: InitiativeOrderObject) => {
      if (init.character != null) {
        init.initiative = init.character.encounterCharacter.initiative;
      } else if (init.monster != null) {
        init.initiative = init.monster.initiative;
      } else if (init.group != null) {
        init.display = init.group.group.quantity > 0;
        init.initiative = init.group.group.monsters.length > 0 ? init.group.group.monsters[0].initiative : 0;
      }
    });
  }

  private getCharacterInitiative(character: EncounterCharacterConfiguration): InitiativeOrderObject {
    const index = this.getCharacterInitiativeIndex(character);
    if (index > -1) {
      return this.initiativeOrder[index];
    }
  }

  private getCharacterInitiativeIndex(character: EncounterCharacterConfiguration): number {
    return _.findIndex(this.initiativeOrder, (init: InitiativeOrderObject) => {
      return init.character === character;
    });
  }

  private getGroupInitiative(config: EncounterMonsterGroupConfiguration): InitiativeOrderObject {
    const index = this.getGroupInitiativeIndex(config);
    if (index > -1) {
      return this.initiativeOrder[index];
    }
  }

  private getGroupInitiativeIndex(config: EncounterMonsterGroupConfiguration): number {
    return _.findIndex(this.initiativeOrder, (init: InitiativeOrderObject) => {
      return init.group === config && init.monster == null;
    });
  }

  private getMonsterInitiative(encounterMonster: EncounterMonster): InitiativeOrderObject {
    const index = this.getMonsterInitiativeIndex(encounterMonster);
    if (index > - 1) {
      return this.initiativeOrder[index];
    }
  }

  private getMonsterInitiativeIndex(monster: EncounterMonster): number {
    return _.findIndex(this.initiativeOrder, (init: InitiativeOrderObject) => {
      return init.monster === monster;
    });
  }

  private getMonsterInitiatives(config: EncounterMonsterGroupConfiguration): InitiativeOrderObject[] {
    const monsters: InitiativeOrderObject[] = [];
    this.initiativeOrder.forEach((init: InitiativeOrderObject) => {
      if (init.group === config) {
        monsters.push(init);
      }
    });

    monsters.sort((left: InitiativeOrderObject, right: InitiativeOrderObject) => {
      return left.monster.monsterNumber - right.monster.monsterNumber;
    });

    return monsters;
  }

  private initializeInitiativeOrder(): void {
    this.initiativeOrder = [];
    this.characters.forEach((character: EncounterCharacterConfiguration) => {
      if (character.selected) {
        this.addCharacterToInitiative(character);
      }
    });

    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      this.addGroupToInitiative(config, -1);
    });

    this.encounterService.initialSortInitiative(this.initiativeOrder);
    if (this.encounterStarted) {
      this.encounterService.updateCurrentTurn(this.initiativeOrder, this.editingEncounter.currentTurn);
    }
    this.updateCharacterCount(false);
    this.updateMonsterCount(false);
    this.updateSummary();
  }

  private initializeStealthRolls(): void {
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
        encounterMonster.stealthRoll = new Roll();
      });
    });
  }

  private addCharacterToInitiative(character: EncounterCharacterConfiguration): void {
    this.encounterService.addCharacterToInitiative(character, this.initiativeOrder);
  }

  private addGroupToInitiative(config: EncounterMonsterGroupConfiguration, index: number): void {
    this.encounterService.addGroupToInitiative(config, this.initiativeOrder, index);
  }

  private addMonsterToInitiative(encounterMonster: EncounterMonster, config: EncounterMonsterGroupConfiguration, index: number): void {
    const init = new InitiativeOrderObject();
    init.name = config.group.monster.name + ' #' + encounterMonster.monsterNumber;
    init.initiative = encounterMonster.initiative;
    init.initiativeModifier = config.calculatedInitiativeModifier;
    init.initiativeModifierDisplay = config.initiativeModifierDisplay;
    init.group = config;
    init.monster = encounterMonster;
    init.order = encounterMonster.order;
    this.encounterService.addToInitiative(init, this.initiativeOrder, index);
  }

  private removeCharacterFromInitiative(character: EncounterCharacterConfiguration): void {
    const index = this.getCharacterInitiativeIndex(character);
    if (index > -1) {
      this.initiativeOrder.splice(index, 1);
    }
  }

  private removeGroupFromInitiative(config: EncounterMonsterGroupConfiguration): void {
    if (config.group.groupedInitiative) {
      const index = this.getGroupInitiativeIndex(config);
      if (index > -1) {
        this.initiativeOrder.splice(index, 1);
      }
    } else {
      config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
        const index = this.getMonsterInitiativeIndex(encounterMonster);
        if (index > -1) {
          this.initiativeOrder.splice(index, 1);
        }
      });
    }
  }

  private removeFromInitiative(initiativeOrderObject: InitiativeOrderObject): void {
    const index = this.initiativeOrder.indexOf(initiativeOrderObject);
    if (index > -1) {
      this.initiativeOrder.splice(index, 1);
    }
  }

  private sortInitiative(): void {
    if (!this.editingEncounter.customSort) {
      this.encounterService.sortInitiative(this.initiativeOrder, this.campaign.settings.initiative.natural20First);
    }
  }

  setStep(step: number): void {
    this.step = step;

    this.showEdit = false;
    this.showSetup = false;
    this.showInit = false;
    this.showConfirmInit = false;
    this.showSurprise = false;
    if (this.active) {
      switch (this.step) {
        case 0:
          this.setStepSetup();
          break;
        case 1:
          this.setStepInitiative();
          break;
        case 2:
          this.setStepConfirmInitiative();
          break;
        case 3:
          this.setStepSurprise();
          break;
      }
    } else {
      switch (this.step) {
        case 0:
          this.setStepAddEdit();
          break;
        case 1:
          this.setStepSetup();
          break;
        case 2:
          this.setStepInitiative();
          break;
        case 3:
          this.setStepConfirmInitiative();
          break;
      }
    }
  }

  private setStepAddEdit(): void {
    this.headerName = this.editingEncounter.id === '0' ? this.translate.instant('Encounter.Add') : this.translate.instant('Encounter.Edit');
    this.tertiaryLabel = '';
    this.showEdit = true;
  }

  private setStepSetup(): void {
    if (this.active && !this.encounterStarted) {
      this.headerName = this.translate.instant('Headers.ConfirmSetup');
    } else if (this.active && this.encounterStarted) {
      this.headerName = this.translate.instant('Navigation.Encounter.AddCreatures');
    } else {
      this.headerName = this.showCharacters ? this.translate.instant('Headers.Setup') : this.translate.instant('Headers.Monsters');
    }
    this.tertiaryLabel = ''
    this.showSetup = true;
  }

  private setStepInitiative(): void {
    this.headerName = this.translate.instant('Headers.InitiativeRoll');
    this.tertiaryLabel = ''
    this.showInit = true;
  }

  private setStepConfirmInitiative(): void {
    this.headerName = this.translate.instant('Headers.ConfirmInitiative');
    this.tertiaryLabel = this.translate.instant('Sort');
    this.showConfirmInit = true;
  }

  private setStepSurprise(): void {
    this.headerName = this.translate.instant('Headers.SurpriseRound');
    this.tertiaryLabel = '';
    this.showSurprise = true;
  }

  primaryClick(): void {
    if (this.monsterCount > this.maxMonsters) {
      this.notificationService.error(this.translate.instant('Encounter.TooManyMonsters'));
      return;
    }
    if (this.active) {
      if (!this.hasCreatures()) {
        this.notificationService.error(this.translate.instant('Encounter.NoCreatures'));
      } else if (this.hasUnrolledValues()) {
        const self = this;
        const data = new ConfirmDialogData();
        data.title = this.translate.instant('Encounter.UnrolledValues.Title');
        data.message = this.translate.instant('Encounter.UnrolledValues.Message');
        data.confirm = () => {
          self.rollRemainingValues().then(() => {
            this.saveClick();
          });
        };
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        this.dialog.open(ConfirmDialogComponent, dialogConfig);
      } else {
        this.saveClick();
      }
    } else {
      this.saveClick();
    }
  }

  private hasCreatures(): boolean {
    return this.characterCount > 0 || this.monsterCount > 0;
  }

  private hasUnrolledValues(): boolean {
    if (this.showCharacters) {
      for (let i = 0; i < this.characters.length; i++) {
        const character = this.characters[i];
        if (character.selected && character.encounterCharacter.initiative === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < this.groups.length; i++) {
      const config = this.groups[i];
      for (let j = 0; j < config.group.monsters.length; j++) {
        const encounterMonster = config.group.monsters[j];
        if (encounterMonster.initiative === 0) {
          return true;
        }
        if (encounterMonster.hp === 0) {
          return true;
        }
      }
    }

    return false;
  }

  private rollRemainingValues(): Promise<any> {
    this.loading = true;
    const promises = [];
    if (this.showCharacters) {
      this.characters.forEach((character: EncounterCharacterConfiguration) => {
        if (character.selected) {
          promises.push(this.encounterService.rollEncounterCharacterInitiative(character, false, ENCOUNTER_MONSTER_USE_LOCAL_ROLL));
        }
      });
    }

    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      promises.push(this.encounterService.rollEncounterGroup(config, false, ENCOUNTER_MONSTER_USE_LOCAL_ROLL));
    });
    return Promise.all(promises).then(() => {
      this.loading = false;
      this.updateAllInitiatives();
      this.sortInitiative();
      this.updateInitOrder();
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Roll.Error'));
    });
  }

  private saveClick(): void {
    if (this.editingEncounter.name === '') {
      this.notificationService.error(this.translate.instant('Encounter.Save.NameRequired'));
      return;
    }
    this.loading = true;
    this.editingEncounter.encounterMonsterGroups = this.encounterService.getEncounterMonsterGroups(this.groups);
    this.editingEncounter.encounterCharacters = this.encounterService.getEncounterCharacters(this.characters);
    if (!this.encounterStarted) {
      this.editingEncounter.hideKilled = this.campaign.settings.initiative.hideKilled;
    }
    this.updateInitOrder();
    if (this.editingEncounter.id === '0') {
      this.encounterService.createEncounter(this.editingEncounter, this.campaign.id).then((encounterId: string) => {
        this.editingEncounter.id = encounterId;
        this.continueSave();
      }, () => {
        this.loading = false;
        this.notificationService.error(this.translate.instant('Encounter.Save.Error'));
      });
    } else {
      this.encounterService.updateEncounter(this.editingEncounter).then(() => {
        this.continueSave();
      }, () => {
        this.loading = false;
        this.notificationService.error(this.translate.instant('Encounter.Save.Error'));
      });
    }
  }

  private updateInitOrder(): void {
    this.initiativeOrder.forEach((order: InitiativeOrderObject, index: number) => {
      order.order = index;
      if (order.character != null) {
        order.character.encounterCharacter.order = index;
      } else if (order.group != null) {
        if (order.group.group.groupedInitiative) {
          order.group.group.order = index;
          order.group.group.monsters.forEach((encounterMonster: EncounterMonster) => {
            encounterMonster.order = index;
          });
        } else if (order.monster != null) {
          order.group.group.order = 0;
          order.monster.order = index;
        }
      }
    });
  }

  private continueSave(): void {
    this.loading = true;
    this.updateEncounter();

    if (this.encounterStarted || this.active) {
      this.updateBattleCreatures().then(() => {
        this.loading = false;
        if (this.active) {
          this.start.emit();
        } else {
          this.save.emit(this.editingEncounter.id);
        }
      }, () => {
        this.loading = false;
        this.notificationService.error(this.translate.instant('Encounter.Start.Error'));
      });
    } else {
      this.loading = false;
      this.save.emit(this.editingEncounter.id);
    }
  }

  private updateBattleCreatures(): Promise<any> {
    return this.encounterService.createBattleCreatures(this.editingEncounter.id);
  }

  private updateEncounter(): void {
    if (this.encounter != null) {
      this.encounter.name = this.editingEncounter.name;
      this.encounter.description = this.editingEncounter.description;
      this.encounter.encounterMonsterGroups = this.editingEncounter.encounterMonsterGroups;
      this.encounter.encounterCharacters = this.editingEncounter.encounterCharacters;
      this.encounter.customSort = this.editingEncounter.customSort;
      this.encounter.hideKilled = this.editingEncounter.hideKilled;
    }
  }

  deleteClick(): void {
    this.delete.emit();
  }

  tertiaryClick(): void {
    if (this.showConfirmInit) {
      this.editingEncounter.customSort = false;
      this.sortInitiative();
      this.updateInitOrder();
    }
  }

  rollCharacterInitiative(): void {
    this.loading = true;
    const promises = [];
    this.characters.forEach((character: EncounterCharacterConfiguration) => {
      if (character.selected && !character.disabled) {
        promises.push(this.encounterService.rollEncounterCharacterInitiative(character, true, ENCOUNTER_MONSTER_USE_LOCAL_ROLL));
      }
    });
    Promise.all(promises).then(() => {
      this.loading = false;
      this.updateAllInitiatives();
      this.sortInitiative();
      this.updateInitOrder();
    });
  }

  rollMonsterInitiative(): void {
    this.loading = true;
    const promises = [];
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      promises.push(this.encounterService.rollEncounterGroup(config, true, ENCOUNTER_MONSTER_USE_LOCAL_ROLL));
    });
    Promise.all(promises).then(() => {
      this.loading = false;
      this.updateAllInitiatives();
      this.sortInitiative();
      this.updateInitOrder();
    });
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  groupClick(config: EncounterMonsterGroupConfiguration): void {
    this.viewingGroup = config;
    this.updateClickDisabled();
  }

  closeGroup(): void {
    this.viewingGroup = null;
    this.updateClickDisabled();
  }

  saveGroup(editingGroup: EditingEncounterMonsterGroup): void {
    if (editingGroup.originalGroupedInitiative && !editingGroup.group.group.groupedInitiative) {
      // used to be grouped but now isn't
      const groupInitIndex = this.getGroupInitiativeIndex(editingGroup.group);
      if (groupInitIndex > -1) {
        this.initiativeOrder.splice(groupInitIndex, 1);
        editingGroup.group.group.monsters.forEach((encounterMonster: EncounterMonster) => {
          this.addMonsterToInitiative(encounterMonster, editingGroup.group, groupInitIndex + encounterMonster.monsterNumber - 1);
        });
      } else {
        editingGroup.group.group.monsters.forEach((encounterMonster: EncounterMonster) => {
          this.addMonsterToInitiative(encounterMonster, editingGroup.group, -1);
        });
      }
    } else if (!editingGroup.originalGroupedInitiative && editingGroup.group.group.groupedInitiative) {
      // used to be ungrouped but is now grouped
      const monsterInitiatives = this.getMonsterInitiatives(editingGroup.group);
      let firstIndex = -1;
      if (monsterInitiatives.length > 0) {
        firstIndex = monsterInitiatives[0].order;
      }
      this.addGroupToInitiative(editingGroup.group, firstIndex);
      for (let i = 0; i < monsterInitiatives.length; i++) {
        const monsterInitiative = monsterInitiatives[i];
        this.removeFromInitiative(monsterInitiative);
      }
    } else if (!editingGroup.group.group.groupedInitiative) {
      // still ungrouped
      const quantityChange = editingGroup.group.group.quantity - editingGroup.originalQuantity;
      if (quantityChange > 0) {
        // added encounter monsters
        for (let i = editingGroup.originalQuantity; i < editingGroup.group.group.quantity; i++) {
          const encounterMonster = editingGroup.group.group.monsters[i];
          this.addMonsterToInitiative(encounterMonster, editingGroup.group, -1);
        }
      } else if (quantityChange < 0) {
        // removed encounter monsters
        const monsterInitiatives = this.getMonsterInitiatives(editingGroup.group);
        const numToRemove = quantityChange * -1;
        const stopIndex = monsterInitiatives.length - numToRemove;
        for (let i = monsterInitiatives.length - 1; i >= stopIndex; i--) {
          const monsterInitiative = monsterInitiatives[i];
          this.removeFromInitiative(monsterInitiative);
        }
      }
    } else if (editingGroup.group.group.groupedInitiative) {
      // still grouped
      if (editingGroup.group.group.quantity !== editingGroup.originalQuantity) {
        const init = this.getGroupInitiative(editingGroup.group);
        if (init != null) {
          init.display = editingGroup.group.group.quantity > 0;
          init.name = editingGroup.group.group.monster.name + ' (x' + editingGroup.group.group.quantity + ')';
        }
      }
    }
    this.updateAllInitiatives();
    this.sortInitiative(); // assume that the initiative changed
    this.updateInitOrder();
    this.updateMonsterCount();
    this.updateMonsterStealthDisplay();
    this.updateSummary();
    this.viewingGroup = null;
    this.updateClickDisabled();
  }

  addMonsters(): void {
    this.addingMonsters = true;
    this.updateClickDisabled();
  }

  async saveMonsters(selectedMonsters: MonsterListItem[]): Promise<any> {
    const groups: EncounterMonsterGroupConfiguration[] = [];
    for (const monsterListItem of selectedMonsters) {
      groups.push(await this.getGroup(monsterListItem));
    }
    this.groups = this.groups.concat(groups);
    this.addingMonsters = false;
    this.updateClickDisabled();

    groups.forEach((group: EncounterMonsterGroupConfiguration) => {
      this.addGroupToInitiative(group, -1);
    });
    this.updateGroupNumbers();
    this.sortInitiative();
    this.updateInitOrder();
    this.updateMonsterCount();
    this.updateSummary();
  }

  private updateGroupInitiativeModifiers(): void {
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      this.encounterService.initializeEncounterMonsterGroupConfiguration(config, this.encounterStarted);
    });
  }

  private updateGroupNumbers(): void {
    this.groups.forEach((config: EncounterMonsterGroupConfiguration, index: number) => {
      config.group.groupNumber = index + 1;
    });
  }

  private async calculateGroupHp(config: EncounterMonsterGroupConfiguration): Promise<number> {
    let hp = 0;
    if (config.group.healthCalculationType === HealthCalculationType.AVERAGE) {
      hp = config.calculatedAverageHp;
    } else if (config.group.healthCalculationType === HealthCalculationType.MAX) {
      hp = config.calculatedMaxHp;
    } else if (config.group.groupedHp) {
      if (config.group.monsters.length > 0) {
        hp = config.group.monsters[0].hp;
      } else {
        hp = await this.monsterService.rollHp(config.group.monster, 1, ENCOUNTER_MONSTER_USE_LOCAL_ROLL);
      }
    }
    return Promise.resolve(hp);
  }

  private async calculateGroupInitiative(group: EncounterMonsterGroup): Promise<number> {
    let initiative = 0;
    if (group.groupedInitiative) {
      if (group.monsters.length > 0) {
        initiative = group.monsters[0].initiative;
      } else {
        initiative = await this.monsterService.rollInitiative(group.monster, 1, ENCOUNTER_MONSTER_USE_LOCAL_ROLL);
      }
    }
    return Promise.resolve(initiative);
  }

  private async getGroup(monsterListItem: MonsterListItem): Promise<EncounterMonsterGroupConfiguration> {
    return this.monsterService.getMonsterSummary(monsterListItem.monster.id).then(async (monsterSummary: MonsterSummary) => {
      const group = new EncounterMonsterGroup();
      const config = new EncounterMonsterGroupConfiguration(group);
      let roundToAdd = this.editingEncounter.currentRound;
      if (roundToAdd == null || roundToAdd < 1) {
        roundToAdd = 1;
      }
      group.monster = monsterSummary;
      group.quantity = monsterListItem.quantity;
      if (group.quantity > 99) {
        group.quantity = 99;
      }
      this.encounterService.initializeEncounterMonsterGroupConfiguration(config, this.encounterStarted);

      group.healthCalculationType = this.campaign.settings.health.healthCalculationType;
      group.groupedHp = this.campaign.settings.health.grouped;
      group.groupedInitiative = this.campaign.settings.initiative.grouped;

      let hp = await this.calculateGroupHp(config);
      let initiative = await this.calculateGroupInitiative(group);

      for (let i = 0; i < monsterListItem.quantity; i++) {
        const encounterMonster = new EncounterMonster();
        encounterMonster.monsterNumber = i + 1;
        if (initiative === 0) {
          initiative = await this.monsterService.rollInitiative(group.monster, encounterMonster.monsterNumber, ENCOUNTER_MONSTER_USE_LOCAL_ROLL);
        }
        if (hp === 0) {
          hp = await this.monsterService.rollHp(group.monster, encounterMonster.monsterNumber, ENCOUNTER_MONSTER_USE_LOCAL_ROLL);
        }
        encounterMonster.roundAdded = roundToAdd;
        encounterMonster.hp = hp;
        encounterMonster.initiative = initiative;
        encounterMonster.initiativeTooltip = `${initiative - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
        group.monsters.push(encounterMonster);

        this.applyCharacterStealthToGroup(config);
      }

      return this.encounterService.rollEncounterGroup(config, true, ENCOUNTER_MONSTER_USE_LOCAL_ROLL).then(() => {
        return config;
      });
    });
  }

  cancelMonsters(): void {
    this.addingMonsters = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingGroup != null || this.addingMonsters;
  }

  drop(event: CdkDragDrop<InitiativeOrderObject[]>) {
    if (event.previousIndex !== event.currentIndex) {
      const previous = this.encounterService.getTrueInitiativeIndex(this.initiativeOrder, event.previousIndex);
      const current = this.encounterService.getTrueInitiativeIndex(this.initiativeOrder, event.currentIndex);
      moveItemInArray(this.initiativeOrder, previous, current);
      this.editingEncounter.customSort = true;
      this.updateInitOrder();
    }
  }

  removeGroupClick(event: MouseEvent, config: EncounterMonsterGroupConfiguration): void {
    if (config.disabled) {
      return;
    }
    event.stopPropagation();
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Group.Remove.Title');
    data.message = this.translate.instant('Encounter.Group.Remove.Confirmation');
    data.confirm = () => {
      self.removeGroup(config);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  removeGroup(config: EncounterMonsterGroupConfiguration): void {
    const index = this.groups.indexOf(config);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
    this.removeGroupFromInitiative(config);
    this.updateGroupNumbers();
    this.updateInitOrder();
    this.updateMonsterCount();
    this.updateSummary();
  }

  increaseGroup(event: MouseEvent, config: EncounterMonsterGroupConfiguration): void {
    event.stopPropagation();
    if (!this.quantityChangeDisabled && config.group.quantity < 99) {
      this.changeGroupQuantity(config, 1);
    }
  }

  decreaseGroup(event: MouseEvent, config: EncounterMonsterGroupConfiguration): void {
    event.stopPropagation();
    if (!this.quantityChangeDisabled && config.group.quantity > 0 && config.group.quantity > config.originalQuantity) {
      this.changeGroupQuantity(config, -1);
    }
  }

  private async changeGroupQuantity(config: EncounterMonsterGroupConfiguration, quantityChange: number): Promise<any> {
    this.quantityChangeDisabled = true;
    const originalQuantity = config.group.quantity;
    config.group.quantity += quantityChange;
    if (config.group.quantity < config.originalQuantity) {
      config.group.quantity = config.originalQuantity;
      this.quantityChangeDisabled = false;
      return Promise.resolve();
    }
    if (config.group.quantity < 0) {
      config.group.quantity = 0;
      this.quantityChangeDisabled = false;
      return Promise.resolve();
    } else if (config.group.quantity > 99) {
      config.group.quantity = 99;
      this.quantityChangeDisabled = false;
      return Promise.resolve();
    }

    const actualQuantityChange = config.group.quantity - originalQuantity;

    await this.changeGroupMonsterQuantity(config, actualQuantityChange);

    if (config.group.groupedInitiative) {
      const init = this.getGroupInitiative(config);
      if (init != null) {
        init.display = config.group.quantity > 0;
        init.name = config.group.monster.name + ' (x' + config.group.quantity + ')';
      }
    } else {
      if (actualQuantityChange > 0) {
        // added encounter monsters
        for (let i = originalQuantity; i < config.group.quantity; i++) {
          const encounterMonster = config.group.monsters[i];
          this.addMonsterToInitiative(encounterMonster, config, -1);
        }
      } else if (actualQuantityChange < 0) {
        // removed encounter monsters
        const monsterInitiatives = this.getMonsterInitiatives(config);
        const numToRemove = actualQuantityChange * -1;
        const stopIndex = monsterInitiatives.length - numToRemove;
        for (let i = monsterInitiatives.length - 1; i >= stopIndex; i--) {
          const monsterInitiative = monsterInitiatives[i];
          this.removeFromInitiative(monsterInitiative);
        }
      }
    }
    this.sortInitiative();
    this.updateInitOrder();
    this.updateMonsterCount();
    this.updateMonsterStealthDisplay();
    this.updateSummary();
    this.quantityChangeDisabled = false;
  }

  private async changeGroupMonsterQuantity(config: EncounterMonsterGroupConfiguration, quantityChange: number): Promise<any> {
    const originalQuantity = config.group.monsters.length;
    if (quantityChange > 0) {
      let hp = await this.calculateGroupHp(config);
      let initiative = await this.calculateGroupInitiative(config.group);
      let roundToAdd = this.editingEncounter.currentRound;
      if (roundToAdd == null || roundToAdd < 1) {
        roundToAdd = 1;
      }
      if (config.group.monsters.length > 0) {
        const previousConfigRound = config.group.monsters[config.group.monsters.length - 1].roundAdded;
        if (previousConfigRound > roundToAdd) {
          roundToAdd = previousConfigRound;
        }
      }

      for (let i = originalQuantity; i < originalQuantity + quantityChange; i++) {
        const encounterMonster = new EncounterMonster();
        if (initiative === 0) {
          initiative = await this.monsterService.rollInitiative(config.group.monster, encounterMonster.monsterNumber, ENCOUNTER_MONSTER_USE_LOCAL_ROLL);
        }
        if (hp === 0) {
          hp = await this.monsterService.rollHp(config.group.monster, encounterMonster.monsterNumber, ENCOUNTER_MONSTER_USE_LOCAL_ROLL);
        }
        encounterMonster.monsterNumber = i + 1;
        encounterMonster.roundAdded = roundToAdd;
        encounterMonster.hp = hp;
        encounterMonster.initiative = initiative;
        encounterMonster.initiativeTooltip = `${initiative - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
        encounterMonster.surprised = config.calculatedSurprised || config.calculatedSomeSurprised;
        config.group.monsters.push(encounterMonster);
      }
    } else if (quantityChange < 0) {
      const amountToRemove = quantityChange * -1;
      config.group.monsters.splice(config.group.monsters.length - amountToRemove, amountToRemove);
    }
  }

  cloneGroup(event: MouseEvent, config: EncounterMonsterGroupConfiguration): void {
    event.stopPropagation();
    const newGroup = _.cloneDeep(config);
    newGroup.disabled = false;
    let roundToAdd = this.editingEncounter.currentRound;
    if (roundToAdd == null || roundToAdd < 1) {
      roundToAdd = 1;
    }
    newGroup.group.monsters.forEach((encounterMonster: EncounterMonster) => {
      encounterMonster.roundAdded = roundToAdd;
    });

    this.groups.push(newGroup);
    this.addGroupToInitiative(newGroup, -1);
    this.updateGroupNumbers();
    this.sortInitiative();
    this.updateInitOrder();
    this.updateMonsterCount();
    this.updateSummary();
  }

  characterChange(event: MatCheckboxChange, character: EncounterCharacterConfiguration): void {
    if (character.disabled) {
      return;
    }

    character.selected = event.checked;
    if (event.checked) {
      this.addCharacterToInitiative(character);
      this.sortInitiative();
      this.updateInitOrder();
    } else {
      this.removeCharacterFromInitiative(character);
      this.updateInitOrder();
    }
    this.updateCharacterCount();
    this.updateSummary();
  }

  initiativeChange(input, character: EncounterCharacterConfiguration): void {
    if (character.disabled) {
      return;
    }

    const initiative = parseInt(input.value, 10);
    character.encounterCharacter.initiative = initiative;
    character.initiativeTooltip = `${character.encounterCharacter.initiative - character.initModifier} + ${character.initModifier}`;
    const init = this.getCharacterInitiative(character);
    if (init != null) {
      init.initiative = initiative;
    }
    this.debounceRefreshSort();
  }

  groupInitiativeChange(input, config: EncounterMonsterGroupConfiguration): void {
    if (config.disabled) {
      return;
    }

    const initiative = parseInt(input.value, 10);
    const tooltip = `${initiative - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
    config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
      encounterMonster.initiative = initiative;
      encounterMonster.initiativeTooltip = tooltip;
    });
    const init = this.getGroupInitiative(config);
    if (init != null) {
      init.initiative = initiative;
    }
    this.debounceRefreshSort();
  }

  monsterInitiativeChange(input, encounterMonster: EncounterMonster, config: EncounterMonsterGroupConfiguration): void {
    const initiative = parseInt(input.value, 10);
    encounterMonster.initiative = initiative;
    encounterMonster.initiativeTooltip = `${initiative - config.calculatedInitiativeModifier} + ${config.calculatedInitiativeModifier}`;
    const init = this.getMonsterInitiative(encounterMonster);
    if (init != null) {
      init.initiative = initiative;
    }
    this.debounceRefreshSort();
  }

  private updateCharacterCount(updateCustomSort: boolean = true): void {
    this.characterCount = 0;
    this.characters.forEach((character: EncounterCharacterConfiguration) => {
      if (character.selected) {
        this.characterCount++;
      }
    });
    if (updateCustomSort && this.editingEncounter.customSort && (this.characterCount + this.monsterCount) <= 1) {
      this.editingEncounter.customSort = false;
    }
  }

  private updateMonsterCount(updateCustomSort: boolean = true): void {
    this.monsterCount = 0;
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      this.monsterCount += config.group.monsters.length;
    });
    if (updateCustomSort && this.editingEncounter.customSort && (this.characterCount + this.monsterCount) <= 1) {
      this.editingEncounter.customSort = false;
    }
  }

  private updateSummary(): void {
    this.encounterSummary = this.encounterService.getEncounterSummary(this.characters, this.groups);
  }

  surpriseGroupClick(group: EncounterMonsterGroupConfiguration): void {
    this.surpriseGroup = group;
  }

  cancelSurpriseGroup(): void {
    this.surpriseGroup = null;
  }

  saveSurpriseGroup(): void {
    this.surpriseGroup = null;
    this.applyMonsterStealth();
  }

  surpriseGroupChange(event: MatCheckboxChange, config: EncounterMonsterGroupConfiguration): void {
    if (config.disabled) {
      return;
    }
    config.calculatedSurprised = event.checked;
    config.calculatedSomeSurprised = false;
    config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
      encounterMonster.surprised = event.checked;
    });
  }

  surpriseCharacterChange(event: MatCheckboxChange, character: EncounterCharacterConfiguration): void {
    if (character.disabled) {
      return;
    }
    character.encounterCharacter.surprised = event.checked;
  }

  characterStealthChange(input, character: EncounterCharacterConfiguration): void {
    if (character.disabled) {
      return;
    }
    character.stealthRoll.totalResult = parseInt(input.value, 10);
    const modifier = character.stealthModifier;
    character.stealthRollTooltip = `${character.stealthRoll.totalResult - modifier} + ${modifier}`;
    this.debounceCharacterStealth();
  }

  private applyCharacterStealth(): void {
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      this.applyCharacterStealthToGroup(config);
    });
  }

  private applyCharacterStealthToGroup(config: EncounterMonsterGroupConfiguration): void {
    const stealthRolls = this.getCharacterStealthRolls();
    config.calculatedSurprised = this.isSurprised(config.calculatedPassivePerception, stealthRolls);
    config.calculatedSomeSurprised = false;
    config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
      encounterMonster.surprised = config.calculatedSurprised;
    });
  }

  private getCharacterStealthRolls(): Roll[] {
    const stealthRolls: Roll[] = [];
    this.characters.forEach((character: EncounterCharacterConfiguration) => {
      if (character.selected) {
        stealthRolls.push(character.stealthRoll);
      }
    });
    return stealthRolls;
  }

  rollCharacterStealth(): void {
    const promises = [];
    this.characters.forEach((character: EncounterCharacterConfiguration) => {
      promises.push(this.encounterService.rollEncounterCharacterStealth(character, true, ENCOUNTER_MONSTER_USE_LOCAL_ROLL));
    });

    Promise.all(promises).then(() => {
      this.applyCharacterStealth();
    });
  }

  rollMonsterStealth(): void {
    const promises = [];
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      promises.push(this.encounterService.rollEncounterGroupStealth(config, ENCOUNTER_MONSTER_USE_LOCAL_ROLL));
    });

    Promise.all(promises).then(() => {
      this.applyMonsterStealth();
    });
  }

  private updateMonsterStealthDisplay(): void {
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      this.updateGroupStealthDisplay(config);
    });
  }

  private updateGroupStealthDisplay(config: EncounterMonsterGroupConfiguration): void {
    const stealthRolls = this.getGroupStealthRolls(config);
    const useLowest = this.campaign.settings.surpriseRound.groupCheckType === GroupCheckType.LOWEST;
    if (useLowest) {
      const lowestValue = this.getLowestValue(stealthRolls);
      if (lowestValue != null) {
        config.calculatedStealthRollDisplay = this.translate.instant('Encounter.Group.Stealth.Lowest', { 'value': lowestValue });
      }
    } else {
      const average = this.getAverageValue(stealthRolls);
      if (average != null) {
        config.calculatedStealthRollDisplay = this.translate.instant('Encounter.Group.Stealth.Average', { 'value': average });
      }
    }
  }

  private applyMonsterStealth(): void {
    this.updateMonsterStealthDisplay();
    const stealthRolls = this.getMonsterStealthRolls();
    this.characters.forEach((character: EncounterCharacterConfiguration) => {
      character.encounterCharacter.surprised = this.isSurprised(character.passivePerception, stealthRolls);
    });
    this.monsterRolls = this.getMonsterStealthRolls();
  }

  private getGroupStealthRolls(config: EncounterMonsterGroupConfiguration): Roll[] {
    const stealthRolls: Roll[] = [];
    config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
      stealthRolls.push(encounterMonster.stealthRoll);
    });
    return stealthRolls;
  }

  private getMonsterStealthRolls(): Roll[] {
    const stealthRolls: Roll[] = [];
    this.groups.forEach((config: EncounterMonsterGroupConfiguration) => {
      config.group.monsters.forEach((encounterMonster: EncounterMonster) => {
        stealthRolls.push(encounterMonster.stealthRoll);
      });
    });
    return stealthRolls;
  }

  private isSurprised(passivePerception: number, stealthRolls: Roll[]): boolean {
    if (stealthRolls.length === 0) {
      return false;
    }
    const useLowest = this.campaign.settings.surpriseRound.groupCheckType === GroupCheckType.LOWEST;
    if (useLowest) {
      const lowestValue = this.getLowestValue(stealthRolls);
      return lowestValue != null && lowestValue > passivePerception;
    } else { // use group check
      const criticalDoubles = this.campaign.settings.surpriseRound.criticalDoubles;
      let successCount = 0;
      let failureCount = 0;
      stealthRolls.forEach((stealthRoll: Roll) => {
        const naturalRoll = this.diceService.getNaturalRoll(stealthRoll);
        if (naturalRoll === 20) {
          successCount++;
          if (criticalDoubles) {
            successCount++;
          }
        } else if (naturalRoll === 1) {
          failureCount++;
          if (criticalDoubles) {
            failureCount++;
          }
        } else {
          if (stealthRoll.totalResult > passivePerception) {
            successCount++;
          } else {
            failureCount++;
          }
        }
      });
      return successCount >= failureCount;
    }
  }

  private getLowestValue(rolls: Roll[]): number {
    if (!this.hasValues(rolls)) {
      return null;
    }
    let lowest: number = null;
    rolls.forEach((roll: Roll) => {
      if (lowest == null || roll.totalResult < lowest) {
        lowest = roll.totalResult;
      }
    });
    return lowest;
  }

  private getAverageValue(rolls: Roll[]): number {
    if (!this.hasValues(rolls)) {
      return null;
    }
    if (rolls.length === 0) {
      return 0;
    }
    let sum = 0;
    rolls.forEach((roll: Roll) => {
      sum += roll.totalResult;
    });
    const average = sum / rolls.length;
    return Math.round(average * 1000) / 1000.0;
  }

  private hasValues(rolls: Roll[]): boolean {
    for (let i = 0; i < rolls.length; i++) {
      if (rolls[i].results.length > 0) {
        return true;
      }
    }
    return false;
  }
}
