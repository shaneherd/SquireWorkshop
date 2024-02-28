import {Injectable} from '@angular/core';
import {Creature} from '../../../shared/models/creatures/creature';
import {
  ImportAbilityModifier,
  ImportAdvantage,
  ImportAlignment,
  ImportBackground,
  ImportBackgroundDetail,
  ImportCharacterClass,
  ImportChosenClassSubclass,
  ImportCondition,
  ImportConditionId,
  ImportCostUnit,
  ImportCreatureSkill,
  ImportCreatureState,
  ImportDamageModifier,
  ImportDamageModifierType,
  ImportEquipment,
  ImportEquipmentObject,
  ImportFeature,
  ImportGender,
  ImportInnateSpell,
  ImportItem,
  ImportItemConfiguration,
  ImportListObject,
  ImportMagicalItem,
  ImportPlayerCharacter,
  ImportQuickAttack,
  ImportQuickAttackFeature,
  ImportQuickAttackSpell,
  ImportQuickAttackWeapon,
  ImportRace,
  ImportSpell,
  ImportSpellTag
} from '../../../shared/imports/import-item';
import {ListObject} from '../../../shared/models/list-object';
import {ImportSharedService} from './import-shared.service';
import {CreatureService} from '../creatures/creature.service';
import {ImportCacheService} from './import-cache.service';
import {CreatureAbilityScore} from '../../../shared/models/creatures/creature-ability-score';
import {CreatureWealthAmount} from '../../../shared/models/creatures/creature-wealth-amount';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import * as _ from 'lodash';
import {DamageModifierType} from '../../../shared/models/characteristics/damage-modifier-type.enum';
import {DamageModifier} from '../../../shared/models/characteristics/damage-modifier';
import {Proficiency, ProficiencyListObject, ProficiencyType} from '../../../shared/models/proficiency';
import {ItemProficiency} from '../../../shared/models/items/item-proficiency';
import {Item} from '../../../shared/models/items/item';
import {Gender} from '../../../shared/models/creatures/characters/gender.enum';
import {CreatureState} from '../../../shared/models/creatures/creature-state.enum';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {CreatureHitDice} from '../../../shared/models/creatures/creature-hit-dice';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {CharacterRace} from '../../../shared/models/creatures/characters/character-race';
import {BackgroundTrait} from '../../../shared/models/characteristics/background-trait';
import {CharacterBackground} from '../../../shared/models/creatures/characters/character-background';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {Spellcasting} from '../../../shared/models/spellcasting';
import {CharacterNote} from '../../../shared/models/creatures/characters/character-note';
import {CharacterNoteCategory} from '../../../shared/models/creatures/characters/character-note-category';
import {HealthGainResult} from '../../../shared/models/creatures/characters/health-gain-result';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {CreatureSpellSlot} from '../../../shared/models/creatures/creature-spell-slot';
import {Tag} from '../../../shared/models/tag';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {CreatureSpellCasting} from '../../../shared/models/creatures/creature-spell-casting';
import {CreatureFeatures} from '../../../shared/models/creatures/creature-features';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {SID} from '../../../constants';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {ImportAttributeService} from './import-attribute.service';
import {AbilityService} from '../attributes/ability.service';
import {ImportCharacteristicService} from './import-characteristic.service';
import {ImportPowerService} from './import-power.service';
import {ImportItemService} from './import-item.service';
import {CharacterLevelService} from '../character-level.service';
import {CharacterService} from '../creatures/character.service';
import {TagList} from '../../../shared/models/tag-list';
import {CreatureFeature} from '../../../shared/models/creatures/creature-feature';
import {FeatureListObject} from '../../../shared/models/powers/feature-list-object';
import {ItemListObject} from '../../../shared/models/items/item-list-object';
import {Feature} from '../../../shared/models/powers/feature';
import {CreatureItemState} from '../../../shared/models/creatures/creature-item-state.enum';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {AddItemResponse} from '../../../shared/models/items/add-item-response';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {CreatureSpell} from '../../../shared/models/creatures/creature-spell';
import {SpellListObject} from '../../../shared/models/powers/spell-list-object';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {PowerTagList} from '../../../shared/models/powers/power-tag-list';
import {PowerTags} from '../../../shared/models/powers/power-tags';
import {CreatureItemService} from '../creatures/creature-item.service';
import {CreatureItemAction} from '../../../shared/models/creatures/creature-item-action.enum';
import {CreatureSpellList} from '../../../shared/models/creatures/creature-spell-list';
import {CreaturePower} from '../../../shared/models/creatures/creature-power';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {ActiveCondition} from '../../../shared/models/creatures/active-condition';
import {CreatureAction} from '../../../shared/models/creatures/creature-action';
import {CreatureActionType} from '../../../shared/models/creatures/creature-action-type.enum';
import {CreatureActions} from '../../../shared/models/creatures/creature-actions';
import {SelectionItem} from '../../../shared/models/items/selection-item';
import {MagicalItemSpellConfiguration} from '../../../shared/models/items/magical-item-spell-configuration';

// this is only used for mapping nested containers
export class ImportEquipmentObjectStashed {
  importEquipmentObject: ImportEquipmentObject;
  creatureItem: CreatureItem;
  nestedItems: ImportEquipmentObjectStashed[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class ImportCreatureService {

  constructor(
    private creatureService: CreatureService,
    private creatureItemService: CreatureItemService,
    private characterService: CharacterService,
    private characteristicService: CharacteristicService,
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private importSharedService: ImportSharedService,
    private importCacheService: ImportCacheService,
    private importAttributeService: ImportAttributeService,
    private importCharacteristicService: ImportCharacteristicService,
    private importPowerService: ImportPowerService,
    private importItemService: ImportItemService
  ) { }

  private processCreature(creature: Creature, importItem: ImportItem): Promise<any> {
    switch (importItem.selectedAction) {
      case 'REPLACE_EXISTING':
        creature.id = importItem.selectedDuplicate.id;
        return this.creatureService.updateCreature(creature).then(() => {
          this.importSharedService.completeItem(importItem, creature.id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      case 'INSERT_AS_NEW':
        return this.creatureService.createCreature(creature).then((id: string) => {
          const cache = this.importCacheService.getCreatures(creature.creatureType);
          if (cache != null) {
            const listObject = new ListObject(id, creature.name);
            cache.push(listObject);
          }
          creature.id = id;
          this.importSharedService.completeItem(importItem, id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      default:
        return Promise.resolve();
    }
  }

  /****************** Player Character *********************/

  getPrioritizedConfigItemsForPlayerCharacter(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Character') {
      return [];
    }
    let configs: ImportItemConfiguration[] = [];
    config.children.forEach((childConfig: ImportItemConfiguration) => {
      switch (childConfig.importItem.type) {
        case 'ArmorType':
          configs = configs.concat(this.importAttributeService.getPrioritizedConfigItemsForArmorType(childConfig));
          break;
        case 'CasterType':
          configs = configs.concat(this.importAttributeService.getPrioritizedConfigItemsForCasterType(childConfig));
          break;
        case 'Condition':
          configs = configs.concat(this.importAttributeService.getPrioritizedConfigItemsForCondition(childConfig));
          break;
        case 'Language':
          configs = configs.concat(this.importAttributeService.getPrioritizedConfigItemsForLanguage(childConfig));
          break;
        case 'Skill':
          configs = configs.concat(this.importAttributeService.getPrioritizedConfigItemsForSkill(childConfig));
          break;
        case 'WeaponProperty':
          configs = configs.concat(this.importAttributeService.getPrioritizedConfigItemsForWeaponProperty(childConfig));
          break;

        case 'Background':
          configs = configs.concat(this.importCharacteristicService.getPrioritizedConfigItemsForBackground(childConfig));
          break;
        case 'CharacterClass':
          configs = configs.concat(this.importCharacteristicService.getPrioritizedConfigItemsForCharacterClass(childConfig));
          break;
        case 'Race':
          configs = configs.concat(this.importCharacteristicService.getPrioritizedConfigItemsForRace(childConfig));
          break;

        case 'Feature':
          configs = configs.concat(this.importPowerService.getPrioritizedConfigItemsForFeature(childConfig));
          break;
        case 'Spell':
          configs = configs.concat(this.importPowerService.getPrioritizedConfigItemsForSpell(childConfig));
          break;

        case 'AmmoCategory':
        case 'Ammo':
        case 'BasicAmmo':
        case 'ArmorCategory':
        case 'Armor':
        case 'BasicArmor':
        case 'ContainerCategory':
        case 'GearCategory':
        case 'Gear':
        case 'MountCategory':
        case 'Mount':
        case 'BasicMount':
        case 'Tool':
        case 'ToolCategory':
        case 'WeaponCategory':
        case 'Weapon':
        case 'BasicWeapon':
        case 'MagicalItem':
        case 'MagicalItemCategory':
        case 'Treasure':
        case 'TreasureCategory':
        case 'Pack':
        case 'PackCategory':
        case 'EmptySlotItem':
          configs = configs.concat(this.importItemService.getPrioritizedConfigItemsForEquipment(childConfig));
          break;
      }
    });
    configs.push(config);
    return configs;
  }

  private getAbilityScore(importAbility: ImportAbilityModifier, abilitySID: number): CreatureAbilityScore {
    const abilityScore = new CreatureAbilityScore();
    abilityScore.ability = this.abilityService.getAbilityBySid(abilitySID);
    abilityScore.value = importAbility.roll;
    abilityScore.miscModifier = importAbility.miscModifier;
    return abilityScore;
  }

  private getCreatureWealthAmount(costUnit: ImportCostUnit, amount: number): CreatureWealthAmount {
    const wealth = new CreatureWealthAmount();
    wealth.costUnit = this.importSharedService.getCostUnit(costUnit);
    wealth.amount = amount;
    return wealth;
  }

  private getConditionName(conditionId: ImportConditionId): string {
    switch (conditionId) {
      case 1:
        return 'Blinded';
      case 2:
        return 'Charmed';
      case 3:
        return 'Deafened';
      case 4:
        return 'Frightened';
      case 5:
        return 'Grappled';
      case 6:
        return 'Incapacitated';
      case 7:
        return 'Invisible';
      case 8:
        return 'Paralyzed';
      case 9:
        return 'Petrified';
      case 10:
        return 'Poisoned';
      case 11:
        return 'Prone';
      case 12:
        return 'Restrained';
      case 13:
        return 'Stunned';
      case 14:
        return 'Unconscious';
      case 15:
        return 'Exhaustion';
    }
    return null;
  }

  private async getConditionImmunities(immunities: ImportConditionId[]): Promise<ListObject[]> {
    const list: ListObject[] = [];
    const cachedConditions: ListObject[] = await this.importCacheService.getAttributesByType(AttributeType.CONDITION);
    if (cachedConditions != null && immunities != null) {
      for (const conditionId of immunities) {
        const conditionName = this.getConditionName(conditionId);
        if (conditionName != null) {
          const condition = _.find(cachedConditions, function(_condition) { return _condition.name.toLowerCase() === conditionName.toLowerCase() });
          if (condition != null) {
            list.push(condition);
          }
        }
      }
    }
    return list;
  }

  private getDamageModifierType(type: ImportDamageModifierType): DamageModifierType {
    switch (type) {
      case 'NORMAL':
        return DamageModifierType.NORMAL;
      case 'RESISTANT':
        return DamageModifierType.RESISTANT;
      case 'IMMUNE':
        return DamageModifierType.IMMUNE;
      case 'VULNERABLE':
        return DamageModifierType.VULNERABLE;
    }
  }

  private async getDamageModifiers(damageModifiers: ImportDamageModifier[]): Promise<DamageModifier[]> {
    const list: DamageModifier[] = [];
    if (damageModifiers != null) {
      await this.importCacheService.getAttributesByType(AttributeType.DAMAGE_TYPE);
      for (const damageModifier of damageModifiers) {
        const modifier = new DamageModifier();
        const damageTypeImportItem = this.importAttributeService.getDamageTypeImportItem(damageModifier.damageType);
        modifier.damageType = this.importAttributeService.getCachedDamageType(damageTypeImportItem);
        modifier.damageModifierType = this.getDamageModifierType(damageModifier.damageModifierType);
        modifier.condition = damageModifier.condition;
        list.push(modifier);
      }
    }
    return list;
  }

  private getItemProficiencyList(proficiencies: Proficiency[]): ItemProficiency[] {
    const list: ItemProficiency[] = [];
    proficiencies.forEach((prof: Proficiency) => {
      const itemProf = new ItemProficiency();
      itemProf.item = new Item();
      itemProf.item.id = prof.attribute.id;
      itemProf.item.name = prof.attribute.name;
      itemProf.proficient = prof.proficient;
      itemProf.miscModifier = prof.miscModifier;
      itemProf.advantage = prof.advantage;
      itemProf.disadvantage = prof.disadvantage;
      itemProf.doubleProf = prof.doubleProf;
      itemProf.halfProf = prof.halfProf;
      itemProf.roundUp = prof.roundUp;
      list.push(itemProf);
    });
    return list;
  }

  private async getAlignment(alignment: ImportAlignment): Promise<ListObject> {
    const cache: ListObject[] = await this.importCacheService.getAttributesByType(AttributeType.ALIGNMENT);
    if (cache != null) {
      return _.find(cache, function(_alignment) { return _alignment.name.toLowerCase() === alignment.toLowerCase() });
    }
    return null;
  }

  private getGender(gender: ImportGender): Gender {
    switch (gender) {
      case 'Male':
        return Gender.MALE;
      case 'Female':
        return Gender.FEMALE;
      case 'Neutral':
      default:
        return Gender.NEUTRAL;
    }
  }

  private async getDeity(deity: string): Promise<ListObject> {
    const cache: ListObject[] = await this.importCacheService.getAttributesByType(AttributeType.DEITY);
    if (cache != null) {
      return _.find(cache, function(cacheItem) { return cacheItem.name.toLowerCase() === deity.toLowerCase() });
    }
    return null;
  }

  private addAbilityScoreIncreases(modified: boolean, sid: number, list: ListObject[]): void {
    if (modified) {
      const ability = this.abilityService.getAbilityBySid(sid);
      list.push(new ListObject(ability.id, ability.name));
    }
  }

  private getSavingThrowProf(savingThrowProfs: ImportListObject[], importAdvantage: ImportAdvantage, misc: number, sid: number): Proficiency {
    const prof = new Proficiency();
    const ability = this.abilityService.getAbilityBySid(sid);
    prof.attribute = new ProficiencyListObject();
    prof.attribute.id = ability.id;
    prof.attribute.name = ability.name;
    prof.attribute.proficiencyType = ProficiencyType.ABILITY;
    prof.proficient = this.isSavingThrowProficient(savingThrowProfs, sid);
    prof.advantage = importAdvantage.advantage;
    prof.disadvantage = importAdvantage.disadvantage;
    prof.miscModifier = misc;
    return prof;
  }

  private isSavingThrowProficient(savingThrowProfs: ImportListObject[], sid: number): boolean {
    const abilityId = this.importSharedService.getAbilityIdBySid(sid);
    const prof = _.find(savingThrowProfs, (_prof: ImportListObject) => { return _prof.id === abilityId; })
    return prof != null;
  }

  private getCreatureState(creatureState: ImportCreatureState): CreatureState {
    switch (creatureState) {
      case 'Conscious':
        return CreatureState.CONSCIOUS;
      case 'Removed':
      case 'Dead':
        return CreatureState.DEAD;
      case 'Unstable':
        return CreatureState.UNSTABLE;
      case 'Unconscious':
      case 'Stable':
        return CreatureState.STABLE;
    }
  }

  private getHitDiceSizeByIndex(index: number): DiceSize {
    switch (index) {
      case 0:
        return DiceSize.FOUR;
      case 1:
        return DiceSize.SIX;
      case 2:
        return DiceSize.EIGHT;
      case 3:
        return DiceSize.TEN;
      case 4:
        return DiceSize.TWELVE;
      case 5:
        return DiceSize.TWENTY;
      case 6:
        return DiceSize.HUNDRED;
    }
    return null;
  }

  private getCreatureHitDice(remaining: number[]): CreatureHitDice[] {
    const hitDice: CreatureHitDice[] = [];
    for (let i = 0; i < remaining.length; i++) {
      const diceSize = this.getHitDiceSizeByIndex(i);
      const quantity = remaining[i];
      if (diceSize != null) {
        const hitDie = new CreatureHitDice();
        hitDie.diceSize = diceSize;
        hitDie.remaining = quantity;
        hitDice.push(hitDie);
      }
    }
    return hitDice;
  }

  private getHealthCalculationType(useMax: boolean, useHalfMax: boolean): HealthCalculationType {
    if (useMax) {
      return HealthCalculationType.MAX;
    } else if (useHalfMax) {
      return HealthCalculationType.AVERAGE;
    } else {
      return HealthCalculationType.ROLL;
    }
  }

  private setProfValue(sid: number, profs: Proficiency[], proficient: boolean = null, miscModifier: number = null, advantage: boolean = null, disadvantage: boolean = null, doubleProf: boolean = null, halfProf: boolean = null, roundUp: boolean = null): void {
    const prof = _.find(profs, function(_prof) { return _prof.attribute.sid === sid });
    if (prof != null) {
      if (proficient != null) {
        prof.proficient = proficient;
      }
      if (miscModifier != null) {
        prof.miscModifier = miscModifier;
      }
      if (advantage != null) {
        prof.advantage = advantage;
      }
      if (disadvantage != null) {
        prof.disadvantage = disadvantage;
      }
      if (doubleProf != null) {
        prof.doubleProf = doubleProf;
      }
      if (halfProf != null) {
        prof.halfProf = halfProf;
      }
      if (roundUp != null) {
        prof.roundUp = roundUp;
      }
    }
  }

  private getRaceConfig(configs: ImportItemConfiguration[]): ImportItemConfiguration {
    return _.find(configs, function(config) { return config.importItem.type === 'Race' });
  }

  private async getCharacterRace(config: ImportItemConfiguration): Promise<CharacterRace> {
    const characterRace = new CharacterRace();
    if (config != null && config.importItem.selectedAction !== 'SKIP_ENTRY') {
      characterRace.race = await this.importCharacteristicService.getRace(config);
    }
    return characterRace;
  }

  private getClassConfigs(configs: ImportItemConfiguration[]): ImportItemConfiguration[] {
    return _.filter(configs, function(config) { return config.importItem.type === 'CharacterClass' || config.importItem.type === 'Subclass' });
  }

  private getBackgroundConfig(configs: ImportItemConfiguration[]): ImportItemConfiguration {
    return _.find(configs, function(config) { return config.importItem.type === 'Background' });
  }

  private getChosenBackgroundTrait(traitId: number, traits: ImportBackgroundDetail[], finalTraits: BackgroundTrait[]): BackgroundTrait {
    const trait = _.find(traits, function(_trait) { return _trait.id === traitId });
    if (trait != null) {
      return _.find(finalTraits, (_trait: BackgroundTrait) => { return _trait.description === trait.description && _trait.backgroundTraitType === trait.backgroundDetailType; });
    }
    return null;
  }

  private addChosenTrait(traitId: number, traits: ImportBackgroundDetail[], chosenTraits: BackgroundTrait[], finalTraits: BackgroundTrait[]): void {
    const trait = this.getChosenBackgroundTrait(traitId, traits, finalTraits);
    if (trait != null && trait.id !== '0') {
      chosenTraits.push(trait);
    }
  }

  private async getCharacterBackground(config: ImportItemConfiguration, importItem: ImportPlayerCharacter): Promise<CharacterBackground> {
    const characterBackground = new CharacterBackground();
    if (config != null && config.importItem.selectedAction !== 'SKIP_ENTRY') {
      const background = await this.importCharacteristicService.getBackground(config);
      characterBackground.background = background;
      if (background != null) {
        const importBackground = config.importItem as ImportBackground;
        const backgroundTraits = await this.characteristicService.getBackgroundTraits(background);
        this.addChosenTrait(importItem.chosenVariation, importBackground.variations, characterBackground.chosenTraits, backgroundTraits);
        this.addChosenTrait(importItem.chosenPersonality, importBackground.personalities, characterBackground.chosenTraits, backgroundTraits);
        this.addChosenTrait(importItem.chosenPersonalityTwo, importBackground.personalities, characterBackground.chosenTraits, backgroundTraits);
        this.addChosenTrait(importItem.chosenIdeal, importBackground.ideals, characterBackground.chosenTraits, backgroundTraits);
        this.addChosenTrait(importItem.chosenBond, importBackground.bonds, characterBackground.chosenTraits, backgroundTraits);
        this.addChosenTrait(importItem.chosenFlaw, importBackground.flaws, characterBackground.chosenTraits, backgroundTraits);
      }
    }
    characterBackground.customBackgroundName = importItem.background;
    characterBackground.customVariation = '';
    characterBackground.customPersonality = importItem.personality;
    characterBackground.customIdeal = importItem.ideals;
    characterBackground.customBond = importItem.bonds;
    characterBackground.customFlaw = importItem.flaws;
    characterBackground.bio = importItem.bio;
    return characterBackground;
  }

  private getSpellcasting(type: AttackType,  modifier: number, importAdvantage: ImportAdvantage): Spellcasting {
    const spellcasting = new Spellcasting();
    spellcasting.attackType = type;
    spellcasting.proficiency = new Proficiency();
    spellcasting.proficiency.proficient = true;
    spellcasting.proficiency.miscModifier = modifier;
    spellcasting.proficiency.advantage = importAdvantage == null ? false : importAdvantage.advantage;
    spellcasting.proficiency.disadvantage = importAdvantage == null ? false : importAdvantage.disadvantage;
    return spellcasting;
  }

  private getCharacterNotes(notes: ImportListObject[]): CharacterNote[] {
    const list: CharacterNote[] = [];
    notes.forEach((note: ImportListObject) => {
      const characterNote = new CharacterNote();
      characterNote.note = note.name;
      if (note.description != null && note.description !== '') {
        const category = new CharacterNoteCategory();
        category.name = note.description;
        characterNote.characterNoteCategory = category;
      }
      list.push(characterNote);
    });
    return list;
  }

  private getHealthGainResults(healthGainResults: number[]): HealthGainResult[] {
    const levels = this.characterLevelService.getLevelsDetailedFromStorageAsListObject();
    const list: HealthGainResult[] = [];
    healthGainResults.forEach((result: number, index: number) => {
      if (index < levels.length) {
        const healthGainResult = new HealthGainResult(levels[index]);
        healthGainResult.value = result;
        list.push(healthGainResult);
      }
    });
    return list;
  }

  private async getChosenClasses(classConfigs: ImportItemConfiguration[], importItem: ImportPlayerCharacter): Promise<ChosenClass[]> {
    const classes: ChosenClass[] = [];
    for (let i = 0; i < importItem.chosenClassSubclasses.length; i++) {
      const chosenClassSubclass = importItem.chosenClassSubclasses[i];
      const chosenClass = new ChosenClass();
      chosenClass.primary = i === 0;
      chosenClass.healthGainResults = this.getHealthGainResults(chosenClassSubclass.healthGainResults);
      chosenClass.numHitDiceMod = chosenClassSubclass.hitDiceMod;
      chosenClass.characterLevel = this.importSharedService.getLevelByNumber(chosenClassSubclass.classLevel);

      if (chosenClass.primary) {
        const spellcastingAbility = this.importSharedService.getAbilityById(importItem.customSpellCastingAbilityId);
        const spellAttack = this.getSpellcasting(AttackType.ATTACK, importItem.spellAttackModifier, importItem.spellAttackAdvantage);
        const spellSave = this.getSpellcasting(AttackType.SAVE, importItem.spellSaveDCModifier, null);
        chosenClass.spellcastingAbility = spellcastingAbility == null ? '0' : spellcastingAbility.id;
        chosenClass.spellcastingAttack = spellAttack;
        chosenClass.spellcastingSave = spellSave;
        chosenClass.displaySpellcasting = true;
      } else {
        chosenClass.displaySpellcasting = false;
      }

      const classConfig = _.find(classConfigs, function(config) { return config.importItem.name.toLowerCase() === chosenClassSubclass.characterClass.name.toLowerCase() });
      if (classConfig != null && classConfig.importItem.selectedAction !== 'SKIP_ENTRY') {
        chosenClass.characterClass = await this.importCharacteristicService.getCharacterClass(classConfig);

        if (chosenClassSubclass.subclass != null
          && chosenClassSubclass.subclass.name != null
          && chosenClassSubclass.subclass.name !== ''
          && chosenClassSubclass.subclass.name.toLowerCase() !== 'none') {
          const subclassConfig = _.find(classConfig.children, function(config) { return config.importItem.name.toLowerCase() === chosenClassSubclass.subclass.name.toLowerCase() });
          if (subclassConfig != null && subclassConfig.importItem.selectedAction !== 'SKIP_ENTRY') {
            chosenClass.subclass = await this.importCharacteristicService.getSubclass(subclassConfig);
          }
        }
      }

      classes.push(chosenClass);
    }

    return classes;
  }

  private getCreatureSpellSlots(spellSlotsAvailable: number[], spellSlotModifiers: number[]): CreatureSpellSlot[] {
    const slots: CreatureSpellSlot[] = [];
    for (let i = 0; i < 9; i++) {
      const slot = new CreatureSpellSlot();
      slot.level = i + 1;
      slot.remaining = spellSlotsAvailable[i];
      slot.maxModifier = spellSlotModifiers[i];
      slots.push(slot);
    }
    return slots;
  }

  private getSpellTags(spellTags: ImportSpellTag[]): Tag[] {
    const tags: Tag[] = [];
    if (spellTags != null) {
      spellTags.forEach((spellTag: ImportSpellTag) => {
        tags.push(this.getSpellTag(spellTag));
      });
    }
    return tags;
  }

  private getSpellTag(spellTag: ImportSpellTag): Tag {
    const tag = new Tag();
    tag.powerType = PowerType.SPELL;
    tag.title = spellTag.name;
    tag.color = spellTag.color;
    if (tag.color.toLowerCase().indexOf('#ff') === 0 && tag.color.length === 9) {
      tag.color = tag.color.substr(3);
    } else if (tag.color.indexOf('#') === 0 && tag.color.length === 7) {
      tag.color = tag.color.substr(1);
    }
    return tag;
  }

  private async getCreatureSpellcasting(importItem: ImportPlayerCharacter): Promise<CreatureSpellCasting> {
    const creatureSpellcasting = new CreatureSpellCasting();
    const innateSpellcastingAbility = this.importSharedService.getAbilityById(importItem.innateSpellCastingAbilityId);
    creatureSpellcasting.spellcastingAbility = innateSpellcastingAbility == null ? '0' : innateSpellcastingAbility.id;
    creatureSpellcasting.spellcastingAttack = this.getSpellcasting(AttackType.ATTACK, importItem.innateSpellAttackModifier, importItem.innateSpellAttackAdvantage);
    creatureSpellcasting.spellcastingSave = this.getSpellcasting(AttackType.SAVE, importItem.innateSpellSaveDCModifier, null);
    creatureSpellcasting.spellSlots = this.getCreatureSpellSlots(importItem.spellSlotsAvailable, importItem.spellSlotModifiers);
    creatureSpellcasting.tags = this.getSpellTags(importItem.spellTags);

    const spells = await this.getSpells(importItem.spells, importItem.spellTags);
    const innateSpells = await this.getInnateSpells(importItem.innateSpells, importItem.spellTags);
    creatureSpellcasting.spells = spells.concat(innateSpells);

    // classPreparationModifiers: Map<number, number>; //not supported

    return creatureSpellcasting;
  }

  private async getSpells(spells: ImportSpell[], spellTags: ImportSpellTag[]): Promise<CreatureSpell[]> {
    const list: CreatureSpell[] = [];
    if (spells != null) {
      for (const importSpell of spells) {
        if (importSpell.status !== 'NOT_SUPPORTED' && importSpell.selectedAction !== 'SKIP_ENTRY') {
          list.push(await this.getCreatureSpell(importSpell, spellTags));
        }
      }
    }
    return list;
  }

  private async getInnateSpells(innateSpells: ImportInnateSpell[], spellTags: ImportSpellTag[]): Promise<CreatureSpell[]> {
    const list: CreatureSpell[] = [];
    if (innateSpells != null) {
      for (const innateSpell of innateSpells) {
        if (innateSpell.spell.status !== 'NOT_SUPPORTED' && innateSpell.spell.selectedAction !== 'SKIP_ENTRY') {
          list.push(await this.getCreatureSpell(innateSpell.spell, spellTags));
        }
      }
    }
    return list;
  }

  private async getCreatureSpell(importSpell: ImportSpell, spellTags: ImportSpellTag[]): Promise<CreatureSpell> {
    const spell = await this.importPowerService.getSpell(importSpell);
    const creatureSpell = new CreatureSpell();
    creatureSpell.spell = new SpellListObject();
    creatureSpell.spell.id = spell.id;
    creatureSpell.spell.name = spell.name;
    creatureSpell.spell.tags = this.getCreatureSpellTags(importSpell, spellTags);
    creatureSpell.prepared = importSpell.preparedClassId !== 0;
    return creatureSpell;
  }

  private getCreatureSpellTags(importSpell: ImportSpell, spellTags: ImportSpellTag[]): Tag[] {
    const tags: Tag[] = [];
    if (importSpell.spellTags != null && spellTags != null) {
      importSpell.spellTags.forEach((tagId: number) => {
        const importTag = _.find(spellTags, (_tag: ImportSpellTag) => { return _tag.id === tagId; })
        if (importTag != null) {
          tags.push(this.getSpellTag(importTag));
        }
      });
    }
    return tags;
  }

  private async getCreatureFeatures(importItem: ImportPlayerCharacter): Promise<CreatureFeatures> {
    const creatureFeatures = new CreatureFeatures();
    for (const importFeature of importItem.features) {
      if (importFeature.status !== 'NOT_SUPPORTED' && importFeature.selectedAction !== 'SKIP_ENTRY') {
        const creatureFeature = await this.getCreatureFeature(importFeature);
        creatureFeatures.features.push(creatureFeature);
      }
    }
    // featureAbilities: ImportFeatureAbility[];
    return creatureFeatures;
  }

  private async getCreatureFeature(importFeature: ImportFeature): Promise<CreatureFeature> {
    const feature: Feature = await this.importPowerService.getFeature(importFeature);
    const creatureFeature = new CreatureFeature();
    creatureFeature.feature = new FeatureListObject();
    creatureFeature.feature.id = feature.id;
    creatureFeature.feature.name = feature.name;
    creatureFeature.feature.characteristic = feature.characteristic;
    return creatureFeature;
  }

  private async getCreatureItem(importEquipmentObject: ImportEquipmentObject): Promise<CreatureItem> {
    const item = await this.importItemService.getEquipment(importEquipmentObject);
    if (item == null) {
      return null;
    }
    const creatureItem = new CreatureItem();

    creatureItem.item = item;
    creatureItem.itemType = item.itemType;
    creatureItem.quantity = importEquipmentObject.quantity;
    creatureItem.equipmentSlot = this.importItemService.getEquipmentSlot(importEquipmentObject.equippedSlot);
    creatureItem.expanded = importEquipmentObject.expanded;
    creatureItem.poisoned = importEquipmentObject.poisoned;
    creatureItem.silvered = importEquipmentObject.silvered;
    creatureItem.full = false;
    creatureItem.attuned = importEquipmentObject.attuned;
    creatureItem.cursed = importEquipmentObject.cursed;
    creatureItem.chargesRemaining = importEquipmentObject.charges;

    // magical items aren't currently supported
    // if (importEquipmentObject.type === 'MagicalItem') {
    //   const magicalItem = item as MagicalItem;
    //   creatureItem.magicalItemId = magicalItem.category;
    // }

    if (importEquipmentObject.dropped) {
      creatureItem.creatureItemState = CreatureItemState.DROPPED;
      if (item.itemType === ItemType.AMMO) {
        creatureItem.creatureItemState = CreatureItemState.EXPENDED;
      }
    } else if (creatureItem.equipmentSlot != null) {
      creatureItem.creatureItemState = CreatureItemState.EQUIPPED;
    } else {
      creatureItem.creatureItemState = CreatureItemState.CARRIED;
    }

    creatureItem.items = [];
    return creatureItem;
  }

  private getCreatureItems(stash: ImportEquipmentObjectStashed[]): CreatureItem[] {
    const items: CreatureItem[] = [];
    stash.forEach((_item: ImportEquipmentObjectStashed) => {
      items.push(_item.creatureItem);
    });
    return items;
  }

  private async getCreatureItemsStashed(importItem: ImportPlayerCharacter): Promise<ImportEquipmentObjectStashed[]> {
    const items: ImportEquipmentObjectStashed[] = [];
    const map = new Map<number, ImportEquipmentObjectStashed>();

    for (const importEquipmentObject of importItem.items) {
      if (importEquipmentObject.status !== 'NOT_SUPPORTED' && importEquipmentObject.selectedAction !== 'SKIP_ENTRY') {
        const creatureItem = await this.getCreatureItem(importEquipmentObject);
        if (creatureItem != null) {
          const stashedItem = new ImportEquipmentObjectStashed();
          stashedItem.importEquipmentObject = importEquipmentObject;
          stashedItem.creatureItem = creatureItem;
          map.set(importEquipmentObject.characterItemId, stashedItem);
        }
      }
    }

    map.forEach((stashedItem: ImportEquipmentObjectStashed) => {
      if (stashedItem.importEquipmentObject.containerId === 0) {
        items.push(stashedItem);
      } else {
        const container = map.get(stashedItem.importEquipmentObject.containerId);
        if (container != null) {
          const creatureItem = container.creatureItem;
          if (creatureItem.item.container || creatureItem.item.itemType === ItemType.MOUNT) {
            creatureItem.items.push(stashedItem.creatureItem);
            container.nestedItems.push(stashedItem);
          } else {
            items.push(stashedItem);
          }
        } else {
          items.push(stashedItem);
        }
      }
    })

    return items;
  }

  async getPlayerCharacter(config: ImportItemConfiguration): Promise<PlayerCharacter> {
    const importItem = config.importItem as ImportPlayerCharacter;
    const playerCharacter = new PlayerCharacter();
    if (importItem != null) {
      playerCharacter.name = importItem.name;

      // abilities
      playerCharacter.abilityScores = [];
      playerCharacter.abilityScores.push(this.getAbilityScore(importItem.str, SID.ABILITIES.STRENGTH));
      playerCharacter.abilityScores.push(this.getAbilityScore(importItem.dex, SID.ABILITIES.DEXTERITY));
      playerCharacter.abilityScores.push(this.getAbilityScore(importItem.con, SID.ABILITIES.CONSTITUTION));
      playerCharacter.abilityScores.push(this.getAbilityScore(importItem.intelligence, SID.ABILITIES.INTELLIGENCE));
      playerCharacter.abilityScores.push(this.getAbilityScore(importItem.wis, SID.ABILITIES.WISDOM));
      playerCharacter.abilityScores.push(this.getAbilityScore(importItem.cha, SID.ABILITIES.CHARISMA));

      // Ability Modifier Misc Modifiers
      // strMod - not supported
      // dexMod - not supported
      // conMod - not supported
      // intMod - not supported
      // wisMod - not supported
      // chaMod - not supported

      playerCharacter.abilitiesToIncreaseByOne = [];
      this.addAbilityScoreIncreases(importItem.strRaceModified, SID.ABILITIES.STRENGTH, playerCharacter.abilitiesToIncreaseByOne);
      this.addAbilityScoreIncreases(importItem.dexRaceModified, SID.ABILITIES.DEXTERITY, playerCharacter.abilitiesToIncreaseByOne);
      this.addAbilityScoreIncreases(importItem.conRaceModified, SID.ABILITIES.CONSTITUTION, playerCharacter.abilitiesToIncreaseByOne);
      this.addAbilityScoreIncreases(importItem.intRaceModified, SID.ABILITIES.INTELLIGENCE, playerCharacter.abilitiesToIncreaseByOne);
      this.addAbilityScoreIncreases(importItem.wisRaceModified, SID.ABILITIES.WISDOM, playerCharacter.abilitiesToIncreaseByOne);
      this.addAbilityScoreIncreases(importItem.chaRaceModified, SID.ABILITIES.CHARISMA, playerCharacter.abilitiesToIncreaseByOne);

      const miscProfs = await this.getMiscProfs();
      await this.updateAttributeProfs(playerCharacter, importItem);
      await this.updateItemProfs(playerCharacter, importItem);

      // traits
      playerCharacter.alignment = await this.getAlignment(importItem.alignment);
      playerCharacter.characteristics.height = importItem.height;
      playerCharacter.characteristics.eyes = importItem.eyes;
      playerCharacter.characteristics.hair = importItem.hair;
      playerCharacter.characteristics.skin = importItem.skin;
      playerCharacter.characteristics.gender = this.getGender(importItem.gender);
      playerCharacter.characteristics.age = importItem.age;
      playerCharacter.characteristics.weight = importItem.weight;
      playerCharacter.characteristics.deity = await this.getDeity(importItem.deity);
      playerCharacter.inspiration = importItem.inspiration;
      playerCharacter.exp = importItem.exp;

      // characteristics
      let classConfigs = this.getClassConfigs(config.children);
      if (classConfigs.length === 0) {
        classConfigs = this.getClassConfigs(config.dependencies);
      }
      let raceConfig = this.getRaceConfig(config.children);
      if (raceConfig == null) {
        raceConfig = this.getRaceConfig(config.dependencies);
      }
      let backgroundConfig = this.getBackgroundConfig(config.children);
      if (backgroundConfig == null) {
        backgroundConfig = this.getBackgroundConfig(config.dependencies);
      }
      playerCharacter.classes = await this.getChosenClasses(classConfigs, importItem);
      playerCharacter.characterRace = await this.getCharacterRace(raceConfig); //importItem.race
      playerCharacter.characterBackground = await this.getCharacterBackground(backgroundConfig, importItem);

      // health
      playerCharacter.healthCalculationType = this.getHealthCalculationType(importItem.useMax, importItem.useHalfMaxResult);
      playerCharacter.hpGainModifier = importItem.hpGainModifier;
      playerCharacter.creatureHealth.currentHp = importItem.currentHP;
      playerCharacter.creatureHealth.tempHp = importItem.tempHP;
      playerCharacter.creatureHealth.maxHpMod = importItem.maxHpModifier;
      playerCharacter.creatureHealth.creatureHitDice = this.getCreatureHitDice(importItem.hitDiceRemaining);
      playerCharacter.creatureHealth.numDeathSaveThrowSuccesses = importItem.numDeathSaveThrowSuccesses;
      playerCharacter.creatureHealth.numDeathSaveThrowFailures = importItem.numDeathSaveThrowFailures;
      playerCharacter.creatureHealth.resurrectionPenalty = importItem.resurrectionPenalty;
      playerCharacter.creatureHealth.creatureState = this.getCreatureState(importItem.currentState);
      playerCharacter.creatureHealth.exhaustionLevel = importItem.exhaustionLevel;

      // equipment
      playerCharacter.characterSettings.equipment.autoConvertCurrency = importItem.autoConvertCurrency;
      playerCharacter.characterSettings.equipment.calculateCurrencyWeight = importItem.calculateCurrencyWeight;
      playerCharacter.characterSettings.equipment.useEncumbrance = importItem.applyWeightPenalties;
      playerCharacter.characterSettings.restrictToTwenty = importItem.restrictToTwenty;
      this.setProfValue(SID.MISC_ATTRIBUTES.EQUIPMENT, miscProfs, null, importItem.carryingWeightModifier);
      this.setProfValue(SID.MISC_ATTRIBUTES.CARRYING_CAPACITY, miscProfs, null, importItem.carryMod);
      this.setProfValue(SID.MISC_ATTRIBUTES.PUSH_CAPACITY, miscProfs, null, importItem.pushMod);
      const stash = await this.getCreatureItemsStashed(importItem);
      playerCharacter.items = this.getCreatureItems(stash);
      playerCharacter.creatureWealth.amounts.push(this.getCreatureWealthAmount('PP', importItem.wealth.pp));
      playerCharacter.creatureWealth.amounts.push(this.getCreatureWealthAmount('GP', importItem.wealth.gp));
      playerCharacter.creatureWealth.amounts.push(this.getCreatureWealthAmount('EP', importItem.wealth.ep));
      playerCharacter.creatureWealth.amounts.push(this.getCreatureWealthAmount('SP', importItem.wealth.sp));
      playerCharacter.creatureWealth.amounts.push(this.getCreatureWealthAmount('CP', importItem.wealth.cp));

      // speeds
      playerCharacter.characterSettings.speed.swimming.useHalf = importItem.speedModifiers.swimmingUseHalf;
      playerCharacter.characterSettings.speed.swimming.roundUp = importItem.speedModifiers.swimmingRoundUp;
      playerCharacter.characterSettings.speed.climbing.useHalf = importItem.speedModifiers.climbingUseHalf;
      playerCharacter.characterSettings.speed.climbing.roundUp = importItem.speedModifiers.climbingRoundUp;
      playerCharacter.characterSettings.speed.crawling.useHalf = importItem.speedModifiers.crawlingUseHalf;
      playerCharacter.characterSettings.speed.crawling.roundUp = importItem.speedModifiers.crawlingRoundUp;
      this.setProfValue(SID.MISC_ATTRIBUTES.BURROW, miscProfs, null, importItem.speedModifiers.burrowSpeedModifier);
      this.setProfValue(SID.MISC_ATTRIBUTES.CLIMBING, miscProfs, null, importItem.speedModifiers.climbingSpeedModifier);
      this.setProfValue(SID.MISC_ATTRIBUTES.CRAWLING, miscProfs, null, importItem.speedModifiers.crawlingSpeedModifier);
      this.setProfValue(SID.MISC_ATTRIBUTES.FLYING, miscProfs, null, importItem.speedModifiers.flyingSpeedModifier);
      this.setProfValue(SID.MISC_ATTRIBUTES.WALKING, miscProfs, null, importItem.speedModifiers.speedModifier);
      this.setProfValue(SID.MISC_ATTRIBUTES.SWIMMING, miscProfs, null, importItem.speedModifiers.swimmingSpeedModifier);

      // misc modifiers
      this.setProfValue(SID.MISC_ATTRIBUTES.INITIATIVE, miscProfs, null, importItem.initMod, importItem.initAdvantage.advantage, importItem.initAdvantage.disadvantage);
      this.setProfValue(SID.MISC_ATTRIBUTES.PROFICIENCY, miscProfs, null, importItem.profMod);
      this.setProfValue(SID.MISC_ATTRIBUTES.AC, miscProfs, null, importItem.acMod);

      playerCharacter.creatureSpellCasting = await this.getCreatureSpellcasting(importItem);
      playerCharacter.characterSettings.spellcasting.displayOtherSpellcasting = importItem.innateSpells != null && importItem.innateSpells.length > 0;
      playerCharacter.creatureFeatures = await this.getCreatureFeatures(importItem);
      playerCharacter.characterNotes = this.getCharacterNotes(importItem.notes);
      playerCharacter.conditionImmunities = await this.getConditionImmunities(importItem.conditionImmunities);
      playerCharacter.damageModifiers = await this.getDamageModifiers(importItem.damageModifiers);

      playerCharacter.activeConditions = await this.getActiveConditions(importItem.conditionsList);
    }
    return playerCharacter;
  }

  private getFavoriteActions(config: ImportItemConfiguration, actions: CreatureAction[]): CreatureAction[] {
    const importItem = config.importItem as ImportPlayerCharacter;
    const itemActions: CreatureAction[] = _.filter(actions, (action: CreatureAction) => { return action.creatureActionType === CreatureActionType.ITEM; });
    const itemConfigs = _.filter(config.children, (_config: ImportItemConfiguration) => { return this.importSharedService.isEquipmentObject(_config.importItem) && _config.importItem.status === 'COMPLETE' && _config.importItem.selectedAction !== 'SKIP_ENTRY'; });

    const spellActions: CreatureAction[] = _.filter(actions, (action: CreatureAction) => { return action.creatureActionType === CreatureActionType.SPELL; });
    const spellConfigs = _.filter(config.children, (_config: ImportItemConfiguration) => { return _config.importItem.type === 'Spell' && _config.importItem.status === 'COMPLETE' && _config.importItem.selectedAction !== 'SKIP_ENTRY'; });

    const featureActions: CreatureAction[] = _.filter(actions, (action: CreatureAction) => { return action.creatureActionType === CreatureActionType.FEATURE; });
    const featureConfigs = _.filter(config.children, (_config: ImportItemConfiguration) => { return _config.importItem.type === 'Feature' && _config.importItem.status === 'COMPLETE' && _config.importItem.selectedAction !== 'SKIP_ENTRY'; });

    const favoriteActions: CreatureAction[] = [];
    importItem.quickAttacks.forEach((quickAttack: ImportQuickAttack) => {
      switch (quickAttack.quickAttackType) {
        case 'WEAPON':
        // case 'MAGIC_ITEM':
          const quickAttackWeapon = quickAttack as ImportQuickAttackWeapon;
          const itemConfig = this.importSharedService.findConfigItem(quickAttackWeapon.item, itemConfigs);
          const weaponAction = this.getAction(itemConfig, itemActions);
          if (weaponAction != null) {
            favoriteActions.push(weaponAction);
          }
          break;
        case 'SPELL':
        case 'INNATE_SPELL':
          const quickAttackSpell = quickAttack as ImportQuickAttackSpell;
          const spellConfig = this.importSharedService.findConfigItem(quickAttackSpell.spell, spellConfigs);
          const spellAction = this.getAction(spellConfig, spellActions);
          if (spellAction != null) {
            favoriteActions.push(spellAction);
          }
          break;
        case 'FEATURE':
          const quickAttackFeature = quickAttack as ImportQuickAttackFeature;
          const featureConfig = this.importSharedService.findConfigItem(quickAttackFeature.feature, featureConfigs);
          const featureAction = this.getAction(featureConfig, featureActions);
          if (featureAction != null) {
            favoriteActions.push(featureAction);
          }
          break;
      }
    });
    return favoriteActions;
  }

  private getAction(config: ImportItemConfiguration, actions: CreatureAction[]): CreatureAction {
    if (config != null) {
      return _.find(actions, (_action: CreatureAction) => { return _action.item.id === config.importItem.finalId; });
    }
    return null;
  }

  private async getActiveConditions(conditions: ImportCondition[]): Promise<ActiveCondition[]> {
    const activeConditions: ActiveCondition[] = [];
    if (conditions != null) {
      const cachedConditions = await this.importCacheService.getAttributesByType(AttributeType.CONDITION);
      conditions.forEach((condition: ImportCondition) => {
        const cachedCondition = _.find(cachedConditions, (_condition: ListObject) => { return _condition.name.toLowerCase() === condition.name.toLowerCase(); });
        if (cachedCondition != null) {
          const activeCondition = new ActiveCondition();
          activeCondition.condition = cachedCondition;
          activeConditions.push(activeCondition);
        }
      });
    }
    return activeConditions;
  }

  private async updateItemProfs(playerCharacter: PlayerCharacter, importItem: ImportPlayerCharacter): Promise<any> {
    // item profs
    const armors = await this.importCacheService.getItemsByType(ItemType.ARMOR);
    const tools = await this.importCacheService.getItemsByType(ItemType.TOOL);
    const weapons = await this.importCacheService.getItemsByType(ItemType.WEAPON);
    const armorProfs = this.importSharedService.getProficiencyList(importItem.armorProfs, armors, ProficiencyType.ARMOR);
    const toolProfs = this.importSharedService.getProficiencyList(importItem.toolProfs, tools, ProficiencyType.TOOL);
    const weaponProfs = this.importSharedService.getProficiencyList(importItem.weaponProfs, weapons, ProficiencyType.WEAPON);
    const itemProfs = armorProfs.concat(toolProfs).concat(weaponProfs);
    playerCharacter.itemProfs = this.getItemProficiencyList(itemProfs);
  }

  private async updateAttributeProfs(playerCharacter: PlayerCharacter, importItem: ImportPlayerCharacter): Promise<any> {
    const savingThrowProfs: Proficiency[] = [];
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, importItem.strSaveAdvantage, importItem.strSaveMod, SID.ABILITIES.STRENGTH));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, importItem.dexSaveAdvantage, importItem.dexSaveMod, SID.ABILITIES.DEXTERITY));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, importItem.conSaveAdvantage, importItem.conSaveMod, SID.ABILITIES.CONSTITUTION));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, importItem.intSaveAdvantage, importItem.intSaveMod, SID.ABILITIES.INTELLIGENCE));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, importItem.wisSaveAdvantage, importItem.wisSaveMod, SID.ABILITIES.WISDOM));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, importItem.chaSaveAdvantage, importItem.chaSaveMod, SID.ABILITIES.CHARISMA));

    // attribute profs
    const armorTypes = await this.importCacheService.getAttributesByType(AttributeType.ARMOR_TYPE);
    const languages = await this.importCacheService.getAttributesByType(AttributeType.LANGUAGE);
    const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
    const weaponTypes = await this.importCacheService.getAttributesByType(AttributeType.WEAPON_TYPE);
    const armorTypeProfs = this.importSharedService.getProficiencyList(importItem.armorTypeProfs, armorTypes, ProficiencyType.ARMOR_TYPE);
    const languageProfs = this.importSharedService.getProficiencyList(importItem.languageProfs, languages, ProficiencyType.LANGUAGE);
    const weaponTypeProfs = this.importSharedService.getProficiencyList(importItem.weaponTypeProfs, weaponTypes, ProficiencyType.WEAPON_TYPE);
    const skillProfs = this.importSharedService.getCreatureSkillProficiencyList(importItem.skillProfs, skills, ProficiencyType.SKILL);
    // passiveInvestigationMod - not supported
    // passivePerceptionMod - not supported

    const miscProfs = await this.getMiscProfs();

    playerCharacter.attributeProfs = armorTypeProfs.concat(languageProfs).concat(savingThrowProfs).concat(skillProfs).concat(weaponTypeProfs).concat(miscProfs);
  }

  private async getMiscProfs(): Promise<any> {
    // misc profs
    const miscAttributes = await this.importCacheService.getAttributesByType(AttributeType.MISC);
    const miscProfs: Proficiency[] = [];
    miscAttributes.forEach((misc: ListObject) => {
      const prof = new Proficiency();
      const proficiencyListObject = new ProficiencyListObject();
      proficiencyListObject.proficiencyType = ProficiencyType.MISC;
      proficiencyListObject.id = misc.id
      proficiencyListObject.name = misc.name;
      proficiencyListObject.sid = misc.sid;
      prof.attribute = proficiencyListObject;
      miscProfs.push(prof);
    });
    return miscProfs;
  }

  async getDefaultCharacterName(config: ImportItemConfiguration): Promise<string> {
    let count = 0;
    const characters = await this.importCacheService.getCreaturesByType(CreatureType.CHARACTER);
    if (characters != null) {
      characters.forEach((character: ListObject) => {
        if (character.name === config.importItem.name || character.name.indexOf(config.importItem.name + ' (') === 0) {
          count++;
        }
      });
    }
    let name = config.importItem.name;
    if (count > 0) {
      name += ` (${count + 1})`;
    }
    return name;
  }

  processPlayerCharacter(config: ImportItemConfiguration): Promise<any> {
    return this.getPlayerCharacter(config).then(async (playerCharacter: PlayerCharacter) => {
      const characterImport = config.importItem as ImportPlayerCharacter;
      const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
      const skillProfs = this.importSharedService.getCreatureSkillProficiencyList(characterImport.skillProfs, skills, ProficiencyType.SKILL);
      await this.importAttributeService.processSkillProfs(skillProfs, characterImport.skillProfs);
      await this.importAttributeService.processLanguageDependencies(characterImport.languageProfs);
      await this.importAttributeService.processConditionDependencies(characterImport.conditionFilters);

      await this.updateAttributeProfs(playerCharacter, characterImport);
      await this.updateItemProfs(playerCharacter, characterImport);
      playerCharacter.attributeProfs = this.importSharedService.processProfs(playerCharacter.attributeProfs, this.importCacheService.getAllAttributes());
      playerCharacter.itemProfs = this.importSharedService.processItemProfs(playerCharacter.itemProfs, this.importCacheService.getAllItems());

      const deity = await this.importAttributeService.processDeityDependency(characterImport.deity);
      playerCharacter.characteristics.deity = deity == null ? null : new ListObject(deity.id, deity.name);

      config.importItem.selectedAction = 'INSERT_AS_NEW';
      config.importItem.selectedDuplicate = null;

      return this.processCreature(playerCharacter, config.importItem).then(async () => {
        try {
          const collection = await this.creatureService.initializeConfigurationCollection();
          this.creatureService.addCreatureToCollection(playerCharacter, collection);

          // update spell tags
          const tags = await this.creatureService.getTags(playerCharacter, PowerType.SPELL);
          playerCharacter.creatureSpellCasting.tags.forEach((tag: Tag, index: number) => {
            tag.id = tags[index].id;
          });
          const tagList: TagList = new TagList();
          tagList.tags = playerCharacter.creatureSpellCasting.tags;
          playerCharacter.creatureSpellCasting.tags = await this.creatureService.updateTags(playerCharacter, tagList);

          for (const chosenClass of playerCharacter.classes) {
            if (chosenClass.primary) {
              await this.updateCreatureClassSpellcasting(playerCharacter, chosenClass);
            }
          }
          await this.updateInnateSpellcasting(playerCharacter);
          await this.characterService.updateInspiration(playerCharacter, playerCharacter.inspiration);

          await this.processCreatureSpells(config, playerCharacter, collection);
          const features = await this.getFeatureListObjects(config);
          await this.characterService.addFeatures(playerCharacter, features, collection);
          const itemConfigs = _.filter(config.children, (_config: ImportItemConfiguration) => { return this.importSharedService.isEquipmentObject(_config.importItem) && _config.importItem.status === 'COMPLETE' && _config.importItem.selectedAction !== 'SKIP_ENTRY'; });
          const stash = await this.getCreatureItemsStashed(characterImport);
          await this.processCreatureItems(playerCharacter, stash, itemConfigs, '0', collection);

          // update wealth
          await this.creatureService.updateCreatureWealth(playerCharacter, playerCharacter.creatureWealth);

          // add notes
          for (const note of playerCharacter.characterNotes) {
            await this.creatureService.addNote(playerCharacter, note);
          }

          //activate conditions
          playerCharacter.activeConditions = await this.getActiveConditions(characterImport.conditionsList);
          await this.updateActiveConditions(playerCharacter);

          //favorite actions
          const actions: CreatureAction[] = await this.getAllActions(playerCharacter);
          playerCharacter.favoriteActions = this.getFavoriteActions(config, actions);
          if (playerCharacter.favoriteActions.length > 0) {
            const creatureActions = new CreatureActions();
            creatureActions.creatureActions = playerCharacter.favoriteActions;
            await this.creatureService.updateCreatureFavoriteActions(playerCharacter, creatureActions);
          }
        } catch (e) {
          //if error on any of this, delete character
          await this.creatureService.deleteCreature(playerCharacter);
          await this.importCacheService.deleteCreature(CreatureType.CHARACTER, playerCharacter.id);
          throw e;
        }
      });
    });
  }

  private async getAllActions(playerCharacter: PlayerCharacter): Promise<CreatureAction[]> {
    let actions = await this.creatureService.getCreatureActions(playerCharacter, 'STANDARD');
    actions = actions.concat(await this.creatureService.getCreatureActions(playerCharacter, 'BONUS'));
    actions = actions.concat(await this.creatureService.getCreatureActions(playerCharacter, 'REACTION'));
    return actions;
  }

  private async updateCreatureClassSpellcasting(playerCharacter: PlayerCharacter, chosenClass: ChosenClass): Promise<any> {
    await this.characterService.updateCharacteristicSpellcastingAbility(playerCharacter, chosenClass.characterClass.id, CharacteristicType.CLASS, chosenClass.spellcastingAbility);
    await this.creatureService.updateCharacteristicSpellcasting(playerCharacter, chosenClass.characterClass.id, chosenClass.spellcastingAttack);
    await this.creatureService.updateCharacteristicSpellcasting(playerCharacter, chosenClass.characterClass.id, chosenClass.spellcastingSave);
  }

  private async updateInnateSpellcasting(playerCharacter: PlayerCharacter): Promise<any> {
    await this.creatureService.updateSpellcastingAbility(playerCharacter, playerCharacter.creatureSpellCasting.spellcastingAbility);
    await this.creatureService.updateSpellcasting(playerCharacter, playerCharacter.creatureSpellCasting.spellcastingAttack);
    await this.creatureService.updateSpellcasting(playerCharacter, playerCharacter.creatureSpellCasting.spellcastingSave);
  }

  private async updateActiveConditions(playerCharacter: PlayerCharacter): Promise<any> {
    for (const activeCondition of playerCharacter.activeConditions) {
      if (!activeCondition.inherited) {
        await this.creatureService.updateCondition(playerCharacter.id, activeCondition.condition, true);
      }
    }
  }

  private async processCreatureSpells(config: ImportItemConfiguration, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): Promise<any> {
    const importItem = config.importItem as ImportPlayerCharacter;
    const spellConfigs = _.filter(config.children, (_config: ImportItemConfiguration) => { return _config.importItem.type === 'Spell' && _config.importItem.status === 'COMPLETE' && _config.importItem.selectedAction !== 'SKIP_ENTRY'; });
    const creatureSpells: CreatureSpell[] = [];
    for (const spellConfig of spellConfigs) {
      const creatureSpell = await this.getCreatureSpell(spellConfig.importItem as ImportSpell, importItem.spellTags);
      creatureSpells.push(creatureSpell);
    }

    if (creatureSpells.length > 0) {
      await this.addAssignedCharacteristics(creatureSpells, playerCharacter, spellConfigs);
      const powerTagList: PowerTagList = this.getPowerTagList(creatureSpells, playerCharacter);
      const creaturePowers: CreaturePower[] = await this.characterService.addSpells(playerCharacter, creatureSpells, collection);
      await this.creatureService.updatePowerTags(playerCharacter, powerTagList);

      //update prepared state
      const creatureSpellList: CreatureSpellList = new CreatureSpellList();
      creaturePowers.forEach((creaturePower: CreaturePower) => {
        const creatureSpell = _.find(creatureSpells, (spell: CreatureSpell) => { return spell.spell.id === creaturePower.powerId && spell.assignedCharacteristic === creaturePower.assignedCharacteristic; });
        if (creatureSpell != null) {
          creatureSpell.id = creaturePower.id;
        }
      });
      creatureSpellList.creatureSpells = creatureSpells;
      await this.creatureService.updateCreatureSpells(playerCharacter, creatureSpellList);
    }
  }

  private async addAssignedCharacteristics(creatureSpells: CreatureSpell[], playerCharacter: PlayerCharacter, spellConfigs: ImportItemConfiguration[]): Promise<any> {
    const characteristics = new Map<string, Characteristic>();
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      characteristics.set(chosenClass.characterClass.id, chosenClass.characterClass);
      if (chosenClass.subclass != null) {
        characteristics.set(chosenClass.characterClass.id, chosenClass.subclass);
      }
    });
    characteristics.set(playerCharacter.characterRace.race.id, playerCharacter.characterRace.race);
    if (playerCharacter.characterBackground.background != null) {
      characteristics.set(playerCharacter.characterBackground.background.id, playerCharacter.characterBackground.background);
    }

    const map = new Map<string, SpellConfiguration[]>();
    const promises: Promise<any>[] = [];
    characteristics.forEach((characteristic: Characteristic) => {
      promises.push(this.characteristicService.getSpellConfigurations(characteristic.id).then((spellConfigurations: SpellConfiguration[]) => {
        map.set(characteristic.id, spellConfigurations);
      }));
    });

    return Promise.all(promises).then(async () => {
      creatureSpells.forEach((creatureSpell: CreatureSpell) => {
        creatureSpell.assignedCharacteristic = this.getDefaultCharacteristic(creatureSpell, characteristics, map);
      });
    });
  }

  private getDefaultCharacteristic(creatureSpell: CreatureSpell, characteristics: Map<string, Characteristic>, map: Map<string, SpellConfiguration[]>): string {
    const spellId = creatureSpell.spell.id;

    const keys = Array.from(characteristics.keys());
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const characteristic = characteristics.get(key);
      const spellConfigurations = map.get(characteristic.id);
      if (spellConfigurations != null) {
        const config = _.find(spellConfigurations, (_config: SpellConfiguration) => { return _config.spell.id === spellId; })
        if (config != null) {
          return key;
        }
      }
    }

    return keys[0]; //todo - innate spells go to 'other'?
  }

  private getPowerTagList(creatureSpells: CreatureSpell[], playerCharacter: PlayerCharacter): PowerTagList {
    const powerTagList = new PowerTagList();
    const spellTags = playerCharacter.creatureSpellCasting.tags;
    creatureSpells.forEach((creatureSpell: CreatureSpell) => {
      this.updateCreatureSpellTags(creatureSpell, spellTags);
      const powerTag = new PowerTags();
      powerTag.powerId = creatureSpell.spell.id;
      powerTag.tags = creatureSpell.spell.tags;
      powerTagList.powerTags.push(powerTag);
    });
    return powerTagList;
  }

  private updateCreatureSpellTags(creatureSpell: CreatureSpell, tags: Tag[]): void {
    const finalTags: Tag[] = [];
    creatureSpell.spell.tags.forEach((tag: Tag) => {
      const match = _.find(tags, (_tag: Tag) => { return _tag.title === tag.title && _tag.color === tag.color; })
      if (match != null) {
        finalTags.push(match);
      }
    });
    creatureSpell.spell.tags = finalTags;
  }

  private async processCreatureItems(playerCharacter: PlayerCharacter, creatureItems: ImportEquipmentObjectStashed[], itemConfigs: ImportItemConfiguration[], containerId: string, collection: CreatureConfigurationCollection): Promise<AddItemResponse[]> {
    const finalItems: ImportEquipmentObjectStashed[] = [];
    for (const stashedItem of creatureItems) {
      const match: ImportItemConfiguration = this.importSharedService.findConfigMatch(stashedItem.importEquipmentObject, itemConfigs);
      if (match != null && match.importItem.finalId != null) {
        stashedItem.creatureItem.item.id = match.importItem.finalId;

        if (match.importItem.type === 'MagicalItem') {
          const magicalItemImport = match.importItem as ImportMagicalItem;
          const magicalItem = await this.importItemService.getMagicalItem(magicalItemImport.category);
          const subItem: Item = await this.importItemService.processMagicalItemSubItem(match, magicalItem);
          if (subItem != null) {
            stashedItem.creatureItem.magicalItem = new Item();
            stashedItem.creatureItem.magicalItem.id = subItem.id;
            stashedItem.creatureItem.magicalItem.name = subItem.name;
          }
        }

        finalItems.push(stashedItem);
      }
    }

    return this.characterService.addItems(playerCharacter, this.getSelectedItems(finalItems), containerId, collection)
      .then(async (responses: AddItemResponse[]) => {
        this.addCreatureItemIds(finalItems, responses);
        for (const stashedItem of finalItems) {
          if (stashedItem.creatureItem.id !== '0' && stashedItem.creatureItem.items.length > 0) {
            await this.processCreatureItems(playerCharacter, stashedItem.nestedItems, itemConfigs, stashedItem.creatureItem.id, collection);
          }
        }

        for (const stashedItem of finalItems) {
          const creatureItem = stashedItem.creatureItem;
          const container = containerId === '0' ? null : new ListObject(containerId);
          if (creatureItem.poisoned) {
            creatureItem.id = await this.creatureItemService.performAction(CreatureItemAction.POISON, playerCharacter, creatureItem, creatureItem.quantity, container);
          }
          if (creatureItem.silvered) {
            creatureItem.id = await this.creatureItemService.performAction(CreatureItemAction.SILVER, playerCharacter, creatureItem, creatureItem.quantity, container);
          }
          if (creatureItem.creatureItemState === CreatureItemState.DROPPED) {
            creatureItem.id = await this.creatureItemService.performAction(CreatureItemAction.DROP, playerCharacter, creatureItem, creatureItem.quantity, container);
          }
          if (creatureItem.creatureItemState === CreatureItemState.EXPENDED) {
            creatureItem.id = await this.creatureItemService.performAction(CreatureItemAction.EXPEND, playerCharacter, creatureItem, creatureItem.quantity, container);
          }
          if (creatureItem.creatureItemState === CreatureItemState.EQUIPPED) {
            const equipmentSlot = new ListObject(creatureItem.equipmentSlot.id);
            creatureItem.id = await this.creatureItemService.performAction(CreatureItemAction.EQUIP, playerCharacter, creatureItem, creatureItem.quantity, container, equipmentSlot);
          }

          // additional spells
          const additionalSpells: MagicalItemSpellConfiguration[] = await this.importItemService.processMagicalItemAdditionalSpells(stashedItem.importEquipmentObject);
          stashedItem.creatureItem.spells = stashedItem.creatureItem.spells.concat(additionalSpells);
          if (additionalSpells.length > 0) {
            await this.creatureItemService.updateSpells(playerCharacter, creatureItem, additionalSpells);
          }
        }

        return responses;
    });
  }

  private addCreatureItemIds(creatureItems: ImportEquipmentObjectStashed[], responses: AddItemResponse[]): void {
    if (creatureItems.length !== responses.length) {
      throw new Error('Not all items added successfully');
    }

    creatureItems.forEach((stashedItem: ImportEquipmentObjectStashed, index: number) => {
      const response = responses[index];
      stashedItem.creatureItem.id = response.creatureItemId;
    });
  }

  private getSelectedItems(creatureItems: ImportEquipmentObjectStashed[]): SelectionItem[] {
    const items: SelectionItem[] = [];
    creatureItems.forEach((stashedItem: ImportEquipmentObjectStashed) => {
      const creatureItem = stashedItem.creatureItem;
      const selectionItem = new SelectionItem();
      selectionItem.item = new ItemListObject(creatureItem.item.id, creatureItem.item.name);
      selectionItem.quantity = creatureItem.quantity;
      if (creatureItem.magicalItem != null) {
        selectionItem.selectedApplicableItem = new ItemListObject(creatureItem.magicalItem.id, creatureItem.magicalItem.name);
      }
      items.push(selectionItem);
    });
    return items;
  }

  private async getFeatureListObjects(config: ImportItemConfiguration): Promise<FeatureListObject[]> {
    const featureConfigs = _.filter(config.children, (_config: ImportItemConfiguration) => { return _config.importItem.type === 'Feature' && _config.importItem.status === 'COMPLETE' && _config.importItem.selectedAction !== 'SKIP_ENTRY'; });
    const list: FeatureListObject[] = [];
    for (const _config of featureConfigs) {
      const creatureFeature = await this.getCreatureFeature(_config.importItem as ImportFeature);
      list.push(creatureFeature.feature);
    }
    return list;
  }

  playerCharacterAddMissingChildren(importItem: ImportPlayerCharacter): void {
    // spells
    importItem.spells.forEach((spell: ImportSpell) => {
      this.importSharedService.initializeChildItem(spell, importItem);
    });

    // innate spells
    if (importItem.innateSpells != null) {
      importItem.innateSpells.forEach((innateSpell: ImportInnateSpell) => {
        this.importSharedService.initializeChildItem(innateSpell.spell, importItem);
      });
    }

    // classes/subclasses
    importItem.chosenClassSubclasses.forEach((chosenClassSubclass: ImportChosenClassSubclass) => {
      if (chosenClassSubclass.subclass != null
        && chosenClassSubclass.subclass.name != null
        && chosenClassSubclass.subclass.name !== ''
        && chosenClassSubclass.subclass.name.toLowerCase() !== 'none') {
        const subclass = _.find(chosenClassSubclass.characterClass.subclasses, function(_subclass) { return _subclass.name.toLowerCase() === chosenClassSubclass.subclass.name.toLowerCase() });
        chosenClassSubclass.characterClass.subclasses = [];
        if (subclass != null) {
          chosenClassSubclass.characterClass.subclasses.push(subclass);
        }
      } else {
        chosenClassSubclass.characterClass.subclasses = [];
      }

      this.importSharedService.initializeChildItem(chosenClassSubclass.characterClass, importItem);
    });

    // race
    this.importSharedService.initializeChildItem(importItem.race, importItem);

    // background
    if (importItem.chosenBackground != null && importItem.chosenBackground.name != null && importItem.chosenBackground.name !== '') {
      this.importSharedService.initializeChildItem(importItem.chosenBackground, importItem);
    }

    // features
    importItem.features.forEach((feature: ImportFeature) => {
      this.importSharedService.initializeChildItem(feature, importItem);
    });

    // equipment
    importItem.items.forEach((item: ImportEquipmentObject) => {
      if (item.type === 'MagicalItem' || item.type === 'MagicalItemCategory') {
        this.importItemService.fixMagicalItem(item);
      }
      this.importSharedService.initializeChildItem(item, importItem);
    });

    // skills
    importItem.skillProfs.forEach((skill: ImportCreatureSkill) => {
      this.importSharedService.initializeImportItem(skill);
    });

    importItem.children = this.importSharedService.mergeChildrenList(importItem.children);
    const flatList: ImportItem[] = this.importSharedService.getFlatList(importItem.children);
    flatList.forEach((flatListItem: ImportItem) => {
      this.addRemainingChildren(flatListItem);
    });
  }

  private addRemainingChildren(importItem: ImportItem): void {
    switch (importItem.type) {
      case 'Background':
        this.importCharacteristicService.backgroundAddMissingChildren(importItem as ImportBackground);
        break;
      case 'CharacterClass':
        // case 'Subclass':
        this.importCharacteristicService.characterClassAddMissingChildren(importItem as ImportCharacterClass);
        break;
      case 'Race':
        this.importCharacteristicService.raceAddMissingChildren(importItem as ImportRace);
        break;

      case 'Feature':
        this.importPowerService.featureAddMissingChildren(importItem as ImportFeature);
        break;
      case 'Spell':
        this.importPowerService.spellAddMissingChildren(importItem as ImportSpell);
        break;

      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
      case 'GearCategory':
      case 'Gear':
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
      case 'Tool':
      case 'ToolCategory':
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
      case 'MagicalItem':
      case 'MagicalItemCategory':
      case 'Treasure':
      case 'TreasureCategory':
      case 'Pack':
      case 'PackCategory':
        this.importItemService.equipmentAddMissingChildren(importItem as ImportEquipment);
        break;
    }
  }

  validatePlayerCharacter(importItem: ImportPlayerCharacter): boolean {
    return importItem.name != null
      && importItem.name !== ''
      && importItem.chosenClassSubclasses.length > 0
      && importItem.race != null
      && importItem.str != null && importItem.str.roll > 0
      && importItem.dex != null && importItem.dex.roll > 0
      && importItem.con != null && importItem.con.roll > 0
      && importItem.intelligence != null && importItem.intelligence.roll > 0
      && importItem.wis != null && importItem.wis.roll > 0
      && importItem.cha != null && importItem.cha.roll > 0;
  }

  getPossibleDuplicatesForCharacter(importItem: ImportItem): ListObject[] {
    return [];
  }
}
