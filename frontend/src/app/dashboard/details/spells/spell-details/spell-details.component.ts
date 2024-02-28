import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Spell} from '../../../../shared/models/powers/spell';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ListObject} from '../../../../shared/models/list-object';
import {CharacterLevel} from '../../../../shared/models/character-level';
import {LimitedUse} from '../../../../shared/models/powers/limited-use';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {TranslateService} from '@ngx-translate/core';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Tag} from '../../../../shared/models/tag';
import {SpellListObject} from '../../../../shared/models/powers/spell-list-object';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {PowerService} from '../../../../core/services/powers/power.service';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {Subscription} from 'rxjs';
import {MagicalItemSpellConfiguration} from '../../../../shared/models/items/magical-item-spell-configuration';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {MagicalItem} from '../../../../shared/models/items/magical-item';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import {Companion} from '../../../../shared/models/creatures/companions/companion';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CompanionService} from '../../../../core/services/creatures/companion.service';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-spell-details',
  templateUrl: './spell-details.component.html',
  styleUrls: ['./spell-details.component.scss']
})
export class SpellDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() creatureSpell: CreatureSpell;
  @Input() spellListObject: SpellListObject;
  @Input() magicalItemSpellConfiguration: MagicalItemSpellConfiguration;
  @Input() creatureItem: CreatureItem;
  @Input() spell: Spell;
  @Input() attackModifier: PowerModifier;
  @Input() saveModifier: PowerModifier;
  @Input() creature: Creature;
  @Input() companion: Companion;
  @Input() collection: CreatureConfigurationCollection;
  @Input() detailed = true;
  @Input() showSlots = false;
  @Input() showSlotsRemaining = true;
  @Input() showCharges = false;
  @Input() onDark = true;
  @Input() showHelp = true;
  @Input() slotsRemaining = 0;
  @Output() slotChange = new EventEmitter<number>();
  @Output() damageChange = new EventEmitter<DamageConfigurationCollection>();
  @Output() modifierChange = new EventEmitter<ModifierConfigurationCollection>();
  @Output() chargeChange = new EventEmitter<number>();

  eventSub: Subscription;
  abilities: ListObject[] = [];
  levels: CharacterLevel[] = [];
  limitedUse: LimitedUse = null;
  maxUses = 0;
  usesRemaining = 0;
  damageConfigurationCollection: DamageConfigurationCollection = null;
  slotDamageConfigurationCollection: DamageConfigurationCollection = null;
  modifierConfigurationCollection: ModifierConfigurationCollection = null;
  slotModifierConfigurationCollection: ModifierConfigurationCollection = null;
  characterLevel: CharacterLevel = null;
  active = false;
  innate = false;

  selectedLevel = '';
  components = '';
  duration = '';
  selectedSlot = 0;
  slotDisabled = false;
  slots: number[] = [];
  dontUse = '';

  chargeCost = 0;
  chargesRemaining = 0;

  editingTags = false;

  constructor(
    private translate: TranslateService,
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private monsterService: MonsterService,
    private companionService: CompanionService,
    private spellService: SpellService,
    private eventsService: EventsService,
    private powerService: PowerService,
    private creatureItemService: CreatureItemService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.SpellcastingAbilityChange
        || event === EVENTS.ModifiersUpdated) {
        this.updateSlotDamage();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.initializeAbilities();
    this.initializeLevels();
    this.initializeComponents();
    this.initializeDuration();
    this.initializeSlots();
    this.innate = this.creatureSpell != null && this.creatureSpell.assignedCharacteristic === 'innate';
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'attackModifier' || propName === 'saveModifier') {
          this.initializeLimitedUse();
          this.initializeDamages();
          this.initializeModifiers();
        }
      }
    }
  }

  private initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      this.abilities = abilities;
    });
  }

  private initializeLevels(): void {
    if (this.spell.level === 0) {
      this.selectedLevel = this.translate.instant('Cantrip');
    } else {
      this.selectedLevel = this.spell.level.toString(10);
    }

    this.levels = this.characterLevelService.getLevelsDetailedFromStorage();

    if (this.detailed) {
      this.initializeCharacterLevel();
    }
    this.initializeLimitedUse();
    this.initializeDamages();
    this.initializeModifiers();
  }

  private initializeCharacterLevel(): void {
    if (this.spell == null || (this.creature == null && this.companion == null) || this.collection == null) {
      return;
    }

    this.characterLevel = this.collection.totalLevel;

    if (this.magicalItemSpellConfiguration != null) {
      this.characterLevel = this.magicalItemSpellConfiguration.casterLevel;
    }
  }

  private initializeLimitedUse(): void {
    if (this.spell == null || (this.creature == null && this.companion == null) || this.collection == null || (this.creature != null && this.characterLevel == null)) {
      return;
    }

    if (this.creature != null) {
      this.limitedUse = this.powerService.getPowerLimitedUse(this.spell, this.characterLevel, this.levels);
    } else if (this.companion != null) {
      //todo - get companion limited use
    }
    if (this.limitedUse != null) {
      this.maxUses = this.powerService.getMaxUses(this.limitedUse, this.getAbilityModifier(this.limitedUse.abilityModifier));
      this.usesRemaining = this.creatureSpell == null ? 0 : this.creatureSpell.usesRemaining;
    }
  }

  private initializeDamages(): void {
    if (this.creature != null) {
      if (this.creature.creatureType === CreatureType.CHARACTER) {
        const playerCharacter = this.creature as PlayerCharacter;
        this.damageConfigurationCollection = this.characterService.getPowerDamages(this.spell, playerCharacter, this.characterLevel, this.collection, this.attackModifier, this.saveModifier);
      } else if (this.creature.creatureType === CreatureType.MONSTER) {
        const battleMonster = this.creature as BattleMonster;
        this.damageConfigurationCollection = this.monsterService.getPowerDamages(this.spell, battleMonster, this.collection, this.attackModifier, this.saveModifier);
      }
    } else if (this.companion != null) {
      this.damageConfigurationCollection = this.companionService.getPowerDamages(this.spell, this.companion, this.characterLevel, this.collection, this.attackModifier, this.saveModifier);
    }
    this.updateSlotDamage();
  }

  private initializeModifiers(): void {
    if (this.creature != null) {
      if (this.creature.creatureType === CreatureType.CHARACTER) {
        const playerCharacter = this.creature as PlayerCharacter;
        this.modifierConfigurationCollection = this.characterService.getPowerModifiers(this.spell, playerCharacter, this.characterLevel, this.collection);
      } else if (this.creature.creatureType === CreatureType.MONSTER) {
        this.modifierConfigurationCollection = this.powerService.initializeModifierConfigurations(this.spell);
        // const battleMonster = this.creature as BattleMonster;
        // this.modifierConfigurationCollection = this.monsterService.getPowerModifiers(this.spell, battleMonster, this.collection);
      }
    } else if (this.companion != null) {
      this.modifierConfigurationCollection = this.companionService.getPowerModifiers(this.spell, this.companion, this.collection);
    }
    this.updateSlotModifiers();
  }

  isOther(): boolean {
    return this.spell.rangeType === RangeType.OTHER;
  }

  private getAbilityModifier(abilityId: string): number {
    const ability = this.creatureService.getAbility(abilityId, this.collection);
    if (ability != null) {
      return this.creatureService.getAbilityModifier(ability, this.collection);
    }
    return 0;
  }

  private initializeComponents(): void {
    const values: string[] = [];
    if (this.spell.verbal) {
      values.push('V');
    }
    if (this.spell.somatic) {
      values.push('S');
    }
    if (this.spell.material) {
      values.push('M');
    }
    this.components = values.join(', ');
  }

  private initializeDuration(): void {
    const values: string[] = [];
    if (this.spell.instantaneous) {
      values.push(this.translate.instant('Instantaneous'));
    }
    if (this.spell.concentration) {
      values.push(this.translate.instant('Concentration'));
    }
    if (this.spell.duration.length > 0) {
      values.push(this.spell.duration);
    }
    this.duration = values.join(', ');
  }

  private initializeSlots(): void {
    this.slots = [];

    if (this.magicalItemSpellConfiguration != null) {
      this.slots.push(0);
      if (this.magicalItemSpellConfiguration.allowCastingAtHigherLevel) {
        for (let j = this.magicalItemSpellConfiguration.storedLevel; j <= this.magicalItemSpellConfiguration.maxLevel; j++) {
          this.slots.push(j);
        }
      } else {
        this.slots.push(this.magicalItemSpellConfiguration.storedLevel);
      }
    } else {
      for (let i = 0; i < 10; i++) {
        this.slots.push(i);
      }
    }

    this.dontUse = this.translate.instant('SpellSlots.DontUse');

    if (this.creatureSpell != null && (this.creatureSpell.active || this.creatureSpell.concentrating)) {
      this.selectedSlot = this.creatureSpell.activeLevel;
      this.slotDisabled = true;
    } else if (this.creatureSpell != null && this.creatureSpell.innate) {
      this.selectedSlot = this.creatureSpell.innateSlot;
      this.slotDisabled = true;
    } else if (this.magicalItemSpellConfiguration != null) {
      if (this.magicalItemSpellConfiguration.active || this.magicalItemSpellConfiguration.concentrating) {
        this.selectedSlot = this.magicalItemSpellConfiguration.activeLevel;
      } else {
        this.selectedSlot = this.magicalItemSpellConfiguration.storedLevel;
      }
    } else {
      this.selectedSlot = this.spell.level;
    }
    this.selectedSlotChange(this.selectedSlot);
  }

  selectedSlotChange(selectedSlot: number): void {
    this.updateSlotDamage();
    this.updateSlotModifiers();
    this.updateChargeCost();
    this.slotChange.emit(selectedSlot);
  }

  private updateSlotDamage(): void {
    if (this.damageConfigurationCollection == null || (!this.showSlots && this.magicalItemSpellConfiguration == null)) {
      this.slotDamageConfigurationCollection = this.damageConfigurationCollection;
    } else {
      this.slotDamageConfigurationCollection = this.spellService.getDamageForSelectedLevel(this.damageConfigurationCollection, this.spell.level, this.selectedSlot);
    }

    if (this.magicalItemSpellConfiguration != null && this.slotDamageConfigurationCollection != null && this.creatureItem != null && this.creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = this.creatureItem.item as MagicalItem;
      let spellAttackModifier = 0;
      let spellSaveDC = 0;

      if (this.magicalItemSpellConfiguration.overrideSpellAttackCalculation) {
        spellAttackModifier = this.magicalItemSpellConfiguration.spellAttackModifier;
        spellSaveDC = this.magicalItemSpellConfiguration.spellSaveDC;
      } else {
        //todo - herd - handle companions
        spellAttackModifier = this.creatureItemService.getMagicalItemSpellAttack(magicalItem, this.selectedSlot, this.creature, this.collection);
        spellSaveDC = this.creatureItemService.getMagicalItemSpellSaveDC(magicalItem, this.selectedSlot, this.creature, this.collection);
      }

      if (this.slotDamageConfigurationCollection.attackType === AttackType.ATTACK) {
        this.slotDamageConfigurationCollection.attackMod = spellAttackModifier;
      } else if (this.slotDamageConfigurationCollection.attackType === AttackType.SAVE) {
        this.slotDamageConfigurationCollection.attackMod = spellSaveDC;
      }
    }

    this.damageChange.emit(this.slotDamageConfigurationCollection);
  }

  private updateSlotModifiers(): void {
    if (this.modifierConfigurationCollection == null || !this.showSlots) {
      this.slotModifierConfigurationCollection = this.modifierConfigurationCollection;
    } else {
      this.slotModifierConfigurationCollection = this.spellService.getModifierForSelectedLevel(this.modifierConfigurationCollection, this.spell.level, this.selectedSlot);
    }
    this.modifierChange.emit(this.slotModifierConfigurationCollection);
  }

  private updateChargeCost(): void {
    if (this.showCharges) {
      this.chargeCost = this.getChargeCost();
      this.chargeChange.emit(this.chargeCost);
    }
  }

  private getChargeCost(): number {
    if (this.magicalItemSpellConfiguration == null) {
      return 0;
    }
    let cost = this.magicalItemSpellConfiguration.charges;
    if (this.magicalItemSpellConfiguration.allowCastingAtHigherLevel) {
      const levelsAbove = this.selectedSlot - this.magicalItemSpellConfiguration.storedLevel;
      if (levelsAbove > 0) {
        cost += (levelsAbove * this.magicalItemSpellConfiguration.chargesPerLevelAboveStoredLevel);
      }
    }
    return cost;
  }

  editTags(): void {
    this.editingTags = true;
  }

  closeTags(): void {
    this.editingTags = false;
  }

  saveTags(tags: Tag[]): void {
    if (this.spellListObject != null) {
      this.spellListObject.tags = tags;
    }
    this.eventsService.dispatchEvent(EVENTS.SpellTagsUpdated);
    this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
    this.editingTags = false;
  }
}
