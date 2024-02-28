import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {PlayerCharacter} from '../../../../../shared/models/creatures/characters/player-character';
import {CompanionType} from '../../../../../shared/models/creatures/companions/companion-type.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ListObject} from '../../../../../shared/models/list-object';
import {MonsterService} from '../../../../../core/services/creatures/monster.service';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {MonsterSummary} from '../../../../../shared/models/creatures/monsters/monster-summary';
import {NotificationService} from '../../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {DetailsValidator} from '../../../../details/details/details-validator';
import {CompanionService} from '../../../../../core/services/creatures/companion.service';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';
import {Ability} from '../../../../../shared/models/attributes/ability.model';
import {CompanionScoreModifier} from '../../../../../shared/models/creatures/companions/companion-score-modifier';
import {EventsService} from '../../../../../core/services/events.service';
import {EVENTS} from '../../../../../constants';
import * as _ from 'lodash';
import {
  InnateSpellConfiguration,
  MonsterAction,
  MonsterFeature
} from '../../../../../shared/models/creatures/monsters/monster';
import {SpellConfiguration} from '../../../../../shared/models/characteristics/spell-configuration';

@Component({
  selector: 'app-character-companion-configure-slide-in',
  templateUrl: './character-companion-configure-slide-in.component.html',
  styleUrls: ['./character-companion-configure-slide-in.component.scss']
})
export class CharacterCompanionConfigureSlideInComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() characterCollection: CreatureConfigurationCollection;
  @Input() companion: Companion;
  @Output() save = new EventEmitter<Companion>();
  @Output() delete = new EventEmitter();
  @Output() cancel = new EventEmitter();

  configuringCompanion: Companion = null;

  editing = false;
  loading = false;
  companionCollection: CreatureConfigurationCollection = new CreatureConfigurationCollection();
  companionTypes: CompanionType[] = [];

  isBeast = false;
  isWildShape = false;
  isSummon = false;

  collection = new CreatureConfigurationCollection();
  selectedMonster: MonsterSummary = null;
  averageHp = 0;
  maxHp = 0;
  hpDisplay = '';
  saveValidator: DetailsValidator;

  headerName = '';
  step = 0;
  companionProf = 0;
  characterProf = 0;

  constructor(
    private abilityService: AbilityService,
    private creatureService: CreatureService,
    private monsterService: MonsterService,
    private companionService: CompanionService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.editing = this.companion.id !== '0';
    this.configuringCompanion = _.cloneDeep(this.companion);
    this.initializeCompanion();
    this.companionService.initializeConfigurationCollection(this.companion, this.characterCollection).then((collection: CreatureConfigurationCollection) => {
      this.companionCollection = collection;
    });
    this.characterProf = this.creatureService.getProfModifier(this.characterCollection);
    this.initializeCompanionTypes();
    this.setStep(0);
    this.updateHp(!this.editing);
    this.companionProf = this.monsterService.getProfBonus(this.companion.monster.challengeRating);

    this.saveValidator = new DetailsValidator();
    const self = this;
    this.saveValidator.validate = () => {
      let valid = true;
      let message = '';
      if (self.configuringCompanion.name === '') {
        valid = false;
        message = self.translate.instant('Error.NameRequired');
      }
      if (self.configuringCompanion.monster == null || self.configuringCompanion.monster.id === '0') {
        valid = false;
        message = self.translate.instant('CompanionConfiguration.Error.MonsterRequired');
      }

      if (!valid && message !== '') {
        self.notificationService.error(message);
      }
      return valid;
    }
  }

  private initializeCompanion(): void {
    if (this.configuringCompanion.id === '0') {
      this.configuringCompanion.abilityScoreModifiers = [];
      const abilities = this.abilityService.getAbilitiesDetailedFromStorage();
      abilities.forEach((ability: Ability) => {
        const abilityScoreModifier = new CompanionScoreModifier();
        abilityScoreModifier.abilityId = ability.id;
        this.configuringCompanion.abilityScoreModifiers.push(abilityScoreModifier);
      });
    }
  }

  private initializeCompanionTypes(): void {
    this.companionTypes = [];
    this.companionTypes.push(CompanionType.BEAST);
    this.companionTypes.push(CompanionType.WILD_SHAPE);
    this.companionTypes.push(CompanionType.SUMMON);
  }

  onSave(): void {
    this.loading = true;
    this.updateCreatureHealth();
    if (this.configuringCompanion.id === '0') {
      this.companionService.create(this.configuringCompanion, this.playerCharacter.id).then((id: string) => {
        const promises = [];
        promises.push(this.monsterService.getActions(this.configuringCompanion.monster.id).then((actions: MonsterAction[]) => {
          if (actions.length === 0) {
            return Promise.resolve();
          }
          return this.companionService.addPowers(actions, this.configuringCompanion, this.collection);
        }));
        promises.push(this.monsterService.getFeatures(this.configuringCompanion.monster.id).then((features: MonsterFeature[]) => {
          if (features.length === 0) {
            return Promise.resolve();
          }
          return this.companionService.addPowers(features, this.configuringCompanion, this.collection);
        }));
        promises.push(this.monsterService.getSpells(this.configuringCompanion.monster.id).then((spells: SpellConfiguration[]) => {
          if (spells.length === 0) {
            return Promise.resolve();
          }
          return this.companionService.addSpells(spells, this.configuringCompanion);
        }));
        promises.push(this.monsterService.getInnateSpells(this.configuringCompanion.monster.id).then((spells: InnateSpellConfiguration[]) => {
          if (spells.length === 0) {
            return Promise.resolve();
          }
          return this.companionService.addInnateSpells(spells, this.configuringCompanion);
        }));

        Promise.all(promises).then(() => {
          this.loading = false;
          this.save.emit(this.configuringCompanion);
        }, () => {
          this.notificationService.error(this.translate.instant('CompanionConfiguration.Error.SaveFailed'))
          this.loading = false;
        });
      }, () => {
        this.notificationService.error(this.translate.instant('CompanionConfiguration.Error.SaveFailed'))
        this.loading = false;
      });
    } else {
      this.companionService.update(this.configuringCompanion).then(() => {
        this.updateCompanion();
        this.loading = false;
        this.save.emit(this.configuringCompanion);
      }, () => {
        this.notificationService.error(this.translate.instant('CompanionConfiguration.Error.SaveFailed'))
        this.loading = false;
      });
    }
  }

  private updateCompanion(): void {
    this.companion.name = this.configuringCompanion.name;
    this.companion.monster = this.configuringCompanion.monster;
    this.companion.companionType = this.configuringCompanion.companionType;
    this.companion.maxHp = this.configuringCompanion.maxHp;
    this.companion.rollOverDamage = this.configuringCompanion.rollOverDamage;
    this.companion.includeCharacterSaves = this.configuringCompanion.includeCharacterSaves;
    this.companion.includeCharacterSkills = this.configuringCompanion.includeCharacterSkills;
    this.companion.abilityScoreModifiers = this.configuringCompanion.abilityScoreModifiers;
    this.companion.creatureHealth = this.configuringCompanion.creatureHealth;
  }

  private updateCreatureHealth(): void {
    if (this.configuringCompanion.id === '0' || this.configuringCompanion.creatureHealth.currentHp > this.configuringCompanion.maxHp) {
      this.configuringCompanion.creatureHealth.currentHp = this.configuringCompanion.maxHp;
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  deleteCompanion(): void {
    this.companionService.delete(this.configuringCompanion).then(() => {
      this.delete.emit(this.configuringCompanion);
    });
  }

  setStep(step: number): void {
    this.step = step;
    switch (this.step) {
      case 0:
        this.headerName = this.translate.instant('CompanionConfiguration.Page.Basic');
        break;
      case 1:
        this.headerName = this.translate.instant('CompanionConfiguration.Page.Scores');
        break;
      case 2:
        this.headerName = this.translate.instant('CompanionConfiguration.Page.Checks');
        break;
    }
  }

  companionTypeChange(companionType: CompanionType): void {
    this.isBeast = companionType === CompanionType.BEAST;
    this.isWildShape = companionType === CompanionType.WILD_SHAPE;
    this.isSummon = companionType === CompanionType.SUMMON;
  }

  monsterChange(selectedMonster: ListObject): void {
    if (selectedMonster == null) {
      this.configuringCompanion.monster = null;
      return;
    }
    if (this.configuringCompanion.monster == null || this.configuringCompanion.monster.id !== selectedMonster.id) {
      this.monsterService.getMonsterSummary(selectedMonster.id).then((monster: MonsterSummary) => {
        this.selectedMonster = monster;
        this.configuringCompanion.monster = monster;
        this.updateHp(true);
        this.eventsService.dispatchEvent(EVENTS.MonsterChanged)
        this.companionProf = this.monsterService.getProfBonus(monster.challengeRating);
      });
    }
  }

  private updateHp(updateMax: boolean): void {
    if (this.configuringCompanion.monster == null) {
      return;
    }
    this.hpDisplay = this.companionService.getHpDisplay(this.configuringCompanion, this.characterCollection);
    this.averageHp = this.companionService.getAverageHp(this.configuringCompanion, this.characterCollection);
    this.maxHp = this.companionService.getMaxHp(this.configuringCompanion, this.characterCollection);
    if (updateMax) {
      this.configuringCompanion.maxHp = this.averageHp;
    }
  }

  rollOverChange(event: MatCheckboxChange): void {
    this.configuringCompanion.rollOverDamage = event.checked;
  }

  includeCharacterSavesChange(event: MatCheckboxChange): void {
    this.configuringCompanion.includeCharacterSaves = event.checked;
  }

  includeCharacterSkillsChange(event: MatCheckboxChange): void {
    this.configuringCompanion.includeCharacterSkills = event.checked;
  }

  // acCharacterProfChange(event: MatCheckboxChange): void {
  //   this.configuringCompanion.acCharactersProf = event.checked;
  // }
}
