import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {ChosenClass} from '../../../../shared/models/creatures/characters/chosen-class';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Spellcasting} from '../../../../shared/models/spellcasting';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {Filters} from '../../../../core/components/filters/filters';
import {SortType} from '../../../../core/components/sorts/sort-type.enum';
import {Sorts} from '../../../../core/components/sorts/sorts';
import {FilterType} from '../../../../core/components/filters/filter-type.enum';
import {FilterSorts} from '../../../../shared/models/filter-sorts';
import {FilterDataOptionKey} from '../../../../core/components/filters/filter-data-option-key.enum';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';

@Component({
  selector: 'app-creature-spells',
  templateUrl: './creature-spells.component.html',
  styleUrls: ['./creature-spells.component.scss']
})
export class CreatureSpellsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;
  @Input() fromEncounter = false;

  showSpellSlots = true;
  playerCharacter: PlayerCharacter = null;

  eventSub: Subscription;
  queryParamsSub: Subscription;
  isPublic = false;
  isShared = false;
  filters: Filters;
  filterOptions = new Map<FilterDataOptionKey, boolean>();
  sorts: Sorts;

  clickDisabled = false;
  addingSpell = false;
  configuringSpell = false;
  characteristicId: string = null;
  viewingSpell: CreatureSpell = null;
  requiresPreparation = false;

  attackModifiers = new Map<string, PowerModifier>();
  saveModifiers = new Map<string, PowerModifier>();
  preparations = new Map<string, boolean>();

  //viewing spell modifiers
  attackModifier: PowerModifier = null;
  saveModifier: PowerModifier = null;

  viewingInfo = false;
  viewingTags = false;
  viewingConcentration = false;
  viewingSettings = false;
  viewingLimitedUse = false;

  isDesktop = true;
  filterType = FilterType.SPELL;
  sortType = SortType.SPELL;

  constructor(
    private route: ActivatedRoute,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    if (this.creature != null && this.creature.creatureType === CreatureType.CHARACTER) {
      this.playerCharacter = this.creature as PlayerCharacter;
    } else if (this.creature != null && this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      this.showSpellSlots = battleMonster.monster.spellcaster;
    }
    this.filters = this.creatureService.getFilters(this.creature, FilterType.SPELL);
    this.filterOptions.set(FilterDataOptionKey.PREPARED_APPLICABLE, this.isPreparedApplicable());
    this.filterOptions.set(FilterDataOptionKey.ACTIVE_APPLICABLE, true);
    this.filterOptions.set(FilterDataOptionKey.CONCENTRATING_APPLICABLE, true);
    this.sorts = this.creatureService.getSorts(this.creature, SortType.SPELL);
    this.initializePowerModifiers();
    this.initializePreparations();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.SpellcastingAbilityChange
        || event === EVENTS.ModifiersUpdated) {
        this.initializePowerModifiers();
        this.eventsService.dispatchEvent(EVENTS.UpdateSpellcastingDisplay);
        if (this.viewingSpell != null) {
          this.spellClick(this.viewingSpell, true);
        }
      } else if (event === EVENTS.FetchSpellList) {
        this.fetchSpells();
      } else if (event === (EVENTS.MenuAction.AddSpells + this.columnIndex)) {
        this.addSpell(null);
      } else if (event === (EVENTS.MenuAction.SpellTagging + this.columnIndex)) {
        this.tagClick();
      } else if (event === (EVENTS.MenuAction.SpellPreparation + this.columnIndex)) {
        this.infoClick();
      } else if (event === (EVENTS.MenuAction.Concentration + this.columnIndex)) {
        this.concentrationClick();
      } else if (event === (EVENTS.MenuAction.SpellSettings + this.columnIndex)) {
        this.settingsClick();
      } else if (event === (EVENTS.MenuAction.SpellLimitedUse + this.columnIndex)) {
        this.limitedUseClick();
      }
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
      });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  private isPreparedApplicable(): boolean {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      for (let i = 0; i < playerCharacter.classes.length; i++) {
        const chosenClass: ChosenClass = playerCharacter.classes[i];
        if (chosenClass.characterClass.classSpellPreparation.requirePreparation ||
          (chosenClass.subclass != null && chosenClass.subclass.classSpellPreparation.requirePreparation
          )) {
          return true;
        }
      }
    }
    return false;
  }

  private initializePreparations(): void {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
        this.preparations.set(chosenClass.characterClass.id, chosenClass.characterClass.classSpellPreparation.requirePreparation);
      });
      this.characterService.updateHiddenByPrepared(this.creature.creatureSpellCasting.spells, playerCharacter, this.filters, this.collection);
    }
  }

  private initializePowerModifiers(): void {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
        this.initializeClassPowerModifier(chosenClass);
      });
      this.initializeRacePowerModifier(playerCharacter);
      this.initializeBackgroundPowerModifier(playerCharacter);
    }
    this.initializeOtherPowerModifier();
  }

  private initializeClassPowerModifier(chosenClass: ChosenClass): void {
    const ability: CreatureAbilityProficiency = this.characterService.getChosenClassSpellCastingAbility(chosenClass, this.collection);
    this.initializePowerModifier(
      chosenClass.characterClass.id,
      ability,
      chosenClass.spellcastingAttack,
      chosenClass.spellcastingSave
    );
  }

  private initializeRacePowerModifier(playerCharacter: PlayerCharacter): void {
    const ability: CreatureAbilityProficiency = this.characterService.getRaceSpellCastingAbility(playerCharacter.characterRace, this.collection);
    this.initializePowerModifier(
      playerCharacter.characterRace.race.id,
      ability,
      playerCharacter.characterRace.spellcastingAttack,
      playerCharacter.characterRace.spellcastingSave
    );
  }

  private initializeBackgroundPowerModifier(playerCharacter: PlayerCharacter): void {
    if (playerCharacter.characterBackground.background == null) {
      return;
    }

    const ability: CreatureAbilityProficiency = this.characterService.getBackgroundSpellCastingAbility(playerCharacter.characterBackground, this.collection);
    this.initializePowerModifier(
      playerCharacter.characterBackground.background.id,
      ability,
      playerCharacter.characterBackground.spellcastingAttack,
      playerCharacter.characterBackground.spellcastingSave
    );
  }

  private initializeOtherPowerModifier(): void {
    const ability: CreatureAbilityProficiency = this.creatureService.getSpellcastingAbility(this.creature, this.collection);
    this.initializePowerModifier(
      '0',
      ability,
      this.creature.creatureSpellCasting.spellcastingAttack,
      this.creature.creatureSpellCasting.spellcastingSave
    );

    const innateAbility: CreatureAbilityProficiency = this.creatureService.getInnateSpellcastingAbility(this.creature, this.collection);
    this.initializePowerModifier(
      'innate',
      innateAbility,
      this.creature.innateSpellCasting.spellcastingAttack,
      this.creature.innateSpellCasting.spellcastingSave
    );
  }

  private initializePowerModifier(characteristicId: string, ability: CreatureAbilityProficiency, spellcastingAttack: Spellcasting, spellcastingSave: Spellcasting): void {
    const attackModifier = this.creatureService.getSpellModifier(ability, this.collection, spellcastingAttack, AttackType.ATTACK, characteristicId);
    const saveModifier = this.creatureService.getSpellModifier(ability, this.collection, spellcastingSave, AttackType.SAVE, characteristicId);
    this.attackModifiers.set(characteristicId, attackModifier);
    this.saveModifiers.set(characteristicId, saveModifier);
  }

  addSpell(characteristicId: string): void {
    if (!this.clickDisabled && !this.isPublic && !this.isShared) {
      this.characteristicId = characteristicId;
      this.addingSpell = true;
      this.updateClickDisabled();
    }
  }

  spellClick(creatureSpell: CreatureSpell, force: boolean = false): void {
    if (!this.clickDisabled || force) {
      this.attackModifier = this.attackModifiers.get(creatureSpell.assignedCharacteristic);
      this.saveModifier = this.saveModifiers.get(creatureSpell.assignedCharacteristic);
      this.requiresPreparation = this.preparations.get(creatureSpell.assignedCharacteristic) || false;
      this.viewingSpell = creatureSpell;
      this.updateClickDisabled();
    }
  }

  castSpell(creatureSpell: CreatureSpell): void {
    this.closeDetails();
  }

  removeSpell(creatureSpell: CreatureSpell): void {
    this.closeDetails();
  }

  configuringClick(): void {
    this.configuringSpell = true;
    this.updateClickDisabled();
  }

  addSelectedSpells(): void {
    this.addingSpell = false;
    this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
    this.updateClickDisabled();
  }

  spellsListClose(): void {
    this.addingSpell = false;
    this.updateClickDisabled();
  }

  closeDetails(): void {
    this.viewingSpell = null;
    this.configuringSpell = false;
    this.updateClickDisabled();
  }

  prepare(): void {
    // this.closeDetails();
  }

  applyFilters(filters: Filters): void {
    this.creatureService.updateFilters(this.creature, FilterType.SPELL, filters).then(() => {
      this.filters = filters;
      this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
    });
  }

  applySort(sorts: Sorts): void {
    this.creatureService.updateSorts(this.creature, SortType.SPELL, sorts).then(() => {
      this.sorts = sorts;
      this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
    });
  }

  private fetchSpells(): void {
    this.filters = this.creatureService.getFilters(this.creature, FilterType.SPELL);
    this.sorts = this.creatureService.getSorts(this.creature, SortType.SPELL);
    const filterSorts = new FilterSorts(this.filters, this.sorts);
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      this.characterService.getSpells(playerCharacter, filterSorts, this.collection).then((spells: CreatureSpell[]) => {
        this.creature.creatureSpellCasting.spells = spells;
        this.eventsService.dispatchEvent(EVENTS.UpdateSpellList);
      });
    } else {
      this.creatureService.getSpells(this.creature, filterSorts).then((spells: CreatureSpell[]) => {
        this.creature.creatureSpellCasting.spells = spells;
        this.eventsService.dispatchEvent(EVENTS.UpdateSpellList);
      });
    }
  }

  private infoClick(): void {
    this.viewingInfo = true;
    this.updateClickDisabled();
  }

  saveInfo(): void {
    this.eventsService.dispatchEvent(EVENTS.UpdateSpellList);
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  closeInfo(): void {
    this.viewingInfo = false;
    this.updateClickDisabled();
  }

  private tagClick(): void {
    this.viewingTags = true;
    this.updateClickDisabled();
  }

  saveTags(): void {
    this.viewingTags = false;
    this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
    this.updateClickDisabled();
  }

  closeTags(): void {
    this.viewingTags = false;
    this.updateClickDisabled();
  }

  private concentrationClick(): void {
    this.viewingConcentration = true;
    this.updateClickDisabled();
  }

  rollConcentration(): void {
    this.viewingConcentration = false;
    this.updateClickDisabled();
  }

  closeConcentration(): void {
    this.viewingConcentration = false;
    this.updateClickDisabled();
  }

  private settingsClick(): void {
    this.viewingSettings = true;
    this.updateClickDisabled();
  }

  saveSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  closeSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  private limitedUseClick(): void {
    this.viewingLimitedUse = true;
    this.updateClickDisabled();
  }

  saveLimitedUse(): void {
    this.viewingLimitedUse = false;
    this.updateClickDisabled();
  }

  closeLimitedUse(): void {
    this.viewingLimitedUse = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingSpell != null || this.addingSpell || this.viewingInfo || this.viewingTags || this.configuringSpell || this.viewingConcentration || this.viewingSettings || this.viewingLimitedUse;
  }
}
