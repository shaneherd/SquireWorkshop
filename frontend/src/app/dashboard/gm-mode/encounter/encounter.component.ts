import {Component, OnDestroy, OnInit} from '@angular/core';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../../../constants';
import {Subscription} from 'rxjs';
import {EncounterContextMenuService} from '../encounter-context-menu/encounter-context-menu.service';
import {EventsService} from '../../../core/services/events.service';
import {ResolutionService} from '../../../core/services/resolution.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EncounterService} from '../../../core/services/encounter.service';
import {Encounter} from '../../../shared/models/campaigns/encounters/encounter';
import {Campaign} from '../../../shared/models/campaigns/campaign';
import {CampaignService} from '../../../core/services/campaign.service';
import {NotificationService} from '../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {BattleCreature} from '../../../shared/models/campaigns/encounters/battle-creature';
import {ConfirmDialogData} from '../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';
import {
  CreatureConfigurationCollection,
  MonsterConfigurationCollection
} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {MonsterService} from '../../../core/services/creatures/monster.service';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import * as _ from 'lodash';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {BattleMonster} from '../../../shared/models/creatures/battle-monsters/battle-monster';
import {Monster} from '../../../shared/models/creatures/monsters/monster';
import {InheritedFrom} from '../../../shared/models/creatures/inherited-from';
import {CreatureState} from '../../../shared/models/creatures/creature-state.enum';
import {EncounterCreatureType} from '../../../shared/models/campaigns/encounters/encounter-creature-type.enum';
import {EncounterCreature} from '../../../shared/models/campaigns/encounters/encounter-creature';
import {EncounterCharacter} from '../../../shared/models/campaigns/encounters/encounter-character';
import {EncounterMonsterGroup} from '../../../shared/models/campaigns/encounters/encounter-monster-group';
import {EncounterMonster} from '../../../shared/models/campaigns/encounters/encounter-monster';
import {CombatCreature, CombatRow} from '../../../shared/models/combat-row';
import {Creature} from '../../../shared/models/creatures/creature';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {BattleMonsterAction, BattleMonsterPower} from '../../../shared/models/creatures/battle-monster-action';
import {RollRequest} from '../../../shared/models/rolls/roll-request';
import {RollType} from '../../../shared/models/rolls/roll-type.enum';
import {DiceService} from '../../../core/services/dice.service';
import {CreaturePower} from '../../../shared/models/creatures/creature-power';

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.scss']
})
export class EncounterComponent implements OnInit, OnDestroy {
  resSub: Subscription;
  eventSub: Subscription;
  routeSub: Subscription;

  id = '0';
  loading = false;
  MIN_COLUMN_WIDTH = 400;
  INITIATIVE_COLUMN_WIDTH = 300;
  INITIATIVE_COLUMN_COLLAPSED_WIDTH = 32;
  width: number;
  calculatedColumns = 1;
  isDesktop = true;
  headerName = '';

  initiativeExpanded = true;
  viewingInitiative = false;
  defaultCreatureCollection: CreatureConfigurationCollection;

  campaign: Campaign = null;
  encounter: Encounter = null;
  addingCreatures = false;

  combatRows: CombatRow[] = [];

  hideKilled = true;
  currentRow: CombatRow = null;
  selectedRow: CombatRow = null;

  noCreaturesVisible = false;
  round = 1;
  turn = 1;
  displayTurn = 1;
  turnTooltip = '';
  previousCount = 0; // this is the number of times the user clicked previous, so that we don't re-apply ongoing damage
  previousEnabled = true;
  viewingHealthCreature: CombatCreature;
  promptForNoMonsters = true;
  reorderingInitiative = false;
  viewingSpeedCreature: CombatCreature;

  constructor(
    private resolutionService: ResolutionService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private encounterContextMenuService: EncounterContextMenuService,
    private eventsService: EventsService,
    private encounterService: EncounterService,
    private campaignService: CampaignService,
    private notificationService: NotificationService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private monsterService: MonsterService,
    private translate: TranslateService,
    private diceService: DiceService
  ) { }

  ngOnInit() {
    this.resSub = this.resolutionService.width.subscribe(width => {
      this.isDesktop = ResolutionService.isDesktop(width);
      this.width = width;
      this.updateCalculatedColumns();
      this.encounterContextMenuService.setMobile(!this.isDesktop);
    });

    this.encounterContextMenuService.setDisplay(true);
    this.encounterContextMenuService.setMobile(!this.isDesktop);
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Encounter.QuickReferences) {
        this.quickReferences();
      } else if (event === EVENTS.Encounter.RollLog) {
        this.rollLog();
      } else if (event === EVENTS.Encounter.AddCreatures) {
        this.addCreatures();
      } else if (event === EVENTS.Encounter.ReorderInitiative) {
        this.reorderInitiative();
      } else if (event === EVENTS.Encounter.PauseEncounter) {
        this.pauseEncounter();
      } else if (event === EVENTS.Encounter.RestartEncounter) {
        this.restartEncounter();
      } else if (event === EVENTS.Encounter.FinishEncounter) {
        this.finishEncounter();
      } else if (event === EVENTS.Encounter.Notifications) {
        this.notifications();
      } else if (event === EVENTS.Encounter.Attack) {
        this.attack();
      } else if (event === EVENTS.Encounter.ToggleInitiative) {
        this.toggleInitiative();
      } else if (event === EVENTS.HpUpdated) {
        if (this.selectedRow != null) {
          const combatCreature = this.selectedRow.getSelectedCombatCreature();
          if (combatCreature != null) {
            combatCreature.updateCurrentHp();
            this.updateCombatCreature(combatCreature);
          }
        }
      }
    });

    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.id = params.id;
      if (this.id !== '0') {
        this.refreshEncounter();
        this.encounterContextMenuService.setId(this.id);
      }
    });
  }

  ngOnDestroy() {
    this.encounterContextMenuService.setDisplay(false);
    this.eventSub.unsubscribe();
    this.resSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  private updateCalculatedColumns(): void {
    if (this.isDesktop) {
      const initiativeColumnWidth = this.initiativeExpanded ? this.INITIATIVE_COLUMN_WIDTH : this.INITIATIVE_COLUMN_COLLAPSED_WIDTH;
      let numColumns = Math.floor((this.width - initiativeColumnWidth) / this.MIN_COLUMN_WIDTH);
      if (numColumns < 1) {
        numColumns = 1;
      }
      this.calculatedColumns = numColumns;
    } else {
      this.calculatedColumns = 1;
    }
  }

  /****************************** Page Setup ******************************/

  private refreshEncounter(): void {
    this.loading = true;
    this.encounterService.getEncounter(this.id).then((encounter: Encounter) => {
      this.encounter = encounter;
      this.hideKilled = this.encounter.hideKilled;

      if (this.isDesktop) {
        this.headerName = encounter.name;
      }

      const promises = [];
      promises.push(this.creatureService.initializeConfigurationCollection().then((collection: CreatureConfigurationCollection) => {
        this.defaultCreatureCollection = collection;
      }));
      promises.push(this.campaignService.getCampaign(encounter.campaignId).then((campaign: Campaign) => {
        this.campaign = campaign;
      }));
      Promise.all(promises).then(() => {
        this.updateList();
      }, () => {
        this.errorLoading();
      });
    }, () => {
      this.errorLoading();
    });
  }

  private errorLoading(): void {
    this.notificationService.error(this.translate.instant('Encounter.Load.Error'));
    this.loading = false;
  }

  /****************************** Click Events ******************************/

  cancelAddCreatures(): void {
    this.addingCreatures = false;
  }

  saveAddCreatures(): void {
    this.addingCreatures = false;
    this.updateList();
  }

  previousClick(): void {
    this.previous(this.currentRow);
  }

  nextClick(): void {
    this.next(this.currentRow);
  }

  cardClick(combatRow: CombatRow): void {
    if (!combatRow.selected) { // not already selected
      this.setSelected(combatRow);
    }
    if (!this.isDesktop) {
      this.headerName = combatRow.combatCreatureDisplayName;
      // setTimeout(() => {
      //   this.viewingInitiative = false;
      // });
    }
  }

  private setSelected(combatRow: CombatRow): void {
    if (combatRow == null) {
      return;
    }
    if (this.selectedRow != null) {
      this.selectedRow.setSelected(false);
    }
    combatRow.setSelected(true);
    this.eventsService.dispatchEvent(EVENTS.Encounter.SelectedChange + combatRow.id)
    this.selectedRow = combatRow;
    if (!this.isDesktop) {
      this.headerName = combatRow.combatCreatureDisplayName;
    }
    //todo - update all pages to use the new battle creature
  }

  private updateSelection(): void {
    if (this.selectedRow == null || this.selectedRow.isRemoved() || (this.hideKilled && this.selectedRow.dead) || !this.selectedRow.display) {
      this.setSelected(this.currentRow);
    } else {
      const selectedCreature = this.selectedRow.getSelectedCombatCreature();
      if (selectedCreature != null && !selectedCreature.display) {
        selectedCreature.selected = false;
        this.selectedRow.updateDefaultSelected();
        this.eventsService.dispatchEvent(EVENTS.Encounter.SelectedChange + this.selectedRow.id)
      }
    }
  }

  hpClick(combatCreature: CombatCreature): void {
    this.viewingHealthCreature = combatCreature;
  }

  saveHealth(combatCreature: CombatCreature): void {
    this.viewingHealthCreature = null;
    combatCreature.updateCurrentHp();
    this.updateCombatCreature(combatCreature);
    this.eventsService.dispatchEvent(EVENTS.Encounter.HpChange + combatCreature.combatRow.id);
    this.eventsService.dispatchEvent(EVENTS.HpUpdated);
  }

  closeHealth(): void {
    this.viewingHealthCreature = null;
  }

  hideKilledChange(checked: boolean): void {
    this.hideKilled = checked;
    this.updateHidden();
    this.updateSelection();
    this.hideLabelAtEnd();
    this.nextTurnIfNotValid();
    this.setPreviousEnabled();
    this.displayTurn = this.getDisplayTurn();
    this.turnTooltip = this.getTurnTooltip();
  }

  toggleInitiative(): void {
    if (this.isDesktop) {
      this.initiativeExpanded = !this.initiativeExpanded;
      this.updateCalculatedColumns();
    } else {
      this.viewingInitiative = !this.viewingInitiative;
    }
  }

  closeInitiative(): void {
    this.viewingInitiative = false;
  }

  fleeClick(combatRow: CombatRow): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant(combatRow.dead ? 'Encounter.Remove.Title' : 'Encounter.Flee.Title', {name: combatRow.displayName});
    data.message = this.translate.instant(combatRow.dead ? 'Encounter.Remove.Message' : 'Encounter.Flee.Message');
    data.confirm = () => {
      self.continueFlee(combatRow);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private getEncounterCreature(combatCreature: CombatCreature): EncounterCreature {
    switch (combatCreature.battleCreature.encounterCreatureType) {
      case EncounterCreatureType.CHARACTER:
        return _.find(this.encounter.encounterCharacters, (encounterCharacter: EncounterCharacter) => {
          return encounterCharacter.id === combatCreature.battleCreature.id;
        });
      case EncounterCreatureType.MONSTER:
        const group = _.find(this.encounter.encounterMonsterGroups, (encounterMonsterGroup: EncounterMonsterGroup) => {
          return encounterMonsterGroup.id === combatCreature.battleCreature.groupId;
        });
        if (group != null) {
          return _.find(group.monsters, (encounterMonster: EncounterMonster) => {
            return encounterMonster.id === combatCreature.battleCreature.id;
          });
        }
        return null;
    }
  }

  private continueFlee(combatRow: CombatRow): void {
    this.loading = true;
    if (combatRow.combatCreatures.length === 0) {
      this.loading = false;
      return;
    }
    const firstCombatCreature = combatRow.combatCreatures[0];
    const groupId = firstCombatCreature.battleCreature.groupId;

    this.loading = true;
    const promises = [];
    if (groupId == null || groupId === '0') {
      promises.push(this.encounterService.removeCreature(this.encounter.id, firstCombatCreature.battleCreature.id).then(async () => {
        await this.finishFleeCreature(firstCombatCreature);
      }, () => {
        this.loading = false;
        this.notificationService.error(this.translate.instant(firstCombatCreature.dead ? 'Encounter.Remove.Error' : 'Encounter.Flee.Error'));
      }));
    } else {
      promises.push(this.encounterService.removeGroup(this.encounter.id, groupId).then(async () => {
        for (const combatCreature of combatRow.combatCreatures) {
          await this.finishFleeCreature(combatCreature);
        }
      }, () => {
        this.loading = false;
        this.notificationService.error(this.translate.instant(firstCombatCreature.dead ? 'Encounter.Remove.Error' : 'Encounter.Flee.Error'));
      }));
    }
    Promise.all(promises).then(() => {
      this.eventsService.dispatchEvent(EVENTS.Encounter.Flee + combatRow.id);
      this.loading = false;
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant(combatRow.dead ? 'Encounter.Remove.Error' : 'Encounter.Flee.Error'));
    });
  }

  private async finishFleeCreature(combatCreature: CombatCreature): Promise<void> {
    combatCreature.battleCreature.removed = true;
    let encounterCreature = this.getEncounterCreature(combatCreature);
    if (encounterCreature == null) {
      const encounter = await this.encounterService.getEncounter(this.encounter.id);
      this.encounter.encounterCharacters = encounter.encounterCharacters;
      this.encounter.encounterMonsterGroups = encounter.encounterMonsterGroups;
      encounterCreature = this.getEncounterCreature(combatCreature);
    }
    if (encounterCreature != null) {
      encounterCreature.removed = true;
    }

    // SQLiteDatabase db = CombatActivity.getContext().getDB();
    // List<String> notifications = updateCreaturesConditions(creature, CreatureTurnType.START_OF_NEXT_TURN, db);
    // List<String> temp = updateCreaturesConditions(creature, CreatureTurnType.END_OF_NEXT_TURN, db);
    // Util.combineStringLists(notifications, temp);
    // this.updateNotifications(notifications);

    this.updateCombatCreature(combatCreature);
  }

  killClick(combatCreature: CombatCreature): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Kill.Title', {name: combatCreature.getDisplayName()});
    data.message = this.translate.instant('Encounter.Kill.Message');
    data.confirm = () => {
      self.continueKill(combatCreature);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueKill(combatCreature: CombatCreature): void {
    this.loading = true;
    const creatureHealth = _.cloneDeep(combatCreature.battleCreature.creature.creatureHealth);
    creatureHealth.creatureState = CreatureState.DEAD;
    creatureHealth.currentHp = 0;
    creatureHealth.tempHp = 0;
    this.encounterService.updateHealth(combatCreature.battleCreature.creature.id, creatureHealth).then(() => {
      this.loading = false;
      combatCreature.battleCreature.creature.creatureHealth = creatureHealth;
      combatCreature.updateCurrentHp();

      this.updateCombatCreature(combatCreature);
      this.eventsService.dispatchEvent(EVENTS.Encounter.HpChange + combatCreature.combatRow.id);

      // SQLiteDatabase db = CombatActivity.getContext().getDB();
      // List<String> notifications = updateCreaturesConditions(creature, CreatureTurnType.START_OF_NEXT_TURN, db);
      // List<String> temp = updateCreaturesConditions(creature, CreatureTurnType.END_OF_NEXT_TURN, db);
      // Util.combineStringLists(notifications, temp);
      // this.updateNotifications(notifications);
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Kill.Error'));
    });
  }

  addGroupCreatures(combatRow: CombatRow): void {
    this.notificationService.info('Add Group Creatures Not Implemented Yet');
  }

  splitGroup(combatRow: CombatRow): void {
    this.notificationService.info('Split Group Not Implemented Yet');
  }

  refreshCreature(combatCreature: CombatCreature): void {
    this.loading = true;
    this.creatureService.getCreature(combatCreature.battleCreature.creature.id).then((creature: Creature) => {
      combatCreature.battleCreature.creature = creature;
      this.continueRefreshCreature(combatCreature).then(() => {
        this.loading = false;
      }, () => {
        this.loading = false;
        this.notificationService.error('Encounter.EncounterCreature.Refresh.Error')
      });
    }, () => {
      this.loading = false;
      this.notificationService.error('Encounter.EncounterCreature.Refresh.Error')
    });
  }

  private async continueRefreshCreature(combatCreature: CombatCreature): Promise<void> {
    switch (combatCreature.battleCreature.encounterCreatureType) {
      case EncounterCreatureType.CHARACTER:
        await this.initializeCharacter(combatCreature);
        break;
      case EncounterCreatureType.MONSTER:
        await this.initializeMonster(combatCreature);
        break;
    }
    combatCreature.currentHp = combatCreature.battleCreature.creature.creatureHealth.currentHp + combatCreature.battleCreature.creature.creatureHealth.tempHp;
    combatCreature.initializeStatuses();
    combatCreature.combatRow.updateAll();
    this.updateCombatCreature(combatCreature);
    this.eventsService.dispatchEvent(EVENTS.Encounter.HpChange + combatCreature.combatRow.id);
    this.eventsService.dispatchEvent(EVENTS.Encounter.CreatureRefresh);
  }

  /****************************** Context Menu ******************************/

  private quickReferences(): void {
    this.notificationService.info('Quick References Not Implemented Yet');
  }

  private rollLog(): void {
    this.notificationService.info('Roll Log Not Implemented Yet');
  }

  notifications(): void {
    this.notificationService.info('Notifications Not Implemented Yet');
  }

  attack(): void {
    this.notificationService.info('Attack Not Implemented Yet');
  }

  roll(): void {
    this.notificationService.info('Roll Not Implemented Yet');
  }

  private addCreatures(): void {
    this.addingCreatures = true;
  }

  private reorderInitiative(): void {
    this.reorderingInitiative = true;
  }

  cancelReorder(): void {
    this.reorderingInitiative = false;
  }

  saveInitiativeOrder(): void {
    this.reorderingInitiative = false;
    this.updateList();
  }

  speedTypeClick(combatCreature: CombatCreature): void {
    this.viewingSpeedCreature = combatCreature;
  }

  cancelSpeed(): void {
    this.viewingSpeedCreature = null;
  }

  saveSpeed(): void {
    this.viewingSpeedCreature = null;
  }

  private restartEncounter(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Restart.Title');
    data.message = this.translate.instant('Encounter.Restart.Message');
    data.confirm = () => {
      self.continueRestartEncounter();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueRestartEncounter(): void {
    this.loading = true;
    this.currentRow = null;
    this.encounterService.restartEncounter(this.encounter.id).then(() => {
      this.encounterService.getEncounter(this.encounter.id).then((encounter: Encounter) => {
        this.encounter = encounter;
        this.updateList();
      }, () => {
        this.errorLoading();
      });
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Restart.Error'));
    });
  }

  private pauseEncounter(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Pause.Title');
    data.message = this.translate.instant('Encounter.Pause.Message');
    data.confirm = () => {
      self.continuePause();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continuePause(): void {
    this.navigateToCampaign();
  }

  private finishEncounter(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Finish.Title');
    data.message = this.translate.instant('Encounter.Finish.Message');
    data.confirm = () => {
      self.continueFinishEncounter();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueFinishEncounter(): void {
    this.loading = true;
    this.encounterService.finishEncounter(this.encounter.id).then(() => {
      this.loading = false;
      //todo - show prompt to assign exp earned
      this.navigateToCampaign();
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Finish.Error'));
    });
  }

  private navigateToCampaign(): void {
    this.router.navigate(['/home/dashboard', {outlets: {
        'middle-nav': ['campaigns', this.encounter.campaignId],
        'side-nav': ['campaigns', this.encounter.campaignId]
      }}], {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': false, 'shared': false}});
  }

  /****************************** Initialize Turns ******************************/

  private updateList(): void {
    this.loading = true;
    this.round = this.encounter.currentRound;
    this.turn = this.encounter.currentTurn;

    // clearing out to save memory
    this.combatRows = [];

    this.encounterService.getBattleCreatures(this.encounter.id).then((battleCreatures: BattleCreature[]) => {
      this.initializeCombatRows(battleCreatures).then(() => {
        this.loading = false;
      }, () => {
        this.errorLoading();
      });
    }, () => {
      this.errorLoading();
    });
  }

  private initializeCharacter(combatCreature: CombatCreature): Promise<any> {
    const playerCharacter = combatCreature.battleCreature.creature as PlayerCharacter;
    const collection = _.cloneDeep(this.defaultCreatureCollection);
    combatCreature.collection = collection;

    this.characterService.addCharacterToCollection(playerCharacter, collection);
    return this.characterService.initializeCharacteristics(playerCharacter, collection).then(() => {
      combatCreature.maxHp = this.characterService.getMaxHp(playerCharacter, collection, true);
      combatCreature.ac = this.characterService.getAC(playerCharacter, collection);

      combatCreature.speedType = combatCreature.battleCreature.speedToDisplay;
      if (this.creatureService.isProne(playerCharacter)) {
        combatCreature.speedType = SpeedType.CRAWL;
      }
      const speedConfig = this.characterService.getSpeedConfiguration(playerCharacter, collection, combatCreature.speedType, playerCharacter.characterSettings.speed);
      combatCreature.speed = this.characterService.getSpeed(speedConfig);
    });
  }

  private initializeMonster(combatCreature: CombatCreature): Promise<any> {
    const battleMonster = combatCreature.battleCreature.creature as BattleMonster;
    const collection = _.cloneDeep(this.defaultCreatureCollection);
    combatCreature.collection = collection;

    return this.monsterService.getMonster(battleMonster.monsterId).then((monster: Monster) => {
      battleMonster.monster = monster;
      return this.monsterService.initializeConfigurationCollection(monster).then((monsterCollection: MonsterConfigurationCollection) => {
        const inheritedFrom = new InheritedFrom(monster.id, monster.name, null, true);
        this.monsterService.addMonsterToCollection(monsterCollection, collection, inheritedFrom, monster);
        this.creatureService.addCreatureToCollection(battleMonster, collection);
        this.setMaxSpellSlots(battleMonster);

        combatCreature.maxHp = this.monsterService.getMaxHP(battleMonster, combatCreature.collection);
        combatCreature.ac = this.monsterService.getAC(battleMonster, combatCreature.collection);

        combatCreature.speedType = combatCreature.battleCreature.speedToDisplay;
        if (this.creatureService.isProne(battleMonster)) {
          combatCreature.speedType = SpeedType.CRAWL;
        }
        const speedConfig = this.monsterService.getSpeedConfiguration(battleMonster, combatCreature.collection, combatCreature.speedType, battleMonster.settings.speed);
        combatCreature.speed = this.monsterService.getSpeed(speedConfig);
      });
    });
  }

  private setMaxSpellSlots(battleMonster: BattleMonster): void {
    if (battleMonster.monster != null && battleMonster.monster.spellSlots != null) {
      battleMonster.creatureSpellCasting.spellSlots[0].calculatedMax = battleMonster.monster.spellSlots.slot1;
      battleMonster.creatureSpellCasting.spellSlots[1].calculatedMax = battleMonster.monster.spellSlots.slot2;
      battleMonster.creatureSpellCasting.spellSlots[2].calculatedMax = battleMonster.monster.spellSlots.slot3;
      battleMonster.creatureSpellCasting.spellSlots[3].calculatedMax = battleMonster.monster.spellSlots.slot4;
      battleMonster.creatureSpellCasting.spellSlots[4].calculatedMax = battleMonster.monster.spellSlots.slot5;
      battleMonster.creatureSpellCasting.spellSlots[5].calculatedMax = battleMonster.monster.spellSlots.slot6;
      battleMonster.creatureSpellCasting.spellSlots[6].calculatedMax = battleMonster.monster.spellSlots.slot7;
      battleMonster.creatureSpellCasting.spellSlots[7].calculatedMax = battleMonster.monster.spellSlots.slot8;
      battleMonster.creatureSpellCasting.spellSlots[8].calculatedMax = battleMonster.monster.spellSlots.slot9;
    }
  }

  private async initializeCombatRows(battleCreatures: BattleCreature[]): Promise<void> {
    const map = new Map<string, CombatRow>();
    const combatRows: CombatRow[] = [];

    let round = this.encounter.currentRound;
    let turn = this.encounter.currentTurn;
    const numCreatures = battleCreatures.length;

    for (let i = 0; i < numCreatures; i++) {
      const battleCreature = battleCreatures[turn - 1];
      if (battleCreature.groupedInitiative) {
        const id = battleCreature.groupId;
        let combatRow = map.get(id);
        if (combatRow == null) {
          combatRow = new CombatRow();
          combatRows.push(combatRow);
          map.set(id, combatRow);
        }
        combatRow.combatCreatures.push(new CombatCreature(battleCreature, round, turn));
      } else {
        const combatRow = new CombatRow();
        combatRow.combatCreatures.push(new CombatCreature(battleCreature, round, turn));
        combatRows.push(combatRow);
      }
      turn++;
      if (turn === numCreatures + 1) {
        turn = 1;
        round++;
        combatRows.push(this.generateLabelCombatRow(round));
      }
    }

    await this.updateCombatRows(combatRows);
    this.combatRows = combatRows;
    if (this.currentRow != null) { //from a list refresh
      this.currentRow = this.findNewCombatRow(this.currentRow);
      if (this.currentRow == null) {
        this.currentRow = this.combatRows[0];
      } else {
        const currentIndex = this.combatRows.indexOf(this.currentRow);
        if (currentIndex !== 0) {
          // shift elements
          for (let i = 0; i < currentIndex; i++) {
            const combatRow = this.combatRows[0];
            this.shiftCombatRowToEnd(combatRow);
          }
        }
      }
    } else {
      this.currentRow = this.combatRows[0];
    }
    this.linkCombatRows();

    this.verifyTurn();
    this.updateHidden();
    this.hideLabelAtEnd();
    this.updateRoundTurn(true);
    this.setPreviousEnabled();
    this.setNoCreaturesVisible();

    if (!this.isCombatRowValidForRound(this.currentRow)) {
      this.next(this.currentRow);
    } else {
      this.setSelected(this.currentRow);
    }
  }

  private findNewCombatRow(oldCombatRow: CombatRow): CombatRow {
    return _.find(this.combatRows, (combatRow: CombatRow) => {
      return combatRow.id === oldCombatRow.id;
    });
  }

  private async updateCombatRows(combatRows: CombatRow[]): Promise<void> {
    for (const combatRow of combatRows) {
      for (const combatCreature of combatRow.combatCreatures) {
        combatCreature.combatRow = combatRow;
        switch (combatCreature.battleCreature.encounterCreatureType) {
          case EncounterCreatureType.CHARACTER:
            await this.initializeCharacter(combatCreature);
            break;
          case EncounterCreatureType.MONSTER:
            await this.initializeMonster(combatCreature);
            break;
        }
      }
      combatRow.combatCreatures.sort((left: CombatCreature, right: CombatCreature) => {
        return left.battleCreature.creatureNumber - right.battleCreature.creatureNumber;
      });
      combatRow.updateAll();
    }
  }

  private generateLabelCombatRow(round: number): CombatRow {
    const combatRow = new CombatRow();
    combatRow.displayName = this.translate.instant('Round', { 'round': round });
    combatRow.round = round;
    combatRow.labelRow = true;
    return combatRow;
  }

  private linkCombatRows(): void {
    for (let i = 0; i < this.combatRows.length; i++) {
      const combatRow = this.combatRows[i];
      //set next
      if (i < this.combatRows.length - 1) { //not the last row
        combatRow.nextRow = this.combatRows[i + 1];
      } else {
        combatRow.nextRow = this.combatRows[0];
      }

      //set previous
      if (i > 0) { //not the first row
        combatRow.previousRow = this.combatRows[i - 1];
      } else {
        combatRow.previousRow = this.combatRows[this.combatRows.length - 1];
      }
    }
  }

  /****************************** Turn Management ******************************/

  private shiftCombatRowToEnd(combatRow: CombatRow): void {
    this.combatRows.splice(0, 1);
    this.combatRows.push(combatRow);
  }

  private shiftCombatRowToBeginning(combatRow: CombatRow): void {
    this.combatRows.splice(this.combatRows.length - 1, 1);
    this.combatRows.splice(0, 0, combatRow);
  }

  private next(originalRow: CombatRow): void {
    const turnsCount = this.currentRow.labelRow ? 1 : this.currentRow.combatCreatures.length;
    this.shiftCombatRowToEnd(this.currentRow);
    this.endTurn(this.currentRow);
    this.currentRow.setRound(this.currentRow.round + 1);
    this.updateRowHidden(this.currentRow, true);

    const nextRow = this.currentRow.nextRow;
    this.currentRow = nextRow;
    this.turn += turnsCount;
    this.startTurn(nextRow);

    if (nextRow.labelRow) {
      this.turn = 0;
      this.round++;
      nextRow.display = true;
      this.next(originalRow);
    } else {
      if (nextRow === originalRow) {
        // looped through an entire turn
        nextRow.setRound(this.round);
        this.updateStates();
        this.previousCount--;
        if (this.previousCount < 0) {
          this.previousCount = 0;
        }
        return;
      }
      if (!this.validForRound(nextRow, this.round)) {
        this.next(originalRow);
      } else {
        this.previousCount--;
        if (this.previousCount < 0) {
          this.previousCount = 0;
        }
        this.updateStates();
      }
    }
  }

  private previous(originalRow: CombatRow): void {
    const previousRow = this.currentRow.previousRow;
    const turnsCount = previousRow.labelRow ? 1 : previousRow.combatCreatures.length;
    this.shiftCombatRowToBeginning(previousRow);

    this.currentRow = previousRow;
    this.turn -= turnsCount;

    if (previousRow.labelRow) {
      this.turn = this.getTotalCreatures() + 1;
      this.round--;
      if (this.round === 0) {
        this.round = 1;
        this.turn = originalRow.turn;
        this.updateStates();
        return;
      }
      previousRow.setRound(this.round + 1);
      previousRow.display = true;
      this.previous(originalRow);
    } else {
      previousRow.setRound(this.round);
      this.updateRowHidden(previousRow, true);
      if (previousRow === originalRow) {
        // looped through an entire turn
        this.updateStates();
        this.previousCount++;
        return;
      }
      if (!this.validForRound(previousRow, this.round)) {
        this.previous(originalRow);
      } else {
        this.previousCount++;
        this.updateStates();
      }
    }
  }

  private startTurn(combatRow: CombatRow): void {
    if (this.previousCount === 0 && combatRow != null && !combatRow.isRemoved()) {
      let notifications: string[] = [];
      // List<String> notifications = creature.startTurnConditions(db);
      // List<String> moreNotifications = updateCreaturesConditions(creature, CreatureTurnType.START_OF_NEXT_TURN, db);
      notifications = notifications.concat(this.startTurnActions(combatRow));
      notifications = notifications.concat(this.startTurnFeatures(combatRow));
      notifications = notifications.concat(this.resetLegendaryPoints(combatRow));
      // if (creature.isReactionUsed()) {
      //   creature.setReactionUsed(false);
      //   RunningBattleCreaturesTable.setReactionUsed(db, creature.getId(), false);
      // }
      // if (creature.isActionReadied()) {
      //   creature.setActionReadied(false);
      //   RunningBattleCreaturesTable.setActionReadied(db, creature.getId(), false);
      // }
      this.updateNotifications(notifications);
    }
  }

  private resetLegendaryPoints(combatRow: CombatRow): string[] {
    const notifications: string[] = [];
    combatRow.combatCreatures.forEach((combatCreature: CombatCreature) => {
      if (combatCreature.battleCreature.creature.creatureType === CreatureType.MONSTER) {
        const battleMonster = combatCreature.battleCreature.creature as BattleMonster;
        if (battleMonster.legendaryPoints < battleMonster.maxLegendaryPoints && battleMonster.maxLegendaryPoints > 0) {
          this.monsterService.resetLegendaryPoints(battleMonster);
          notifications.push(this.translate.instant('Encounter.LegendaryPoints.Reset', {name: combatCreature.getDisplayName(), max: battleMonster.maxLegendaryPoints}));
        }
      }
    });
    return notifications;
  }

  private startTurnActions(combatRow: CombatRow): string[] {
    let notifications: string[] = [];
    combatRow.combatCreatures.forEach((combatCreature: CombatCreature) => {
      if (combatCreature.battleCreature.creature.creatureType === CreatureType.MONSTER) {
        const battleMonster = combatCreature.battleCreature.creature as BattleMonster;
        notifications = notifications.concat(this.rechargePowers(battleMonster, battleMonster.actions));
      }
    });
    return notifications;
  }

  private rechargePowers(battleMonster: BattleMonster, powers: BattleMonsterPower[]): string[] {
    const notifications: string[] = [];
    const resetPowers: CreaturePower[] = [];
    powers.forEach((power: BattleMonsterPower) => {
      const isRecharge = power.rechargeMin > 0 && power.rechargeMax > 0;
      if (isRecharge && power.usesRemaining === 0) {
        const roll = this.diceService.roll(this.getRechargeRollRequest(power.powerName, power.rechargeMax));
        if (roll.totalResult >= power.rechargeMin) {
          notifications.push(this.translate.instant('Encounter.Recharge.Success', {name: power.powerName, roll: roll.totalResult}));
          resetPowers.push(power);
        } else {
          notifications.push(this.translate.instant('Encounter.Recharge.Fail', {name: power.powerName, roll: roll.totalResult}));
        }
      }
    });
    if (resetPowers.length > 0) {
      this.monsterService.resetPowerLimitedUses(powers, battleMonster);
    }
    return notifications;
  }

  private startTurnFeatures(combatRow: CombatRow): string[] {
    let notifications: string[] = [];
    combatRow.combatCreatures.forEach((combatCreature: CombatCreature) => {
      if (combatCreature.battleCreature.creature.creatureType === CreatureType.MONSTER) {
        const battleMonster = combatCreature.battleCreature.creature as BattleMonster;
        notifications = notifications.concat(this.rechargePowers(battleMonster, battleMonster.features));
      }
    });
    return notifications;
  }

  private getRechargeRollRequest(powerName: string, rechargeMax: number): RollRequest {
    const rollRequest = this.diceService.getRollRequest(
      RollType.STANDARD,
      powerName + ' - recharge',
      null,
      0,
      false,
      false,
      false
    );
    rollRequest.diceCollections[0].max = rechargeMax;
    return rollRequest;
  }

  private endTurn(combatRow: CombatRow): void {
    if (this.previousCount === 0 && combatRow != null && !combatRow.isRemoved()) {
      // SQLiteDatabase db = CombatActivity.getContext().getDB();
      // List<String> notifications = creature.endTurnConditions(db, context);
      // List<String> moreNotifications = updateCreaturesConditions(creature, CreatureTurnType.END_OF_NEXT_TURN, db);
      // updateNotifications(notifications);
    }
  }

  delayTurn(combatRow: CombatRow): void {
    //todo
    this.notificationService.info('Delay Turn Not Implemented Yet');
  }

  // private delayTurn(targetCreatureId: string): void {
  //   const targetRow = this.findCombatRow(targetCreatureId);
  //   if (targetRow == null) {
  //     return;
  //   }
  //
  //   //update creatures between current creature and target creature
  //   const creaturesBetween: InitiativeCreature[] = this.getCreaturesBetween(this.selectedRow, targetRow);
  //   for (let i = 0; i < creaturesBetween.length; i++) {
  //     const creature = creaturesBetween[i];
  //     // RunningBattleCreaturesTable.updateOrder(db, creature.getId(), creature.getOrder() - 1);
  //   }
  //
  //   //update target creature
  //   const targetCreature = targetRow.initiativeCreature;
  //   // RunningBattleCreaturesTable.updateOrder(db, targetCreature.getId(), targetCreature.getOrder() - 1);
  //
  //   //update current creature
  //   const numTurnsDelayed = creaturesBetween.length + 1;
  //   const currentCreature = this.selectedRow.initiativeCreature;
  //   // RunningBattleCreaturesTable.updateOrder(db, currentCreature.getId(), currentCreature.getOrder() + numTurnsDelayed);
  //
  //   this.updateList();
  // }

  // private canDelay(creature: InitiativeCreature): boolean {
  //   if (creature == null) {
  //     return false;
  //   }
  //   const combatRow = this.findCombatRow(creature.battleCreature.id);
  //   return combatRow != null && combatRow.round === this.round && this.getCreaturesAfterRow(combatRow).length > 0;
  // }

  private nextTurnIfNotValid(): void {
    if (!this.noCreaturesVisible && !this.validForRound(this.currentRow, this.currentRow.round)) {
      this.next(this.currentRow);
    }
  }

  private checkForRemainingMonsters(): void {
    if (this.promptForNoMonsters && !this.monstersRemaining()) {
      this.promptForNoMonsters = false;
      const self = this;
      const data = new ConfirmDialogData();
      data.title = this.translate.instant('Encounter.NoMonstersRemaining.Title');
      data.message = this.translate.instant('Encounter.NoMonstersRemaining.Message');
      data.confirm = () => {
        self.continueFinishEncounter();
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    }
  }

  private scrollToInitiativeCreature(combatRow: CombatRow): void {
    setTimeout(() => {
      const el: HTMLElement = document.getElementById(combatRow.id);
      if (el != null) {
        el.scrollIntoView({behavior: 'smooth'});
      }
    }, 500);
  }

  /****************************** Turn Visibility ******************************/

  private updateCombatCreature(combatCreature: CombatCreature): void {
    this.updateCombatCreatureHidden(combatCreature);
    combatCreature.combatRow.updateDisplayName();
    combatCreature.combatRow.updateMaxHp();
    if (combatCreature.selected && !combatCreature.display) {
      combatCreature.setSelected(false);
      combatCreature.combatRow.updateDefaultSelected();
    }
    this.updateSelection();
    this.hideLabelAtEnd();
    this.nextTurnIfNotValid();
    this.checkForRemainingMonsters();
    this.setPreviousEnabled();
    this.setNoCreaturesVisible();
    this.updateRoundTurn(true);
  }

  private updateHidden(): void {
    this.combatRows.forEach((combatRow: CombatRow) => {
      this.updateRowHidden(combatRow, true);
    });
    this.updateDisplayNames();
  }

  private updateRowHidden(combatRow: CombatRow, updateChildren: boolean = false): void {
    if (!combatRow.labelRow) {
      if (updateChildren) {
        combatRow.combatCreatures.forEach((combatCreature: CombatCreature) => {
          combatCreature.display = this.isCombatCreatureValidForRound(combatCreature);
        });
      }
      combatRow.updateStatuses();
      combatRow.updateCurrentHp();
      combatRow.updateMaxHp();
      combatRow.display = this.isCombatRowValidForRound(combatRow);
    }
  }

  private updateCombatCreatureHidden(combatCreature: CombatCreature): void {
    combatCreature.display = this.isCombatCreatureValidForRound(combatCreature);
    this.updateRowHidden(combatCreature.combatRow);
  }

  private updateDisplayNames(): void {
    this.combatRows.forEach((combatRow: CombatRow) => {
      combatRow.updateDisplayName();
    });
  }

  private getLastDisplayedRow(): CombatRow {
    let previousRow = this.currentRow.previousRow;
    while (previousRow !== this.currentRow && !previousRow.labelRow && !this.isCombatRowValidForRound(previousRow)) {
      previousRow = previousRow.previousRow;
    }
    if (previousRow === this.currentRow) { //went through the entire loop
      return null;
    }
    return previousRow;
  }

  /****************************** Valid Checks ******************************/

  private isCombatRowValidForRound(combatRow: CombatRow): boolean {
    return this.validForRound(combatRow, combatRow.round);
  }

  private validForRound(combatRow: CombatRow, round: number): boolean {
    return !combatRow.isRemoved() && (!this.hideKilled || !combatRow.dead) && combatRow.getMinimumRoundAdded() <= round;
  }

  private isCombatCreatureValidForRound(combatCreature: CombatCreature): boolean {
    return this.combatCreatureValidForRound(combatCreature, combatCreature.round);
  }

  private combatCreatureValidForRound(combatCreature: CombatCreature, round: number): boolean {
    return !combatCreature.isRemoved() && (!this.hideKilled || !combatCreature.dead) && combatCreature.getRoundAdded() <= round;
  }

  private hasValidCreaturesForCurrentRound(): boolean {
    return this.hasValidCreaturesForRound(this.round);
  }

  private hasValidCreaturesForRound(round: number): boolean {
    for (let i = 0; i < this.combatRows.length; i++) {
      if (this.validForRound(this.combatRows[i], round)) {
        return true;
      }
    }
    return false;
  }

  private getNumValidCreaturesForRound(round: number): number {
    let numCreatures = 0;
    this.combatRows.forEach((combatRow: CombatRow) => {
      numCreatures += this.getNumValidCombatCreaturesForRound(round, combatRow);
    });
    return numCreatures;
  }

  private getNumValidCombatCreaturesForRound(round: number, combatRow: CombatRow): number {
    let numCreatures = 0;
    combatRow.combatCreatures.forEach((combatCreature: CombatCreature) => {
      if (this.combatCreatureValidForRound(combatCreature, round)) {
        numCreatures++;
      }
    });
    return numCreatures;
  }

  private getTotalCreatures(): number {
    let numCreatures = 0;
    this.combatRows.forEach((combatRow: CombatRow) => {
      numCreatures += combatRow.combatCreatures.length;
    });
    return numCreatures;
  }

  /****************************** Finding / Listing ******************************/

  // private findCombatRow(battleCreatureId: string): CombatRow {
  //   return _.find(this.combatRows, (combatRow) => {
  //     return combatRow.getBattleCreatureId() === battleCreatureId;
  //   });
  // }

  // private findInitiativeCreature(battleCreatureId: string): InitiativeCreature {
  //   return _.find(this.initiativeCreatures, (initiativeCreature) => {
  //     return initiativeCreature.getBattleCreatureId() === battleCreatureId;
  //   });
  // }

  private getLabelRow(): CombatRow {
    return _.find(this.combatRows, (combatRow) => {
      return combatRow.labelRow;
    });
  }

  // private getCreaturesAfterRow(startingRow: CombatRow): ListObject[] {
  //   const creatures: ListObject[] = [];
  //   let nextRow = startingRow.nextRow;
  //   while (nextRow.initiativeCreature != null) {
  //     const creature = nextRow.initiativeCreature;
  //     if (!creature.isRemoved() && (!this.hideKilled || !creature.isDead())) {
  //       creatures.push(new ListObject(creature.battleCreature.id, creature.battleCreature.creature.name));
  //     }
  //     nextRow = nextRow.nextRow;
  //   }
  //   return creatures;
  // }

  // private getCreaturesBetween(currentRow: CombatRow, targetRow: CombatRow): InitiativeCreature[] {
  //   const creatures: InitiativeCreature[] = [];
  //   let temp = currentRow;
  //   while (temp.nextRow !== targetRow) {
  //     const nextRow = temp.nextRow;
  //     if (nextRow.initiativeCreature == null) {
  //       break;
  //     }
  //     creatures.push(nextRow.initiativeCreature);
  //     temp = nextRow;
  //   }
  //   return creatures;
  // }

  private monstersRemaining(): boolean {
    for (let i = 0; i < this.combatRows.length; i++) {
      const combatRow = this.combatRows[i];
      if (combatRow.monster && !combatRow.dead && !combatRow.isRemoved()) {
        return true;
      }
    }
    return false;
  }

  private getFirstValidTurn(round: number): number {
    let combatRow = this.getCombatRowByTurn(1);
    const originalRow = combatRow;
    while (true) {
      if (this.validForRound(combatRow, round)) {
        return combatRow.turn;
      }
      combatRow = combatRow.nextRow;
      if (combatRow.id === originalRow.id) {
        return 0;
      }
    }
  }

  /****************************** State Management ******************************/

  private updateStates(save: boolean = true): void {
    this.verifyTurn();
    this.updateHidden();
    this.hideLabelAtEnd();
    this.updateRoundTurn(save);
    this.setPreviousEnabled();
    this.setNoCreaturesVisible();
    this.setSelected(this.currentRow);
  }

  private verifyTurn(): void {
    if (this.currentRow != null) {
      if (this.turn !== this.currentRow.turn) {
        // this can happen when we add more monsters to a grouped initiative combat row
        this.turn = this.currentRow.turn;
      }
    }
  }

  private hideLabelAtEnd(): void {
    const lastDisplayed = this.getLastDisplayedRow();
    if (lastDisplayed != null && lastDisplayed.labelRow) {
      lastDisplayed.display = false;
    } else {
      const labelRow = this.getLabelRow();
      if (labelRow != null) {
        labelRow.display = true;
      }
    }
  }

  private updateRoundTurn(save: boolean): void {
    if (this.round < 1) {
      this.round = 1;
    }
    if (this.turn < 1) {
      this.turn = 1;
    }
    this.encounter.currentRound = this.round;
    this.encounter.currentTurn = this.turn;
    this.displayTurn = this.getDisplayTurn();
    this.turnTooltip = this.getTurnTooltip();
    if (save) {
      this.encounterService.updateRoundTurn(this.encounter.id, this.round, this.turn);
    }
  }

  private getCombatRowByTurn(turn: number): CombatRow {
    return _.find(this.combatRows, (combatRow: CombatRow) => {
      return combatRow.turn === turn;
    });
  }

  private getDisplayTurn(): number {
    let combatRow = this.getCombatRowByTurn(1);
    if (combatRow == null || !this.hasValidCreaturesForCurrentRound()) {
      return 1;
    }

    let displayTurn = 0;
    let temp = 0;
    let index = 0;
    while (temp < this.turn) {
      if (this.validForRound(combatRow, this.round)) {
        displayTurn++;
      }
      temp += combatRow.combatCreatures.length;
      index++;
      combatRow = combatRow.nextRow;
    }
    return displayTurn;
  }

  private getTurnTooltip(): string {
    return this.translate.instant('Encounter.RoundTurn', { round: this.round, turn: this.displayTurn});
  }

  private setPreviousEnabled(): void {
    this.previousEnabled = this.round !== 1 || (this.turn > this.getFirstValidTurn(this.round) && this.getNumValidCreaturesForRound(this.round) > 0);
  }

  private setNoCreaturesVisible(): void {
    this.noCreaturesVisible = this.getNumValidCreaturesForRound(this.round) === 0;
  }

  /****************************** ??? ******************************/

  updateNotifications(notifications: string[]): void {
    // CombatActivity.getContext().updateNotifications(notifications);
  }

  // public void applyDamages(List<AppliedDamages> appliedDamagesList, boolean healing){
  //   List<String> notifications = new ArrayList<>();
  //   SQLiteDatabase db = CombatActivity.getContext().getDB();
  //   for(int i = 0; i < appliedDamagesList.size(); i++){
  //     AppliedDamages appliedDamages = appliedDamagesList.get(i);
  //     InitiativeCreature creature = appliedDamages.getTarget();
  //     int totalDamage = appliedDamages.getTotalDamage();
  //     boolean kill = appliedDamages.isKill();
  //     if(totalDamage > 0){
  //       List<String> temp;
  //       if(healing) {
  //         temp = creature.applyHealing(totalDamage, db);
  //       } else {
  //         temp = creature.applyDamage(totalDamage, "", db, kill);
  //       }
  //       Util.combineStringLists(notifications, temp);
  //       if(creature.getId() == selectedRow.getCreature().getId()){
  //         updateHealth();
  //         if(kill) {
  //           updateSpeed();
  //           updateConditions();
  //           updateSelection();
  //         }
  //       } else {
  //         InitiativeTurnObject row = getRow(creature.getId());
  //         if(row != null) {
  //           row.setKilled(creature.getKilledStatus() == KilledStatus.KILLED);
  //           updateHidden();
  //         }
  //       }
  //     }
  //
  //   }
  //   updateNotifications(notifications);
  // }

  // canAddCompanion(companion: Companion): boolean {
  //   for (let i = 0; i < this.initiativeCreatures.length; i++) {
  //     const creature = this.initiativeCreatures[i];
  //     if (creature.getCreature().getCreatureType() === CreatureType.COMPANION && creature.getCreature().getId() === companion.getId()) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

}
