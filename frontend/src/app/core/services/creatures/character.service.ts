import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {ListObject} from '../../../shared/models/list-object';
import {HttpClient} from '@angular/common/http';
import {Filters} from '../../components/filters/filters';
import {CreatureService} from './creature.service';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {Creature} from '../../../shared/models/creatures/creature';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {HealthGainResult} from '../../../shared/models/creatures/characters/health-gain-result';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {DiceService} from '../dice.service';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {Background} from '../../../shared/models/characteristics/background';
import {CharacterBackgroundTraitCollection} from '../../../shared/models/creatures/characters/configs/character-background-trait-collection';
import {BackgroundTrait} from '../../../shared/models/characteristics/background-trait';
import {CharacterBackgroundTraitCollectionItem} from '../../../shared/models/creatures/characters/configs/character-background-trait-collection-item';
import {CharacterBackground} from '../../../shared/models/creatures/characters/character-background';
import {BackgroundTraitType} from '../../../shared/models/characteristics/background-trait-type.enum';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterPage} from '../../../shared/models/creatures/characters/character-page';
import {CharacterPageType} from '../../../shared/models/creatures/characters/character-page-type.enum';
import {
  CharacterEquipmentSettings,
  CharacterFeatureSettings,
  CharacterHealthSettings,
  CharacterSettings,
  CharacterSkillSettings,
  CharacterSpeedSettings,
  CharacterSpellcastingSettings,
  CharacterValidationSettings
} from '../../../shared/models/creatures/characters/character-settings';
import {DEFAULT_FILTER_VALUE, FILTER_VALUE_NO, FILTER_VALUE_YES, SID, STRENGTH_MULTIPLIERS} from '../../../constants';
import {CharacterPages} from '../../../shared/models/creatures/characters/character-pages';
import {CharacterLevelService} from '../character-level.service';
import {CharacterLevel} from '../../../shared/models/character-level';
import {AbilityService} from '../attributes/ability.service';
import {CreatureAbilityProficiency} from '../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CharacterNoteCategory} from '../../../shared/models/creatures/characters/character-note-category';
import {CharacterNote} from '../../../shared/models/creatures/characters/character-note';
import {TranslateService} from '@ngx-translate/core';
import {FeatureListObject} from '../../../shared/models/powers/feature-list-object';
import * as _ from 'lodash';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import {Power} from '../../../shared/models/powers/power';
import {PowerService} from '../powers/power.service';
import {ModifierConfigurationCollection} from '../../../shared/models/modifier-configuration-collection';
import {ModifierConfiguration} from '../../../shared/models/modifier-configuration';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {Proficiency} from '../../../shared/models/proficiency';
import {CreatureSpell} from '../../../shared/models/creatures/creature-spell';
import {Spellcasting} from '../../../shared/models/spellcasting';
import {PowerModifier} from '../../../shared/models/powers/power-modifier';
import {SpellService} from '../powers/spell.service';
import {CharacterRace} from '../../../shared/models/creatures/characters/character-race';
import {SpellcastingAbility} from '../../../shared/models/creatures/spellcasting-ability';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {CreatureSpellConfiguration} from '../../../shared/models/creatures/creature-spell-configuration';
import {MappedSpellConfigurationCollection} from '../../../shared/models/mapped-spell-configuration-collection';
import {CalculatedSpellPreparation} from '../../../shared/models/calculated-spell-preparation';
import {SpellConfigurationCollectionItem} from '../../../shared/models/spell-configuration-collection-item';
import {FilterKey} from '../../components/filters/filter-key.enum';
import {FilterSorts} from '../../../shared/models/filter-sorts';
import {FilterValue} from '../../components/filters/filter-value';
import {CreatureFeature} from '../../../shared/models/creatures/creature-feature';
import {CreaturePowerList} from '../../../shared/models/creatures/creature-power-list';
import {CreatureSpellList} from '../../../shared/models/creatures/creature-spell-list';
import {CreaturePower} from '../../../shared/models/creatures/creature-power';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {ModifierService} from '../modifier.service';
import {CreatureCharacteristicConfigurationCollectionItem} from '../../../shared/models/creatures/configs/creature-characteristic-configuration-collection-item';
import {ClassSpellPreparation} from '../../../shared/models/characteristics/class-spell-preparation';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {Race} from '../../../shared/models/characteristics/race';
import {CreatureSpeedModifierCollectionItem} from '../../../shared/models/creatures/configs/creature-speed-modifier-collection-item';
import {CreatureHitDice} from '../../../shared/models/creatures/creature-hit-dice';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {PowerModifierConfiguration} from '../../../shared/models/power-modifier-configuration';
import {CharacterHealthConfiguration} from '../../../shared/models/creatures/characters/character-health-configuration';
import {ProficiencyList} from '../../../shared/models/proficiency-list';
import {ActiveCondition} from '../../../shared/models/creatures/active-condition';
import {ChosenClasses} from '../../../shared/models/creatures/characters/chosen-classes';
import {CreatureState} from '../../../shared/models/creatures/creature-state.enum';
import {CreatureHealth} from '../../../shared/models/creatures/creature-health';
import {CharacterExp} from '../../../shared/models/creatures/characters/character-exp';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {CharacterValidationItem} from '../../../shared/models/creatures/characters/character-validation';
import {CreatureWealthAmount} from '../../../shared/models/creatures/creature-wealth-amount';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {CreatureInventory} from '../../../shared/models/creatures/creature-inventory';
import {Armor} from '../../../shared/models/items/armor';
import {EquipmentSlotType} from '../../../shared/models/items/equipment-slot-type.enum';
import {CreatureItemState} from '../../../shared/models/creatures/creature-item-state.enum';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {LabelValue} from '../../../shared/models/label-value';
import {AddItemResponse} from '../../../shared/models/items/add-item-response';
import {SelectionItem} from '../../../shared/models/items/selection-item';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {MagicalItemAttunementType} from '../../../shared/models/items/magical-item-attunement-type.enum';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';
import {BackgroundService} from '../characteristics/background.service';
import {UserSubscriptionType} from '../../../shared/models/user-subscription-type.enum';
import {Subscription} from 'rxjs';
import {UserService} from '../user.service';
import {SquireImage} from '../../../shared/models/squire-image';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';

@Injectable({
  providedIn: 'root'
})
export class CharacterService implements MenuService, OnDestroy {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private characters: ListObject[] = [];
  private privateCharacters: ListObject[] = [];
  userSub: Subscription;
  isPro = false;

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private creatureService: CreatureService,
    private diceService: DiceService,
    private characterLevelService: CharacterLevelService,
    private characteristicService: CharacteristicService,
    private abilityService: AbilityService,
    private powerService: PowerService,
    private spellService: SpellService,
    private modifierService: ModifierService,
    private backgroundService: BackgroundService,
    private userService: UserService
  ) {
    this.userSub = this.userService.userSubject.subscribe(async user => {
      this.isPro = user != null && user.userSubscription.type !== UserSubscriptionType.FREE;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.characters = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateCharacters = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.characters;
      case ListSource.PUBLIC_CONTENT:
        return [];
      case ListSource.PRIVATE_CONTENT:
        return this.privateCharacters;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.characters = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateCharacters = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.updateMenuItemsWithFilters(id, listSource, filters);
  }

  updateMenuItemsWithFilters(id: string, listSource: ListSource, filters: Filters): void {
    if (filters == null) {
      this.resetCache(listSource);
    }
    this.getCharactersWithFilters(listSource, filters).then((characters: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      characters.forEach((character: ListObject) => {
        menuItems.push(new MenuItem(character.id, character.name, '', '', false));
      });
      this.items = menuItems;
      if (id != null) {
        for (let i = 0; i < this.items.length; i++) {
          const menuItem = this.items[i];
          menuItem.selected = menuItem.id === id;
        }
      }
      this.menuItems.next(this.items);
    });
  }

  createCharacter(character: PlayerCharacter): Promise<string> {
    character.creatureType = CreatureType.CHARACTER;
    return this.creatureService.createCreature(character);
  }

  getCharacters(listSource: ListSource): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.creatureService.getCharacters(listSource).then((characters: ListObject[]) => {
        this.updateCache(characters, listSource);
        return characters;
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getCharacters(listSource);
  }

  getCharactersWithFilters(listSource: ListSource, filters: Filters): Promise<ListObject[]> {
    if (filters == null || filters.filterValues.length === 0 || !filters.filtersApplied) {
      return this.getCharacters(listSource);
    }
    return this.creatureService.getCreaturesWithFilters(CreatureType.CHARACTER, listSource, filters);
  }

  getCharacter(id: string): Promise<Creature> {
    return this.creatureService.getCreature(id).then((playerCharacter: PlayerCharacter) => {
      if (playerCharacter.characterSettings == null) {
        playerCharacter.characterSettings = new CharacterSettings();
      }
      if (playerCharacter.characterSettings.pages == null || playerCharacter.characterSettings.pages.length === 0) {
        playerCharacter.characterSettings.pages = this.getDefaultPageOrders();
      }
      if (playerCharacter.characterSettings.health == null) {
        playerCharacter.characterSettings.health = new CharacterHealthSettings();
      }
      if (playerCharacter.characterSettings.equipment == null) {
        playerCharacter.characterSettings.equipment = new CharacterEquipmentSettings();
      }
      if (playerCharacter.characterSettings.spellcasting == null) {
        playerCharacter.characterSettings.spellcasting = new CharacterSpellcastingSettings();
      }
      if (playerCharacter.characterSettings.speed == null) {
        playerCharacter.characterSettings.speed = new CharacterSpeedSettings();
      }
      if (playerCharacter.characterSettings.features == null) {
        playerCharacter.characterSettings.features = new CharacterFeatureSettings();
      }
      if (playerCharacter.characterSettings.skills == null) {
        playerCharacter.characterSettings.skills = new CharacterSkillSettings();
      }
      if (playerCharacter.characterSettings.validation == null) {
        playerCharacter.characterSettings.validation = new CharacterValidationSettings();
      }
      return playerCharacter;
    });
  }

  updateCharacter(playerCharacter: PlayerCharacter): Promise<any> {
    return this.creatureService.updateCreature(playerCharacter);
  }

  updateChosenClasses(playerCharacter: PlayerCharacter, classes: ChosenClass[]): Promise<any> {
    const chosenClasses = new ChosenClasses();
    chosenClasses.chosenClasses = classes;
    return this.http.post<any>(`${environment.backendUrl}/creatures/${playerCharacter.id}/classes`, chosenClasses).toPromise();
  }

  updateChosenClassesSpellcasting(playerCharacter: PlayerCharacter, classes: ChosenClass[]): Promise<any> {
    const chosenClasses = new ChosenClasses();
    chosenClasses.chosenClasses = classes;
    return this.http.post<any>(`${environment.backendUrl}/creatures/${playerCharacter.id}/classes/spellcasting`, chosenClasses).toPromise();
  }

  updateExp(playerCharacter: PlayerCharacter, exp: number): Promise<any> {
    const characterExp = new CharacterExp();
    characterExp.exp = exp;
    return this.http.post<any>(`${environment.backendUrl}/creatures/${playerCharacter.id}/exp`, characterExp).toPromise();

  }

  postResetCreatureHealth(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): Promise<any> {
    const creatureHealth = this.resetCreatureHealth(playerCharacter, collection);
    return this.creatureService.updateCreatureHealth(playerCharacter, creatureHealth);
  }

  deleteCharacter(character: PlayerCharacter): Promise<any> {
    return this.creatureService.deleteCreature(character);
  }

  duplicateCharacter(character: PlayerCharacter, name: string): Promise<string> {
    return this.creatureService.duplicateCreature(character, name);
  }

  updatePageOrder(character: PlayerCharacter, pages: CharacterPage[]): Promise<any> {
    const characterPages = new CharacterPages();
    characterPages.pages = pages;
    return this.http.post<any>(environment.backendUrl + '/creatures/' + character.id + '/pageOrder', characterPages).toPromise();
  }

  /******************************************* Character Settings ******************************************/

  updateCharacterSettings(character: PlayerCharacter, settings: CharacterSettings): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + character.id + '/settings/character', settings).toPromise();
  }

  /******************************************* Utilities ******************************************/

  getDefaultPageOrders(): CharacterPage[] {
    const pages: CharacterPage[] = [];
    pages.push(new CharacterPage(CharacterPageType.BASIC, 0));
    pages.push(new CharacterPage(CharacterPageType.ABILITIES, 1));
    pages.push(new CharacterPage(CharacterPageType.QUICK_ACTIONS, 2));
    pages.push(new CharacterPage(CharacterPageType.EQUIPMENT, 3));
    pages.push(new CharacterPage(CharacterPageType.FEATURES, 4));
    pages.push(new CharacterPage(CharacterPageType.SPELLS, 5));
    pages.push(new CharacterPage(CharacterPageType.SKILLS, 6));
    pages.push(new CharacterPage(CharacterPageType.CONDITIONS, 7));
    pages.push(new CharacterPage(CharacterPageType.PROFICIENCIES, 8));
    pages.push(new CharacterPage(CharacterPageType.DAMAGE_MODIFIERS, 9));
    pages.push(new CharacterPage(CharacterPageType.COMPANIONS, 10, this.isPro));
    pages.push(new CharacterPage(CharacterPageType.CHARACTERISTICS, 11));
    pages.push(new CharacterPage(CharacterPageType.NOTES, 12));
    return pages;
  }

  /******************************* Health ***************************/

  initializeHealthGainResults(chosenClass: ChosenClass, levels: ListObject[]): void {
    levels.forEach((level: ListObject) => {
      chosenClass.healthGainResults.push(new HealthGainResult(level));
    });
  }

  updateHealthGainResults(chosenClass: ChosenClass, healthCalculationType: HealthCalculationType): void {
    const value = this.getMaxHealthGainResult(chosenClass.characterClass, healthCalculationType);
    chosenClass.healthGainResults.forEach((healthGainResult: HealthGainResult) => {
      if (healthCalculationType !== HealthCalculationType.ROLL || healthGainResult.value > value) {
        healthGainResult.value = value;
      }
    });
  }

  updateHealthGainResultsToMax(chosenClass: ChosenClass, healthCalculationType: HealthCalculationType, maxValue: number): void {
    chosenClass.healthGainResults.forEach((healthGainResult: HealthGainResult) => {
      if (healthCalculationType !== HealthCalculationType.ROLL || healthGainResult.value > maxValue) {
        healthGainResult.value = maxValue;
      }
    });
  }

  updateHealthGainSingleResult(healthGainResult: HealthGainResult, chosenClass: ChosenClass,
                               healthCalculationType: HealthCalculationType): void {
    const value = this.getMaxHealthGainResult(chosenClass.characterClass, healthCalculationType);
    if (healthCalculationType !== HealthCalculationType.ROLL || healthGainResult.value > value) {
      healthGainResult.value = value;
    }
  }

  getMaxHealthGainResult(characterClass: CharacterClass, healthCalculationType: HealthCalculationType): number {
    const max = this.diceService.getMaxResult(this.diceService.getClassNumHpGainDice(characterClass), this.diceService.getDiceSize(characterClass));
    if (healthCalculationType === HealthCalculationType.MAX || healthCalculationType === HealthCalculationType.ROLL) {
      return max;
    } else if (healthCalculationType === HealthCalculationType.AVERAGE) {
      return Math.floor(max / 2) + 1;
    }
    return 0;
  }

  getMaxHp(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMaxHpModifier: boolean = false): number {
    let max = this.calculateMaxHp(playerCharacter, collection);
    if (includeMaxHpModifier) {
      max += playerCharacter.creatureHealth.maxHpMod;
    }
    if (max <= 0) {
      max = 1;
    }
    return max;
  }

  updateIfOverMaxHp(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): void {
    const max = this.getMaxHP(playerCharacter, collection, true, true);
    if (playerCharacter.creatureHealth.currentHp > max) {
      playerCharacter.creatureHealth.currentHp = max;
    }
  }

  resetCreatureHealth(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): CreatureHealth {
    const creatureHealth = this.resetHpToMax(playerCharacter, collection, includeMisc, includeModifiers);
    creatureHealth.creatureHitDice = this.resetHitDiceToMax(playerCharacter, collection, includeModifiers);
    return creatureHealth;
  }

  validateHp(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): boolean {
    let valid = true;
    const maxHp = this.getMaxHP(playerCharacter, collection, true, true);
    if (playerCharacter.creatureHealth.currentHp > maxHp) {
      playerCharacter.creatureHealth.currentHp = maxHp;
      valid = false;
    }
    const hitDice = this.getMaxHitDice(playerCharacter, collection, true);
    playerCharacter.creatureHealth.creatureHitDice.forEach((hitDie: CreatureHitDice) => {
      const maxHitDie = this.getHitDie(hitDice, hitDie.diceSize);
      const max = maxHitDie == null ? 0 : maxHitDie.remaining;
      if (hitDie.remaining > max) {
        valid = false;
        hitDie.remaining = max;
      }
    });

    return valid;
  }

  private getHitDie(hitDice: CreatureHitDice[], diceSize: DiceSize): CreatureHitDice {
    return _.find(hitDice, (hitDie: CreatureHitDice) => { return hitDie.diceSize === diceSize; });
  }

  resetHpToMax(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): CreatureHealth {
    const creatureHealth = _.cloneDeep(playerCharacter.creatureHealth);
    creatureHealth.currentHp = this.getMaxHP(playerCharacter, collection, includeMisc, includeModifiers);
    creatureHealth.tempHp = 0;
    creatureHealth.numDeathSaveThrowFailures = 0;
    creatureHealth.numDeathSaveThrowSuccesses = 0;
    creatureHealth.creatureState = CreatureState.CONSCIOUS;
    creatureHealth.exhaustionLevel -= 1;
    if (creatureHealth.exhaustionLevel < 0) {
      creatureHealth.exhaustionLevel = 0;
    }
    creatureHealth.resurrectionPenalty -= 1;
    if (creatureHealth.resurrectionPenalty < 0) {
      creatureHealth.resurrectionPenalty = 0;
    }

    return creatureHealth;
  }

  resetHitDiceToMax(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeModifiers = true): CreatureHitDice[] {
    return this.getMaxHitDice(playerCharacter, collection, includeModifiers);
  }

  getMaxHitDice(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeModifiers = true): CreatureHitDice[] {
    const map: Map<DiceSize, Map<string, number>> = this.getMaxHitDiceMapped(playerCharacter, collection, includeModifiers);
    const hitDice: CreatureHitDice[] = [];
    map.forEach((value: Map<string, number>, diceSize: DiceSize) => {
      const hitDie = new CreatureHitDice();
      hitDie.diceSize = diceSize;
      hitDie.remaining = 0;

      value.forEach((remaining: number) => {
        hitDie.remaining += remaining;
      });

      hitDice.push(hitDie);
    });
    return hitDice;
  }

  getMaxHitDiceMapped(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeModifiers = true): Map<DiceSize, Map<string, number>> {
    const classMap = new Map<string, CreatureHitDice>();
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      const hitDie = this.getChosenClassMaxHitDice(chosenClass, collection, includeModifiers);
      classMap.set(chosenClass.characterClass.id, hitDie);
    });

    const hitDiceMap = new Map<DiceSize, Map<string, number>>();
    classMap.forEach((value: CreatureHitDice, key: string) => {
      const diceSize = value.diceSize;
      if (!hitDiceMap.has(diceSize)) {
        hitDiceMap.set(diceSize, new Map<string, number>());
      }
      const currentMap = hitDiceMap.get(diceSize);
      currentMap.set(key, value.remaining);
    });

    return hitDiceMap;
  }

  private getChosenClassMaxHitDice(chosenClass: ChosenClass, collection: CreatureConfigurationCollection, includeModifiers = true): CreatureHitDice {
    const classHitDice = chosenClass.characterClass.hitDice;
    const level = parseInt(chosenClass.characterLevel.name, 10);
    const hitDicePerLevel = classHitDice.numDice + classHitDice.miscModifier;
    let max = hitDicePerLevel * level + chosenClass.numHitDiceMod;

    if (includeModifiers) {
      const modifiers = this.getHitDiceMiscModifier(chosenClass.characterClass.id, collection);
      const modifiersValue = this.creatureService.getModifiers(modifiers, collection);
      max += modifiersValue;
    }

    const hitDie = new CreatureHitDice();
    hitDie.diceSize = classHitDice.diceSize;
    hitDie.remaining = max;
    return hitDie;
  }

  getHitDiceMiscModifier(characteristicId: string, collection: CreatureConfigurationCollection): Map<string, PowerModifierConfiguration> {
    for (let i = 0; i < collection.characteristicConfigurationCollection.items.length; i++) {
      const item = collection.characteristicConfigurationCollection.items[i];
      if (item.characteristicId === characteristicId) {
        return item.hitDiceModifiers;
      }
    }
    return new Map<string, PowerModifierConfiguration>();
  }

  updateCreatureHealthConfiguration(creature: Creature, characterHealthConfiguration: CharacterHealthConfiguration): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/healthConfiguration', characterHealthConfiguration).toPromise();
  }

  updateInspiration(playerCharacter: PlayerCharacter, inspired: boolean): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${playerCharacter.id}/inspiration?set=${inspired}`, {}).toPromise();
  }

  joinCampaign(characterId: string, token: string): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${characterId}/joinCampaign?token=${token}`, {}).toPromise();
  }

  leaveCampaign(characterId: string): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${characterId}/leaveCampaign`, {}).toPromise();
  }

  /********************************* Ability Score **********************************/

  getDefaultLevel(chosenClass: ChosenClass, totalLevel: CharacterLevel): number {
    const level: CharacterLevel = chosenClass != null ? chosenClass.characterLevel : totalLevel;
    return parseInt(level.name, 10);
  }

  getTotalLevel(playerCharacter: PlayerCharacter): CharacterLevel {
    return this.characterLevelService.getLevelByExp(playerCharacter.exp);
  }

  /******************************************* Spell Casting ******************************************/

  updateCharacteristicSpellcastingAbility(playerCharacter: PlayerCharacter, characteristicId: string,
                                          characteristicType: CharacteristicType, abilityId: string): Promise<any> {
    const spellcastingAbility = new SpellcastingAbility();
    spellcastingAbility.ability = abilityId;

    return this.http.post<any>(`${environment.backendUrl}/creatures/${playerCharacter.id}/spellcastingAbility/${characteristicType}/${characteristicId}`, spellcastingAbility).toPromise().then((response: any) => {
      switch (characteristicType) {
        case CharacteristicType.CLASS:
          this.updateChosenClassSpellcastingAbility(playerCharacter, characteristicId, abilityId);
          break;
        case CharacteristicType.RACE:
          playerCharacter.characterRace.spellcastingAbility = abilityId;
          break;
        case CharacteristicType.BACKGROUND:
          playerCharacter.characterBackground.spellcastingAbility = abilityId;
          break;
      }
      return response;
    });
  }

  private updateChosenClassSpellcastingAbility(playerCharacter: PlayerCharacter, characteristicId: string, ability: string): void {
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      if (chosenClass.characterClass.id === characteristicId) {
        chosenClass.spellcastingAbility = ability;
      }
    });
  }

  updateCharacteristicSpellcasting(playerCharacter: PlayerCharacter, characteristicId: string,
                                   characteristicSpellcasting: Spellcasting): Promise<any> {
    return this.creatureService.updateCharacteristicSpellcasting(playerCharacter, characteristicId, characteristicSpellcasting).then((response: any) => {
      this.updateSpellCastingForClass(playerCharacter, characteristicId, characteristicSpellcasting);
      this.updateSpellCastingForRace(playerCharacter, characteristicId, characteristicSpellcasting);
      this.updateSpellCastingForBackground(playerCharacter, characteristicId, characteristicSpellcasting);
      return response;
    });
  }

  private updateSpellCastingForClass(playerCharacter: PlayerCharacter, characteristicId: string,
                                     spellcasting: Spellcasting): void {
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      if (chosenClass.characterClass.id === characteristicId) {
        if (spellcasting.attackType === AttackType.ATTACK) {
          chosenClass.spellcastingAttack = spellcasting;
        } else if (spellcasting.attackType === AttackType.SAVE) {
          chosenClass.spellcastingSave = spellcasting;
        }
      }
    });
  }

  private updateSpellCastingForRace(playerCharacter: PlayerCharacter, characteristicId: string,
                                     spellcasting: Spellcasting): void {
    if (playerCharacter.characterRace.race.id === characteristicId) {
      if (spellcasting.attackType === AttackType.ATTACK) {
        playerCharacter.characterRace.spellcastingAttack = spellcasting;
      } else if (spellcasting.attackType === AttackType.SAVE) {
        playerCharacter.characterRace.spellcastingSave = spellcasting;
      }
    }
  }

  private updateSpellCastingForBackground(playerCharacter: PlayerCharacter, characteristicId: string,
                                    spellcasting: Spellcasting): void {
    if (playerCharacter.characterBackground.background != null && playerCharacter.characterBackground.background.id === characteristicId) {
      if (spellcasting.attackType === AttackType.ATTACK) {
        playerCharacter.characterBackground.spellcastingAttack = spellcasting;
      } else if (spellcasting.attackType === AttackType.SAVE) {
        playerCharacter.characterBackground.spellcastingSave = spellcasting;
      }
    }
  }

  getChosenClassSpellCastingAbility(chosenClass: ChosenClass,
                                    collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    if (chosenClass == null || collection == null) {
      return null;
    }

    let abilityId = chosenClass.spellcastingAbility;
    if (abilityId === '0') {
      abilityId = chosenClass.characterClass.spellCastingAbility;
    }

    return this.creatureService.getAbility(abilityId, collection);
  }

  getRaceSpellCastingAbility(characterRace: CharacterRace, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    if (characterRace == null || collection == null) {
      return null;
    }

    const abilityId = characterRace.spellcastingAbility;
    return this.creatureService.getAbility(abilityId, collection);
  }

  getBackgroundSpellCastingAbility(characterBackground: CharacterBackground,
                                   collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    if (characterBackground == null || characterBackground.background == null || collection == null) {
      return null;
    }

    const abilityId = characterBackground.background.spellCastingAbility;
    return this.creatureService.getAbility(abilityId, collection);
  }

  getCharacteristicSpellcastingAbilityId(playerCharacter: PlayerCharacter, characteristicId: string): string {
    const chosenClass = _.find(playerCharacter.classes, (_chosenClass: ChosenClass) => {
      return _chosenClass.characterClass.id === characteristicId || (_chosenClass.subclass != null && _chosenClass.subclass.id === characteristicId);
    });
    if (chosenClass != null) {
      return chosenClass.spellcastingAbility;
    }
    if (playerCharacter.characterRace.race.id === characteristicId) {
      return playerCharacter.characterRace.spellcastingAbility;
    }
    if (playerCharacter.characterBackground.background != null && playerCharacter.characterBackground.background.id === characteristicId) {
      return playerCharacter.characterBackground.spellcastingAbility;
    }
    return null;
  }

  getCreatureSpellConfiguration(creature: Creature, collection: CreatureConfigurationCollection, creatureSpell: CreatureSpell): CreatureSpellConfiguration {
    const creatureSpellConfiguration: CreatureSpellConfiguration = new CreatureSpellConfiguration();
    creatureSpellConfiguration.creatureSpell = creatureSpell;

    let characteristicId: string = creatureSpell.assignedCharacteristic;
    let chosenClass: ChosenClass = null;
    if (creature.creatureType === CreatureType.CHARACTER) {
      chosenClass = this.getChosenClass(creature as PlayerCharacter, characteristicId);
      if (chosenClass != null && chosenClass.subclass != null) {
        characteristicId = chosenClass.subclass.id;
      }
    }

    creatureSpellConfiguration.configuration = new CalculatedSpellPreparation();
    creatureSpellConfiguration.configuration.spell = creatureSpell.spell;

    const spellConfigurations: MappedSpellConfigurationCollection = collection.characteristicSpellConfigurations.get(characteristicId);
    if (spellConfigurations != null) {
      const configuration = spellConfigurations.configurations.get(creatureSpell.spell.id);
      if (configuration != null) {
        creatureSpellConfiguration.configuration.alwaysPrepared = this.isAlwaysPrepared(configuration, collection.totalLevel, chosenClass);
        creatureSpellConfiguration.configuration.countTowardsPrepared = this.countsTowardsPrepared(configuration, collection.totalLevel, chosenClass);
      }
    }

    if (creatureSpell.spell.level > 0
      && chosenClass != null
      && (chosenClass.characterClass.classSpellPreparation.requirePreparation
        || chosenClass.subclass != null && chosenClass.subclass.classSpellPreparation.requirePreparation)) {
      creatureSpellConfiguration.configuration.requiresPreparation = true;
    }

    return creatureSpellConfiguration;
  }

  private isAlwaysPrepared(configuration: SpellConfigurationCollectionItem, totalLevel: CharacterLevel, chosenClass: ChosenClass): boolean {
    if (configuration == null) {
      return false;
    }
    if (configuration.alwaysPrepared && this.isLevelAppropriate(configuration, totalLevel, chosenClass)) {
      return true;
    } else if (configuration.parent != null) {
      return this.isAlwaysPrepared(configuration.parent, totalLevel, chosenClass);
    }

    return false;
  }

  private countsTowardsPrepared(configuration: SpellConfigurationCollectionItem, totalLevel: CharacterLevel, chosenClass: ChosenClass): boolean {
    if (configuration == null) {
      return true;
    }
    if (!configuration.countTowardsPrepared && this.isLevelAppropriate(configuration, totalLevel, chosenClass)) {
      return false;
    } else if (configuration.parent != null) {
      return this.countsTowardsPrepared(configuration.parent, totalLevel, chosenClass);
    }

    return true;
  }

  private isLevelAppropriate(configuration: SpellConfigurationCollectionItem, totalLevel: CharacterLevel, chosenClass: ChosenClass): boolean {
    const configurationLevel = parseInt(configuration.levelGained.name, 10);
    const currentLevel = this.getDefaultLevel(chosenClass, totalLevel);
    return configurationLevel <= 0 || currentLevel >= configurationLevel;
  }

  getChosenClass(playerCharacter: PlayerCharacter, characteristicId: string): ChosenClass {
    for (let i = 0; i < playerCharacter.classes.length; i++) {
      const chosenClass = playerCharacter.classes[i];
      if (chosenClass.characterClass.id === characteristicId || (chosenClass.subclass != null && chosenClass.subclass.id === characteristicId)) {
        return chosenClass;
      }
    }
    return null;
  }

  /******************************************* Notes ******************************************/

  getNoteCategories(playerCharacter: PlayerCharacter, includeNone: boolean = false,
                    includeOther: boolean = false): CharacterNoteCategory[] {
    const categories: CharacterNoteCategory[] = [];
    if (includeNone) {
      const none = new CharacterNoteCategory();
      none.id = '0';
      none.name = this.translate.instant('None');
      categories.push(none);
    }
    playerCharacter.characterNotes.forEach((note: CharacterNote) => {
      const category = note.characterNoteCategory;
      if (category != null && !this.isCategoryInList(category, categories)) {
        categories.push(category);
      }
    });
    if (includeOther) {
      const other = new CharacterNoteCategory();
      other.id = '-1';
      other.name = this.translate.instant('Other');
      categories.push(other);
    }
    return categories;
  }

  private isCategoryInList(category: CharacterNoteCategory, list: CharacterNoteCategory[]): boolean {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === category.id) {
        return true;
      }
    }
    return false;
  }

  /******************************************* Powers ******************************************/

  addFeatures(playerCharacter: PlayerCharacter, features: FeatureListObject[], collection: CreatureConfigurationCollection): Promise<any> {
    return this.creatureService.addPowers(playerCharacter, this.getCreatureFeaturePowerList(features)).then((creaturePowers: CreaturePower[]) => {
      return this.resetPowerLimitedUses(creaturePowers, playerCharacter, collection, false, false, true);
    });
  }

  addSpells(playerCharacter: PlayerCharacter, spells: CreatureSpell[], collection: CreatureConfigurationCollection): Promise<CreaturePower[]> {
    return this.creatureService.addPowers(playerCharacter, this.getCreatureSpellPowerList(spells)).then((creaturePowers: CreaturePower[]) => {
      return this.resetPowerLimitedUses(creaturePowers, playerCharacter, collection, false, false, true).then(() => {
        return creaturePowers;
      });
    });
  }

  private getCreatureSpellPowerList(spells: CreatureSpell[]): CreaturePowerList {
    const powerList = new CreaturePowerList();
    spells.forEach((creatureSpell: CreatureSpell) => {
      const creaturePower = new CreaturePower();
      creaturePower.powerId = creatureSpell.spell.id;
      creaturePower.assignedCharacteristic = creatureSpell.assignedCharacteristic == null ? '0' : creatureSpell.assignedCharacteristic;
      creaturePower.powerType = PowerType.SPELL;
      powerList.creaturePowers.push(creaturePower);
    });
    return powerList;
  }

  private getCreatureFeaturePowerList(features: FeatureListObject[]): CreaturePowerList {
    const powerList = new CreaturePowerList();
    features.forEach((feature: FeatureListObject) => {
      const creaturePower = new CreaturePower();
      creaturePower.powerId = feature.id;
      creaturePower.assignedCharacteristic = feature.characteristic == null ? '0' : feature.characteristic.id;
      creaturePower.powerType = PowerType.FEATURE;
      powerList.creaturePowers.push(creaturePower);
    });
    return powerList;
  }

  removeFeature(playerCharacter: PlayerCharacter, creatureFeature: CreatureFeature): Promise<any> {
    return this.creatureService.removePower(playerCharacter, creatureFeature).then((response: any) => {
      const index = _.indexOf(playerCharacter.creatureFeatures.features, creatureFeature);
      if (index > -1) {
        playerCharacter.creatureFeatures.features.splice(index, 1);
      }
      return response;
    });
  }

  activateFeature(playerCharacter: PlayerCharacter, creatureFeature: CreatureFeature, active: boolean,
                  activeTargetCreatureId: string, collection: CreatureConfigurationCollection): Promise<any> {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();

    const power = new CreaturePower();
    power.id = creatureFeature.id;
    power.powerId = creatureFeature.feature.id;
    power.usesRemaining = creatureFeature.usesRemaining;
    power.active = active;
    power.activeTargetCreatureId = activeTargetCreatureId;
    creaturePowerList.creaturePowers.push(power);

    return this.creatureService.updateCreaturePowers(playerCharacter, creaturePowerList).then((response: any) => {
      creatureFeature.active = active;
      creatureFeature.activeTargetCreatureId = activeTargetCreatureId;

      if (active) {
        this.activateCreaturePowerModifiers(playerCharacter, creatureFeature, collection);
      } else {
        this.creatureService.deactivateCreaturePowerModifiers(creatureFeature, collection);
      }
      return response;
    });
  }

  resetLimitedUse(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection,
                  shortRest: boolean, longRest: boolean, forceReset: boolean): Promise<any> {
    let creaturePowers: CreaturePower[] = [];
    creaturePowers = creaturePowers.concat(playerCharacter.creatureFeatures.features);
    creaturePowers = creaturePowers.concat(playerCharacter.creatureSpellCasting.spells);
    return this.resetPowerLimitedUses(creaturePowers, playerCharacter, collection, shortRest, longRest, forceReset);
  }

  setLimitedUseCalculatedMax(creaturePowers: CreaturePower[], playerCharacter: PlayerCharacter,
                   collection: CreatureConfigurationCollection): void {
    creaturePowers.forEach((creaturePower: CreaturePower) => {
      const characterLevel: CharacterLevel = this.getCreaturePowerCharacterLevel(playerCharacter, creaturePower, collection);
      const limitedUse = this.powerService.getCreaturePowerLimitedUse(creaturePower, characterLevel);
      if (limitedUse != null) {
        const abilityModifier = this.getAbilityModifierForLimitedUse(limitedUse.abilityModifier, collection);
        creaturePower.calculatedMax = this.powerService.getMaxUses(limitedUse, abilityModifier);
      }
    });
  }

  getCreaturePowerCharacterLevel(playerCharacter: PlayerCharacter, creaturePower: CreaturePower, collection: CreatureConfigurationCollection): CharacterLevel {
    if (creaturePower.powerType === PowerType.SPELL) {
      const creatureSpell: CreatureSpell = creaturePower as CreatureSpell;
      return this.getCreatureSpellCharacterLevel(playerCharacter, creatureSpell, collection);
    } else if (creaturePower.powerType === PowerType.FEATURE) {
      const creatureFeature: CreatureFeature = creaturePower as CreatureFeature;
      return this.getCreatureFeatureCharacterLevel(playerCharacter, creatureFeature, collection);
    }
    return null;
  }

  getCreaturePowerActiveLevel(creaturePower: CreaturePower): number {
    if (creaturePower.powerType === PowerType.SPELL) {
      const creatureSpell: CreatureSpell = creaturePower as CreatureSpell;
      return creatureSpell.activeLevel;
    }
    return 0;
  }

  getCreaturePowerBaseLevel(creaturePower: CreaturePower): number {
    if (creaturePower.powerType === PowerType.SPELL) {
      const creatureSpell: CreatureSpell = creaturePower as CreatureSpell;
      return creatureSpell.spell.level;
    }
    return 0;
  }

  resetSpellLimitedUses(creatureSpells: CreatureSpell[], creature: Creature): Promise<any> {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();

    creatureSpells.forEach((creatureSpell: CreatureSpell) => {
      const power = new CreaturePower();
      power.id = creatureSpell.id;
      power.powerId = creatureSpell.powerId;
      power.usesRemaining = creatureSpell.innateMaxUses;
      power.active = creatureSpell.active;
      creaturePowerList.creaturePowers.push(power);
    });

    return this.creatureService.updateCreaturePowers(creature, creaturePowerList).then((response: any) => {
      creatureSpells.forEach((creatureSpell: CreatureSpell) => {
        creatureSpell.usesRemaining = creatureSpell.innateMaxUses;
      });

      return response;
    });
  }

  resetPowerLimitedUses(creaturePowers: CreaturePower[], playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection,
                        shortRest: boolean, longRest: boolean, forceReset: boolean): Promise<any> {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    const powers: CreaturePower[] = [];
    creaturePowers.forEach((creaturePower: CreaturePower) => {
      if (this.shouldResetPower(creaturePower, shortRest, longRest, forceReset)) {
        powers.push(creaturePower);
      }
    });

    const usesRemaining = new Map<string, number>();
    this.setLimitedUseCalculatedMax(powers, playerCharacter, collection);

    powers.forEach((creaturePower: CreaturePower) => {
        usesRemaining.set(creaturePower.powerId, creaturePower.calculatedMax);

        const power = new CreaturePower();
        power.id = creaturePower.id;
        power.powerId = creaturePower.powerId;
        power.usesRemaining = creaturePower.calculatedMax;
        power.active = creaturePower.active;
        creaturePowerList.creaturePowers.push(power);
    });

    return this.creatureService.updateCreaturePowers(playerCharacter, creaturePowerList).then((response: any) => {
      powers.forEach((creaturePower: CreaturePower) => {
        const remaining = usesRemaining.get(creaturePower.powerId);
        if (remaining != null && remaining !== -1) {
          creaturePower.usesRemaining = remaining;
        }
      });

      return response;
    });
  }

  getCreatureFeatureCharacterLevel(playerCharacter: PlayerCharacter, creatureFeature: CreatureFeature, collection: CreatureConfigurationCollection): CharacterLevel {
    if (playerCharacter == null || creatureFeature == null) {
      return null;
    }

    let characterLevel: CharacterLevel = null;
    if (creatureFeature.characteristicType !== CharacteristicType.CLASS) {
      if (collection.totalLevel.id === '0') {
        collection.totalLevel = this.getTotalLevel(playerCharacter);
      }
      characterLevel = collection.totalLevel;
    } else {
      const chosenClass = this.getChosenClass(playerCharacter, creatureFeature.assignedCharacteristic);
      if (chosenClass != null) {
        characterLevel = chosenClass.characterLevel;
      }
    }

    //todo - if level gained > current level -> return null

    return characterLevel;
  }

  getCreatureSpellCharacterLevel(playerCharacter: PlayerCharacter, creatureSpell: CreatureSpell, collection: CreatureConfigurationCollection): CharacterLevel {
    if (playerCharacter == null || creatureSpell == null) {
      return null;
    }

    let characterLevel = null;
    if (creatureSpell.spell.level === 0 || creatureSpell.characteristicType !== CharacteristicType.CLASS) {
      characterLevel = collection.totalLevel;
    } else {
      const chosenClass = this.getChosenClass(playerCharacter, creatureSpell.assignedCharacteristic);
      if (chosenClass != null) {
        characterLevel = chosenClass.characterLevel;
      }
    }

    return characterLevel;
  }

  private shouldResetPower(creaturePower: CreaturePower, shortRest: boolean, longRest: boolean, forceReset: boolean): boolean {
    return creaturePower.limitedUses.length > 0 && (forceReset ||
        (creaturePower.rechargeOnLongRest && (longRest || shortRest)) ||
        (creaturePower.rechargeOnShortRest && shortRest));
  }

  private getAbilityModifierForLimitedUse(abilityId: string, collection: CreatureConfigurationCollection): number {
    const ability = this.creatureService.getAbility(abilityId, collection);
    if (ability != null) {
      return this.creatureService.getAbilityModifier(ability, collection);
    }
    return 0;
  }

  getSpells(playerCharacter: PlayerCharacter, filterSorts: FilterSorts, collection: CreatureConfigurationCollection): Promise<CreatureSpell[]> {
    return this.creatureService.getSpells(playerCharacter, filterSorts).then((spells: CreatureSpell[]) => {
      this.updateHiddenByPrepared(spells, playerCharacter, filterSorts.filters, collection);
      return spells;
    });
  }

  public updateHiddenByPrepared(spells: CreatureSpell[], playerCharacter: PlayerCharacter, filters: Filters, collection: CreatureConfigurationCollection): void {
    const preparedFilter = this.getFilterValue(FilterKey.PREPARED, filters.filterValues);

    if (preparedFilter != null && preparedFilter.value !== DEFAULT_FILTER_VALUE) {
      spells.forEach((creatureSpell: CreatureSpell) => {
        let hidden = true;
        const creatureSpellConfiguration: CreatureSpellConfiguration = this.getCreatureSpellConfiguration(playerCharacter, collection, creatureSpell);
        if (preparedFilter.value === FILTER_VALUE_YES) {
          if (!creatureSpellConfiguration.configuration.requiresPreparation
            || creatureSpell.spell.level === 0
            || creatureSpell.prepared
            || creatureSpellConfiguration.configuration.alwaysPrepared) {
            hidden = false;
          }
        } else if (preparedFilter.value === FILTER_VALUE_NO) {
          if (!creatureSpellConfiguration.configuration.requiresPreparation
            || creatureSpell.spell.level === 0
            || (!creatureSpell.prepared && !creatureSpellConfiguration.configuration.alwaysPrepared)) {
            hidden = false;
          }
        }

        creatureSpell.hidden = creatureSpell.hidden || hidden;
      });
    }
  }

  private getFilterValue(key: FilterKey, filterValues: FilterValue[]): FilterValue {
    for (let i = 0; i < filterValues.length; i++) {
      const filter = filterValues[i];
      if (filter.key === key) {
        return filter;
      }
    }
    return null;
  }

  updateCreatureSpell(creature: Creature, creatureSpell: CreatureSpell,
                      active: boolean, activeTargetCreatureId: string, concentrating: boolean, level: number,
                      concentratingSpell: CreatureSpell, collection: CreatureConfigurationCollection, updateInnateUses: boolean = true): Promise<any> {
    const creatureSpellList: CreatureSpellList = new CreatureSpellList();
    const spell =  _.cloneDeep(creatureSpell);
    spell.active = active;
    spell.activeTargetCreatureId = activeTargetCreatureId;
    spell.concentrating = concentrating;
    spell.activeLevel = (active || concentrating) ? level : 0;
    if (updateInnateUses && spell.innate && spell.innateMaxUses > 0) {
      spell.usesRemaining--;
      if (spell.usesRemaining < 0) {
        spell.usesRemaining = 0;
      }
    }

    if (concentratingSpell != null && concentrating) {
      const concentrate =  _.cloneDeep(concentratingSpell);
      concentrate.active = false;
      concentrate.activeTargetCreatureId = '0';
      concentrate.concentrating = false;
      concentrate.activeLevel = 0;
      creatureSpellList.creatureSpells.push(concentrate);
    }

    creatureSpellList.creatureSpells.push(spell);

    return this.creatureService.updateCreatureSpells(creature, creatureSpellList).then((response: any) => {
      creatureSpell.active = active;
      creatureSpell.activeTargetCreatureId = activeTargetCreatureId;
      creatureSpell.concentrating = concentrating;
      creatureSpell.activeLevel = level;
      creatureSpell.usesRemaining = spell.usesRemaining;

      if (active) {
        if (creature.creatureType === CreatureType.CHARACTER) {
          this.activateCreaturePowerModifiers(creature as PlayerCharacter, creatureSpell, collection);
        }
      } else {
        this.creatureService.deactivateCreaturePowerModifiers(creatureSpell, collection);
      }

      if (concentratingSpell != null && concentrating) {
        concentratingSpell.active = false;
        concentratingSpell.concentrating = false;
        concentratingSpell.activeLevel = 0;

        this.creatureService.deactivateCreaturePowerModifiers(concentratingSpell, collection)
      }
      return response;
    });
  }

  //todo - combine with getPowerModifiers
  getCreaturePowerModifiers(power: CreaturePower, playerCharacter: PlayerCharacter, characterLevel: CharacterLevel,
                            collection: CreatureConfigurationCollection, baseLevel = 0, extraLevel  = 0): ModifierConfigurationCollection {
    if (power == null) {
      return null;
    }

    const configuration = this.powerService.initializeModifierConfigurationsCreaturePower(power);
    if (playerCharacter == null || characterLevel == null || collection == null) {
      return configuration;
    }

    const levels = this.characterLevelService.getLevelsDetailedFromStorage();
    const modifiers =  _.cloneDeep(configuration.modifierConfigurations);

    if (configuration.advancementModifiers) {
      configuration.advancementModifierConfigurations.forEach((modifier: ModifierConfiguration) => {
        if (this.includeModifierForCharacterLevel(modifier, characterLevel, levels)) {
          modifiers.push(_.cloneDeep(modifier));
        }
      });

      configuration.advancementModifiers = false;
      configuration.advancementModifierConfigurations = [];
    } else if (configuration.extraModifiers && extraLevel > baseLevel) {
      const numSteps = (extraLevel - baseLevel) / configuration.numLevelsAboveBase;
      for (let i = 0; i < numSteps; i++) {
        configuration.extraModifierConfigurations.forEach((damage: ModifierConfiguration) => {
          configuration.modifierConfigurations.push(damage);
        });
      }
    }

    configuration.modifierConfigurations = this.powerService.combineModifiers(modifiers);
    return configuration;
  }

  getPowerModifiers(power: Power, playerCharacter: PlayerCharacter, characterLevel: CharacterLevel,
                    collection: CreatureConfigurationCollection, baseLevel = 0, extraLevel  = 0): ModifierConfigurationCollection {
    if (power == null) {
      return null;
    }

    const configuration = this.powerService.initializeModifierConfigurations(power);
    if (playerCharacter == null || characterLevel == null || collection == null) {
      return configuration;
    }

    const levels = this.characterLevelService.getLevelsDetailedFromStorage();
    const modifiers =  _.cloneDeep(configuration.modifierConfigurations);

    if (configuration.advancementModifiers) {
      configuration.advancementModifierConfigurations.forEach((modifier: ModifierConfiguration) => {
        if (this.includeModifierForCharacterLevel(modifier, characterLevel, levels)) {
          modifiers.push(_.cloneDeep(modifier));
        }
      });

      configuration.advancementModifiers = false;
      configuration.advancementModifierConfigurations = [];
    } else if (configuration.extraModifiers && extraLevel > baseLevel) {
      const numSteps = (extraLevel - baseLevel) / configuration.numLevelsAboveBase;
      for (let i = 0; i < numSteps; i++) {
        configuration.extraModifierConfigurations.forEach((damage: ModifierConfiguration) => {
          configuration.modifierConfigurations.push(damage);
        });
      }
    }

    configuration.modifierConfigurations = this.powerService.combineModifiers(modifiers);
    return configuration;
  }

  private includeModifierForCharacterLevel(modifier: ModifierConfiguration, characterLevel: CharacterLevel, levels: CharacterLevel[]): boolean {
    if (characterLevel == null) {
      return false;
    }
    const level = this.getLevel(modifier.level, levels);
    return level != null && level.minExp <= characterLevel.minExp;
  }

  getMaxAbilityModifierValue(classes: ChosenClass[], playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    const ability = this.getMaxAbilityModifier(classes, playerCharacter, collection);
    return this.creatureService.getAbilityModifier(ability, collection);
  }

  getMaxAbilityModifier(classes: ChosenClass[], playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    let max = 0;
    let maxAbility: CreatureAbilityProficiency = null;
    for (let i = 0; i < classes.length; i++) {
      const chosenClass = classes[i];
      const ability: CreatureAbilityProficiency = this.getChosenClassSpellCastingAbility(chosenClass, collection);
      const modifierValue = this.creatureService.getAbilityModifier(ability, collection);

      if (modifierValue > max) {
        max = modifierValue;
        maxAbility = ability;
      }
    }

    return maxAbility;
  }

  getMaxSpellAttackModifier(magicalItem: MagicalItem, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    const characterClasses = this.getMagicalItemApplicableClasses(magicalItem, playerCharacter);
    return this.getMaxPowerModifierValue(characterClasses, AttackType.ATTACK, playerCharacter, collection);
  }

  getMaxSpellSaveDC(magicalItem: MagicalItem, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    const characterClasses = this.getMagicalItemApplicableClasses(magicalItem, playerCharacter);
    return this.getMaxPowerModifierValue(characterClasses, AttackType.SAVE, playerCharacter, collection);
  }

  private getMaxPowerModifierValue(classes: ChosenClass[], attackType: AttackType, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    const modifier = this.getMaxPowerModifier(classes, attackType, playerCharacter, collection);
    if (modifier != null) {
      const powerModifier = this.creatureService.getModifiers(modifier.modifiers, collection);
      if (attackType === AttackType.ATTACK) {
        return this.spellService.getSpellAttackModifier(modifier, powerModifier, playerCharacter);
      } else {
        return this.spellService.getSpellSaveDC(modifier, powerModifier);
      }
    } else {
      const prof = this.creatureService.getProfModifier(collection);
      if (attackType === AttackType.ATTACK) {
        return prof;
      } else {
        return 8 + prof;
      }
    }
  }

  private getMaxPowerModifier(classes: ChosenClass[], attackType: AttackType, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): PowerModifier {
    let max = 0;
    let maxModifier: PowerModifier = null;

    for (let i = 0; i < classes.length; i++) {
      const chosenClass = classes[i];
      const ability: CreatureAbilityProficiency = this.getChosenClassSpellCastingAbility(chosenClass, collection);
      const spellcasting = attackType === AttackType.ATTACK ? chosenClass.spellcastingAttack : chosenClass.spellcastingSave;
      const modifier = this.creatureService.getSpellModifier(ability, collection, spellcasting, attackType, chosenClass.characterClass.id);

      let modifierValue = 0;
      const powerModifier = this.creatureService.getModifiers(modifier.modifiers, collection);
      if (attackType === AttackType.ATTACK) {
        modifierValue = this.spellService.getSpellAttackModifier(modifier, powerModifier, playerCharacter);
      } else {
        modifierValue = this.spellService.getSpellSaveDC(modifier, powerModifier);
      }

      if (modifierValue > max) {
        max = modifierValue;
        maxModifier = modifier;
      }
    }

    return maxModifier;
  }

  private getClasses(classes: ListObject[], playerCharacter: PlayerCharacter): ChosenClass[] {
    const matchedClasses: ChosenClass[] = [];
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      const index = _.findIndex(classes, (_class: ListObject) => {
        return _class.id === chosenClass.characterClass.id;
      });
      if (index > -1) {
        matchedClasses.push(chosenClass);
      }
    });
    return matchedClasses;
  }

  getPowerDamages(power: Power, playerCharacter: PlayerCharacter, characterLevel: CharacterLevel,
                  collection: CreatureConfigurationCollection, attackModifier: PowerModifier,
                  saveModifier: PowerModifier): DamageConfigurationCollection {
    return this.creatureService.getPowerDamages(power, playerCharacter, characterLevel, collection, attackModifier, saveModifier)
  }

  private getLevel(level: ListObject, levels: CharacterLevel[]): CharacterLevel {
    for (let i = 0; i < levels.length; i++) {
      const l: CharacterLevel = levels[i];
      if (l.id === level.id) {
        return l;
      }
    }
    return null;
  }

  validateCharacter(playerCharacter: PlayerCharacter): Promise<CharacterValidationItem[]> {
    return this.creatureService.validateCreature(playerCharacter).then((items: CharacterValidationItem[]) => {
      const filtered: CharacterValidationItem[] = [];
      items.forEach((item: CharacterValidationItem) => {
        if (!item.valid) {
          filtered.push(item);
        }
      });
      return filtered;
    });
  }

  resetIgnoredFeatures(playerCharacter: PlayerCharacter): Promise<any> {
    return this.http.post<any[]>(`${environment.backendUrl}/creatures/${playerCharacter.id}/validate/reset`, {}).toPromise();
  }

  /******************************************* Items ******************************************/

  addItems(playerCharacter: PlayerCharacter, selectedItems: SelectionItem[], containerId: string, collection: CreatureConfigurationCollection): Promise<AddItemResponse[]> {
    const creatureItemList = new CreatureInventory();
    creatureItemList.items = selectedItems;
    creatureItemList.containerId = containerId;

    return this.creatureService.addItems(playerCharacter, creatureItemList).then((responses: AddItemResponse[]) => {
      //todo - reset item limited uses/charges
      return responses;
    });
  }

  /******************************************* Configurations ******************************************/

  addCharacterToCollection(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): void {
    this.creatureService.addCreatureToCollection(playerCharacter, collection);
    this.initializeCharacterSpellConfigurations(playerCharacter, collection);
    if (playerCharacter.creatureSpellCasting != null) {
      this.initializeCreatureModifiers(playerCharacter, playerCharacter.creatureSpellCasting.spells, collection);
    }
    if (playerCharacter.creatureFeatures != null) {
      this.initializeCreatureFeatureModifiers(playerCharacter, playerCharacter.creatureFeatures.features, collection);
    }
    this.setAbilityScoreIncreasesToCollection(playerCharacter, collection);
    collection.totalLevel = this.getTotalLevel(playerCharacter);
  }

  initializeCreatureModifiers(playerCharacter: PlayerCharacter, creaturePowers: CreaturePower[], collection: CreatureConfigurationCollection): void {
    creaturePowers.forEach((creaturePower: CreaturePower) => {
      if (creaturePower.active) {
        this.activateCreaturePowerModifiers(playerCharacter, creaturePower, collection)
      }
    });
  }

  initializeCreatureFeatureModifiers(playerCharacter: PlayerCharacter, creatureFeatures: CreatureFeature[], collection: CreatureConfigurationCollection): void {
    creatureFeatures.forEach((creatureFeature: CreatureFeature) => {
      if (creatureFeature.feature.passive) {
        creatureFeature.activeTargetCreatureId = playerCharacter.id;
      }
      if (creatureFeature.active || creatureFeature.feature.passive) {
        this.activateCreaturePowerModifiers(playerCharacter, creatureFeature, collection)
      }
    });
  }

  private initializeCharacterSpellConfigurations(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): void {
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      if (chosenClass.characterClass != null) {
        const characteristicId = chosenClass.characterClass.id;
        this.addCharacteristicToSpellConfigurations(characteristicId, collection);
      }
    });
    if (playerCharacter.characterRace.race != null) {
      this.addCharacteristicToSpellConfigurations(playerCharacter.characterRace.race.id, collection);
    }
    if (playerCharacter.characterBackground.background != null) {
      this.addCharacteristicToSpellConfigurations(playerCharacter.characterBackground.background.id, collection);
    }
    this.addCharacteristicToSpellConfigurations('0', collection);
  }

  private addCharacteristicToSpellConfigurations(characteristicId: string, collection: CreatureConfigurationCollection): void {
    const item = new CreatureCharacteristicConfigurationCollectionItem();
    item.characteristicId = characteristicId;
    collection.characteristicConfigurationCollection.items.push(item);
  }

  activateCreaturePowerModifiers(playerCharacter: PlayerCharacter, creaturePower: CreaturePower, collection: CreatureConfigurationCollection): void {
    if (creaturePower.activeTargetCreatureId !== playerCharacter.id) {
      return;
    }

    const configuration: ModifierConfigurationCollection = this.powerService.initializeCreaturePowerModifierConfigurations(creaturePower);
    const levels: CharacterLevel[] = this.characterLevelService.getLevelsDetailedFromStorage();
    const modifiers =  _.cloneDeep(configuration.modifierConfigurations);
    if (configuration.advancementModifiers) {
      const characterLevel: CharacterLevel = this.getCreaturePowerCharacterLevel(playerCharacter, creaturePower, collection);
      configuration.advancementModifierConfigurations.forEach((modifier: ModifierConfiguration) => {
        if (this.includeModifierForCharacterLevel(modifier, characterLevel, levels)) {
          modifiers.push(_.cloneDeep(modifier));
        }
      });

      configuration.advancementModifiers = false;
      configuration.advancementModifierConfigurations = [];
    } else if (configuration.extraModifiers && configuration.numLevelsAboveBase > 0) {
      const activeLevel = this.getCreaturePowerActiveLevel(creaturePower);
      const baseLevel = this.getCreaturePowerBaseLevel(creaturePower);
      const numSteps = (activeLevel - baseLevel) / configuration.numLevelsAboveBase;
      for (let i = 0; i < numSteps; i++) {
        configuration.extraModifierConfigurations.forEach((damage: ModifierConfiguration) => {
          modifiers.push(damage);
        });
      }
    }

    configuration.modifierConfigurations = this.powerService.combineModifiers(modifiers);

    configuration.modifierConfigurations.forEach((modifierConfiguration: ModifierConfiguration) => {
      this.creatureService.activeSingleCreaturePowerModifier(creaturePower, modifierConfiguration, collection);
    });
  }

  private setAbilityScoreIncreasesToCollection(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): void {
    playerCharacter.abilitiesToIncreaseByOne.forEach((ability: ListObject) => {
      const prof = this.creatureService.getCreatureListProficiencyBySid(ability.sid, collection.proficiencyCollection.abilityProficiencies);
      if (prof != null) {
        prof.proficient = true;
        prof.proficiency.proficient = true;
      }
    });
  }

  initializeCharacteristics(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): Promise<any> {
    const promises: Promise<any>[] = [];
    const backgroundId = playerCharacter.characterBackground.background == null ? '0' : playerCharacter.characterBackground.background.id;
    if (backgroundId !== '0') {
      promises.push(this.creatureService.addCharacteristicToCollection(collection, playerCharacter.characterBackground.background));
      collection.backgroundConfigurationCollection = this.initializeBackgroundConfigurationCollection(
        playerCharacter.characterBackground,
        playerCharacter.characterBackground.background);
    }
    promises.push(this.creatureService.addCharacteristicToCollection(collection, playerCharacter.characterRace.race));
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      promises.push(this.creatureService.addCharacteristicToCollection(collection, chosenClass.characterClass, chosenClass.primary));

      if (chosenClass.subclass != null && chosenClass.subclass.parent == null) {
        chosenClass.subclass.parent = chosenClass.characterClass;
      }
      promises.push(this.creatureService.addCharacteristicToCollection(collection, chosenClass.subclass, chosenClass.primary));
    });

    return Promise.all(promises);
  }

  setFromCollections(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): void {
    this.creatureService.setFromCollections(playerCharacter, collection);
    this.setAbilityScoreIncreases(playerCharacter, collection);
    this.setBackgroundFromCollection(playerCharacter.characterBackground, collection.backgroundConfigurationCollection);
  }

  private setAbilityScoreIncreases(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): void {
    playerCharacter.abilitiesToIncreaseByOne = [];
    collection.proficiencyCollection.abilityProficiencies.forEach((ability: CreatureListProficiency) => {
      if (ability.proficient) {
        playerCharacter.abilitiesToIncreaseByOne.push(ability.item);
      }
    });
  }

  initializeBackgroundConfigurationCollection(characterBackground: CharacterBackground,
                                              background: Background): CharacterBackgroundTraitCollection {
    const collection = new CharacterBackgroundTraitCollection();
    collection.variations = this.initializeTraits(this.backgroundService.getAllVariations(background), characterBackground.chosenTraits,
      characterBackground.customVariation);
    collection.personalities = this.initializeTraits(this.backgroundService.getAllPersonalities(background), characterBackground.chosenTraits,
      characterBackground.customPersonality);
    collection.ideals = this.initializeTraits(this.backgroundService.getAllIdeals(background), characterBackground.chosenTraits,
      characterBackground.customIdeal);
    collection.bonds = this.initializeTraits(this.backgroundService.getAllBonds(background), characterBackground.chosenTraits,
      characterBackground.customBond);
    collection.flaws = this.initializeTraits(this.backgroundService.getAllFlaws(background), characterBackground.chosenTraits,
      characterBackground.customFlaw);
    return collection;
  }

  private initializeTraits(traits: BackgroundTrait[], chosenTraits: BackgroundTrait[],
                           customTrait: string): CharacterBackgroundTraitCollectionItem[] {
    const items: CharacterBackgroundTraitCollectionItem[] = [];
    traits.forEach((trait: BackgroundTrait) => {
      const item = new CharacterBackgroundTraitCollectionItem();
      item.backgroundTrait = trait;
      item.selected = this.isChosen(trait, chosenTraits);
      items.push(item);
    });
    const other = new CharacterBackgroundTraitCollectionItem();
    other.backgroundTrait = null;
    other.selected = this.isChosen(null, chosenTraits) || customTrait.length > 0;
    items.push(other);
    return items;
  }

  private isChosen(trait: BackgroundTrait, chosenTraits: BackgroundTrait[]): boolean {
    for (let i = 0; i < chosenTraits.length; i++) {
      if (trait == null && chosenTraits[i].backgroundTraitType === BackgroundTraitType.NONE) {
        return true;
      }
      if (trait != null && chosenTraits[i].description === trait.description) {
        return true;
      }
    }
    return false;
  }

  private setBackgroundFromCollection(characterBackground: CharacterBackground, collection: CharacterBackgroundTraitCollection): void {
    characterBackground.chosenTraits = [];
    this.setBackgroundFromCollectionItems(characterBackground, collection.variations);
    this.setBackgroundFromCollectionItems(characterBackground, collection.personalities);
    this.setBackgroundFromCollectionItems(characterBackground, collection.ideals);
    this.setBackgroundFromCollectionItems(characterBackground, collection.bonds);
    this.setBackgroundFromCollectionItems(characterBackground, collection.flaws);
  }

  private setBackgroundFromCollectionItems(characterBackground: CharacterBackground,
                                           traits: CharacterBackgroundTraitCollectionItem[]): void {
    traits.forEach((trait: CharacterBackgroundTraitCollectionItem) => {
      if (trait.selected) {
        characterBackground.chosenTraits.push(trait.backgroundTrait);
      }
    });
  }

  /**************************** Tooltips ******************************/

  getMaxPreparedTooltip(classSpellPreparation: ClassSpellPreparation, chosenClass: ChosenClass, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): string {
    if (classSpellPreparation == null || !classSpellPreparation.requirePreparation) {
      return '';
    }

    let parts = [];
    const ability: CreatureAbilityProficiency = classSpellPreparation.numToPrepareAbilityModifier == null ? null : this.creatureService.getAbility(classSpellPreparation.numToPrepareAbilityModifier.id, collection);
    const abilityModifier = this.creatureService.getAbilityModifier(ability, collection);
    parts.push(this.translate.instant('Labels.Ability') + ' ' + abilityModifier);

    const levelModifier = this.getPreparationLevelModifier(classSpellPreparation, chosenClass);
    if (levelModifier !== 0) {
      parts.push(this.translate.instant('Labels.LevelLabel') + ' ' + this.abilityService.convertScoreToString(levelModifier));
    }

    if (includeModifiers) {
      const characteristicId = chosenClass == null ? '0' : chosenClass.characterClass.id;
      const config = this.creatureService.getCharacteristicPowerModifier(characteristicId, collection);

      if (config != null) {
        const modifierTooltips: string[] = this.creatureService.getModifierTooltips(config.spellPreparationModifiers, collection);
        parts = parts.concat(modifierTooltips);
      }
    }

    if (includeMisc && classSpellPreparation.numToPrepareMiscModifier !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' ' + classSpellPreparation.numToPrepareMiscModifier);
    }

    return parts.join('\n');
  }

  getMaxPrepared(classSpellPreparation: ClassSpellPreparation, chosenClass: ChosenClass, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): number {
    let max = 0;
    if (classSpellPreparation != null && classSpellPreparation.requirePreparation) {
      const ability: CreatureAbilityProficiency = classSpellPreparation.numToPrepareAbilityModifier == null ? null : this.creatureService.getAbility(classSpellPreparation.numToPrepareAbilityModifier.id, collection);
      max = this.creatureService.getAbilityModifier(ability, collection);

      const levelModifier = this.getPreparationLevelModifier(classSpellPreparation, chosenClass);
      max += levelModifier;

      if (includeModifiers) {
        const characteristicId = chosenClass == null ? '0' : chosenClass.characterClass.id;
        const config = this.creatureService.getCharacteristicPowerModifier(characteristicId, collection);

        if (config != null) {
          max += this.creatureService.getModifiers(config.spellPreparationModifiers, collection);
        }
      }

      if (includeMisc) {
        max += classSpellPreparation.numToPrepareMiscModifier;
      }

      return max;
    }
    return 0;
  }

  private getPreparationLevelModifier(classSpellPreparation: ClassSpellPreparation, chosenClass: ChosenClass): number {
    let levelModifier = 0;
    if (classSpellPreparation.numToPrepareIncludeLevel) {
      levelModifier = chosenClass == null ? 0 : parseInt(chosenClass.characterLevel.name, 10);
      if (classSpellPreparation.numToPrepareIncludeHalfLevel) {
        levelModifier = levelModifier / 2;
      }
    }
    return levelModifier;
  }

  wearingBodyArmor(playerCharacter: PlayerCharacter): boolean {
    return this.creatureService.wearingBodyArmor(playerCharacter);
  }

  private calculateAC(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    let ac = 0;
    if (!this.wearingBodyArmor(playerCharacter)) {
      const abilities = this.creatureService.getAbilities(playerCharacter.acAbilities, collection);
      ac = 10;
      abilities.forEach((ability: CreatureAbilityProficiency) => {
        ac += this.creatureService.getAbilityModifier(ability, collection);
      });
    }
    return ac + this.calculateEquippedArmor(playerCharacter, collection);
  }

  calculateEquippedArmor(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    return this.creatureService.calculateEquippedArmor(playerCharacter, collection);
  }

  getEquippedArmorTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): LabelValue[] {
    const parts: LabelValue[] = [];
    const armors = this.creatureService.getEquippedArmorItems(playerCharacter);
    armors.forEach((armorItem: CreatureItem) => {
      let ac = 0;
      let name = '';
      if (armorItem.itemType === ItemType.ARMOR) {
        const armor = armorItem.item as Armor;
        name = armor.name;
        ac = this.creatureService.getArmorAC(armor, armorItem, collection);
      } else if (armorItem.itemType === ItemType.MAGICAL_ITEM) {
        let baseArmor: Armor = null;
        name = armorItem.item.name;
        if (armorItem.magicalItem != null && armorItem.magicalItem.itemType === ItemType.ARMOR) {
          baseArmor = armorItem.magicalItem as Armor;
          name += ' (' + baseArmor.name + ')';
        }
        ac = this.creatureService.getArmorAC(baseArmor, armorItem, collection);
      }
      parts.push(new LabelValue(name, ac.toString(10)));
    });
    return parts;
  }

  getAC(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): number {
    let ac = this.calculateAC(playerCharacter, collection);

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.AC, collection);
      if (includeModifiers) {
        ac += this.creatureService.getModifiers(miscModifier.modifiers, collection);
      }
      if (includeMisc) {
        ac += this.creatureService.getMiscModifierValue(miscModifier);
      }
    }

    return ac;
  }

  getACTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): string {
    let parts = [];

    const useBase = !this.wearingBodyArmor(playerCharacter);
    if (useBase) {
      parts.push(this.translate.instant('Base') + ': 10')
      const abilities = this.creatureService.getAbilities(playerCharacter.acAbilities, collection);
      abilities.forEach((ability: CreatureAbilityProficiency) => {
        const abilityModifier = this.creatureService.getAbilityModifier(ability, collection);
        parts.push(ability.ability.abbr + ': ' + abilityModifier.toString(10));
      });
    }

    const itemsDisplay = this.getEquippedArmorTooltip(playerCharacter, collection);
    itemsDisplay.forEach((labelValue: LabelValue) => {
      parts.push(labelValue.label + ': ' + labelValue.value);
    });

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.AC, collection);
      if (includeModifiers) {
        const modifierTooltips: string[] = this.creatureService.getModifierTooltips(miscModifier.modifiers, collection);
        parts = parts.concat(modifierTooltips);
      }
      if (includeMisc) {
        parts = parts.concat(this.creatureService.getMiscModifierTooltip(miscModifier));
      }
    }

    return parts.join('\n');
  }

  private calculateMaxHp(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    let max = 0;
    const hpModifier = playerCharacter.hpGainModifier;
    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, collection);
    const conModifier = this.creatureService.getAbilityModifier(con, collection);
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      const maxLevel = chosenClass.characterLevel;
      if (maxLevel != null) {
        for (let i = 0; i < chosenClass.healthGainResults.length; i++) {
          const result = chosenClass.healthGainResults[i];
          if (chosenClass.primary && i === 0) {
            if (chosenClass.characterClass != null) {
              max += chosenClass.characterClass.hpAtFirst.numDice;
            }
          } else {
            max += result.value;
          }
          max += hpModifier + conModifier;
          if (result.level.id === maxLevel.id) {
            break;
          }
        }
      }
    });
    return max;
  }

  getMaxHpMiscModifier(characteristicId: string, collection: CreatureConfigurationCollection): Map<string, PowerModifierConfiguration> {
    for (let i = 0; i < collection.characteristicConfigurationCollection.items.length; i++) {
      const item = collection.characteristicConfigurationCollection.items[i];
      if (item.characteristicId === characteristicId) {
        return item.maxHpModifiers;
      }
    }
    return new Map<string, PowerModifierConfiguration>();
  }

  getCharacteristics(playerCharacter: PlayerCharacter): string[] {
    const characteristics: string[] = [];
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      characteristics.push(chosenClass.characterClass.id);
      if (chosenClass.subclass != null) {
        characteristics.push(chosenClass.subclass.id);
      }
    });
    characteristics.push(playerCharacter.characterRace.race.id);
    if (playerCharacter.characterBackground.background != null) {
      characteristics.push(playerCharacter.characterBackground.background.id);
    }
    return characteristics;
  }

  getMaxHP(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true, includePenalties = true): number {
    let max = this.calculateMaxHp(playerCharacter, collection);

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.MAX_HP, collection);
      if (includeModifiers) {
        max += this.creatureService.getModifiers(miscModifier.modifiers, collection);

        const characteristics = this.getCharacteristics(playerCharacter);
        characteristics.forEach((characteristic: string) => {
          const modifiers = this.getMaxHpMiscModifier(characteristic, collection);
          const modifiersValue = this.creatureService.getModifiers(modifiers, collection);
          max += modifiersValue;
        });
      }
      if (includeMisc) {
        max += playerCharacter.creatureHealth.maxHpMod;
      }
    }

    if (includePenalties) {
      if (playerCharacter.creatureHealth.exhaustionLevel >= 4) {
        max = Math.floor(max / 2);
      }
    }

    if (max <= 0) {
      max = 1;
    }

    return max;
  }

  getMaxHPTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true, includePenalties = true): string {
    let parts = [];
    const max = this.calculateMaxHp(playerCharacter, collection);
    parts.push(this.translate.instant('Labels.Max') + ' ' + max);

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.MAX_HP, collection);
      if (includeModifiers) {
        const modifierTooltips: string[] = this.creatureService.getModifierTooltips(miscModifier.modifiers, collection);
        parts = parts.concat(modifierTooltips);

        const characteristics = this.getCharacteristics(playerCharacter);
        characteristics.forEach((characteristic: string) => {
          const modifiers = this.getMaxHpMiscModifier(characteristic, collection);
          parts = parts.concat(this.creatureService.getModifierTooltips(modifiers, collection));
        });
      }
      if (includeMisc && playerCharacter.creatureHealth.maxHpMod !== 0) {
        parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(playerCharacter.creatureHealth.maxHpMod));
      }
    }

    if (includePenalties) {
      if (playerCharacter.creatureHealth.exhaustionLevel >= 4) {
        parts.push(this.translate.instant('ExhaustionCondition', {
          condition: this.translate.instant('Halved'),
          level: 4
        }));
      }
    }
    return parts.join('\n');
  }

  getSpeedType(playerCharacter: PlayerCharacter): SpeedType {
    return playerCharacter.characterSettings.speed.speedToDisplay;
  }

  getSpeedTypeSID(speedType: SpeedType): number {
    switch (speedType) {
      case SpeedType.WALK:
        return SID.MISC_ATTRIBUTES.WALKING;
      case SpeedType.CRAWL:
        return SID.MISC_ATTRIBUTES.CRAWLING;
      case SpeedType.CLIMB:
        return SID.MISC_ATTRIBUTES.CLIMBING;
      case SpeedType.SWIM:
        return SID.MISC_ATTRIBUTES.SWIMMING;
      case SpeedType.FLY:
        return SID.MISC_ATTRIBUTES.FLYING;
      case SpeedType.BURROW:
        return SID.MISC_ATTRIBUTES.BURROW;
    }
    return -1;
  }

  private getRaceSpeed(race: Race, speedType: SpeedType): number {
    if (race == null) {
      return 0;
    }

    let speed = 0;
    if (race.parent != null) {
      speed = this.getRaceSpeed(race.parent as Race, speedType);
    }

    for (let i = 0; i < race.speeds.length; i++) {
      const raceSpeed = race.speeds[i];
      if (raceSpeed.speedType === speedType) {
        speed += raceSpeed.value;
      }
    }

    return speed;
  }

  getSpeedConfiguration(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, speedType: SpeedType, settings: CharacterSpeedSettings): CreatureSpeedModifierCollectionItem {
    const speed = new CreatureSpeedModifierCollectionItem();
    speed.speedType = speedType;

    const sid = this.getSpeedTypeSID(speedType);
    const miscModifier = this.creatureService.getMiscModifier(sid, collection);
    if (miscModifier != null) {
      speed.creatureListProficiency = miscModifier;
      speed.modifiers = this.creatureService.getModifiers(miscModifier.modifiers, collection, 0, false);
      speed.modifiersDisplay = this.creatureService.getModifierLabels(miscModifier.modifiers, collection, false);
      speed.misc = this.creatureService.getMiscModifierValue(miscModifier);
      speed.miscDisplays = this.creatureService.getMiscModifierTooltip(miscModifier);
    }

    const setModification = this.modifierService.getSetModification(miscModifier.modifiers);
    const hasSet = setModification != null;
    speed.useHalfApplicable = !hasSet && (speedType === SpeedType.CLIMB || speedType === SpeedType.CRAWL || speedType === SpeedType.SWIM);
    const raceSpeed = this.getRaceSpeed(playerCharacter.characterRace.race, speedType);
    speed.applyGeneric = hasSet || raceSpeed > 0;
    if (hasSet) {
      speed.base = setModification.modifierConfiguration.value;
      speed.baseTooltip = setModification.powerName + ': ' + setModification.modifierConfiguration.value;
      speed.useHalfApplicable = false;
    } else if (raceSpeed > 0 || !speed.useHalfApplicable) {
      speed.base = raceSpeed;
      speed.baseTooltip = playerCharacter.characterRace.race.name + ': ' + raceSpeed;
      speed.useHalfApplicable = false;
    } else if (speed.useHalfApplicable) {
      const walkingConfig = this.getSpeedConfiguration(playerCharacter, collection, SpeedType.WALK, settings);
      const walkingSpeed = this.getSpeed(walkingConfig);

      speed.useHalf = this.getSpeedUseHalf(speedType, settings);
      speed.roundUp = this.getSpeedRoundUp(speedType, settings);

      speed.base = walkingSpeed;
      speed.baseTooltip = this.getBaseSpeedTooltip(speed, playerCharacter, collection, settings);
    }

    if (speed.applyGeneric) {
      const genericSpeedModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.SPEED, collection);
      if (genericSpeedModifier != null) {
        speed.modifiers += this.creatureService.getModifiers(genericSpeedModifier.modifiers, collection, 0, false);
        speed.modifiersDisplay = speed.modifiersDisplay.concat(this.creatureService.getModifierLabels(genericSpeedModifier.modifiers, collection, false));
      }

      if (this.isHeavilyEncumbered(playerCharacter, collection)) {
        speed.penalties += 20;
        speed.penaltyDisplays.push(this.translate.instant('Labels.HeavilyEncumbered') + ' -20');
      } else if (this.isEncumbered(playerCharacter, collection)) {
        speed.penalties += 10;
        speed.penaltyDisplays.push(this.translate.instant('Labels.Encumbered') + ' -10');
      }

      if (!this.creatureService.meetsEquippedArmorStrRequirements(playerCharacter, collection)) {
        speed.penalties += 10;
        speed.penaltyDisplays.push(this.translate.instant('Labels.Armor') + ' -10');
      }
    }

    const immobilizingConditions = this.creatureService.getActiveImmobilizingConditions(playerCharacter);
    if (immobilizingConditions.length > 0) {
      speed.immobilized = true;
      immobilizingConditions.forEach((activeCondition: ActiveCondition) => {
        speed.penaltyDisplays.push(this.translate.instant('Immobilized') + ' (' + activeCondition.condition.name + ')');
      });
    }
    if (playerCharacter.creatureHealth.exhaustionLevel >= 5) {
      speed.immobilized = true;
      speed.penaltyDisplays.push(this.translate.instant('ExhaustionCondition', {
        condition: this.translate.instant('Immobilized'),
        level: 5
      }));
    } else if (playerCharacter.creatureHealth.exhaustionLevel >= 2) {
      speed.halved = true;
      speed.penaltyDisplays.push(this.translate.instant('ExhaustionCondition', {
        condition: this.translate.instant('Halved'),
        level: 2
      }));
    }

    return speed;
  }

  private getSpeedUseHalf(speedType: SpeedType, settings: CharacterSpeedSettings): boolean {
    switch (speedType) {
      case SpeedType.CRAWL:
        return settings.crawling.useHalf;
      case SpeedType.CLIMB:
        return settings.climbing.useHalf;
      case SpeedType.SWIM:
        return settings.swimming.useHalf;
    }
    return false;
  }

  private getSpeedRoundUp(speedType: SpeedType, settings: CharacterSpeedSettings): boolean {
    switch (speedType) {
      case SpeedType.CRAWL:
        return settings.crawling.useHalf && settings.crawling.roundUp;
      case SpeedType.CLIMB:
        return settings.climbing.useHalf && settings.climbing.roundUp;
      case SpeedType.SWIM:
        return settings.swimming.useHalf && settings.swimming.roundUp;
    }
    return false;
  }

  getSpeed(speedConfiguration: CreatureSpeedModifierCollectionItem, includeMisc = true, includeModifiers = true, includePenalties = true): number {
    let speed = this.getBaseSpeed(speedConfiguration);

    if (includeModifiers) {
      speed += speedConfiguration.modifiers;
    }
    if (includeMisc) {
      speed += speedConfiguration.misc;
    }
    if (includePenalties) {
      speed -= speedConfiguration.penalties;
      if (speedConfiguration.immobilized) {
        speed = 0;
      }

      if (speedConfiguration.halved) {
        speed = Math.floor(speed / 2);
      }
    }

    if (speed < 0) {
      speed = 0;
    }
    return speed;
  }

  getBaseSpeed(speedConfiguration: CreatureSpeedModifierCollectionItem): number {
    let speed = speedConfiguration.base;
    if (speedConfiguration.useHalfApplicable && speedConfiguration.useHalf) {
      speed = speedConfiguration.roundUp ? Math.ceil(speed / 2) : Math.floor(speed / 2);
    }
    return speed;
  }

  getBaseSpeedTooltip(speedConfiguration: CreatureSpeedModifierCollectionItem, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, settings: CharacterSpeedSettings): string {
    let tooltip = '';
    if (speedConfiguration.useHalfApplicable && speedConfiguration.useHalf) {
      const walkingConfig = this.getSpeedConfiguration(playerCharacter, collection, SpeedType.WALK, settings);
      const walkingSpeed = this.getSpeed(walkingConfig);

      tooltip = this.translate.instant('Tooltips.HalfWalkingValue', {walkingSpeed: walkingSpeed});

      if (speedConfiguration.roundUp) {
        tooltip += ', ' + this.translate.instant('RoundUp');
      }
    } else {
      tooltip = speedConfiguration.baseTooltip;
    }
    return tooltip;
  }

  getSpeedTooltip(speedConfiguration: CreatureSpeedModifierCollectionItem, includeMisc = true, includeModifiers = true, includePenalties = true): string {
    let parts = [];
    parts.push(speedConfiguration.baseTooltip);

    if (includeModifiers) {
      speedConfiguration.modifiersDisplay.forEach((modifier: LabelValue) => {
        parts.push(modifier.label + ': ' + modifier.value);
      });
    }
    if (includeMisc) {
      parts = parts.concat(speedConfiguration.miscDisplays);
    }
    if (includePenalties) {
      parts = parts.concat(speedConfiguration.penaltyDisplays);
    }
    return parts.join('\n');
  }

  updateSpeeds(playerCharacter: PlayerCharacter, speedConfigurations: CreatureSpeedModifierCollectionItem[]): Promise<any> {
    return this.creatureService.updateSpeeds(playerCharacter, speedConfigurations);
  }

  getCarrying(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): number {
    let weight = this.getEquipmentWeight(playerCharacter, collection) + this.getCoinWeight(playerCharacter);
    weight = Math.round(weight * 1000) / 1000.0;
    if (includeMisc || includeModifiers) {
      const equipment = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.EQUIPMENT, collection);
      if (includeMisc) {
        const misc = this.creatureService.getMiscModifierValue(equipment);
        weight += misc;
      }
      if (includeModifiers) {
        const modifiers = this.creatureService.getModifiers(equipment.modifiers, collection);
        weight += modifiers;
      }
    }
    return weight;
  }

  getCarryingCapacity(collection: CreatureConfigurationCollection): number {
    const creatureListProficiency = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.CARRYING_CAPACITY, collection);
    const modifiers = this.creatureService.getModifiers(creatureListProficiency.modifiers, collection);
    const misc = this.creatureService.getMiscModifierValue(creatureListProficiency);
    const str = this.creatureService.getAbilityBySid(SID.ABILITIES.STRENGTH, collection);
    const strScore = this.creatureService.getAbilityScore(str, collection);
    return (strScore * STRENGTH_MULTIPLIERS.CARRYING)
      + misc
      + modifiers;
  }

  private getEquipmentWeight(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    let weight = 0;
    playerCharacter.items.forEach((item: CreatureItem) => {
      if (item.creatureItemState !== CreatureItemState.DROPPED
        && item.creatureItemState !== CreatureItemState.EXPENDED
        && item.itemType !== ItemType.MOUNT
        && item.itemType !== ItemType.VEHICLE) {
        weight += this.creatureService.getItemWeight(item, true);
      }
    });
    return Math.round(weight * 1000) / 1000.0;
  }

  private getCoinWeight(playerCharacter: PlayerCharacter): number {
    if (!playerCharacter.characterSettings.equipment.calculateCurrencyWeight) {
      return 0;
    }
    let weight = 0.0;
    playerCharacter.creatureWealth.amounts.forEach((creatureWealthAmount: CreatureWealthAmount) => {
      if (creatureWealthAmount.amount > 0) {
        weight += (creatureWealthAmount.amount * creatureWealthAmount.costUnit.weight);
      }
    });
    return Math.round(weight * 1000) / 1000.0;
  }

  private getNumCoins(playerCharacter: PlayerCharacter): number {
    let count = 0;
    playerCharacter.creatureWealth.amounts.forEach((creatureWealthAmount: CreatureWealthAmount) => {
      count += creatureWealthAmount.amount;
    });
    return count;
  }

  getCarryingTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): string {
    let parts = [];
    const equipmentWeight = this.getEquipmentWeight(playerCharacter, collection);
    const coinWeight = this.getCoinWeight(playerCharacter);

    parts.push(this.translate.instant('Labels.Equipment') + ' ' + equipmentWeight);
    if (coinWeight !== 0) {
      parts.push(this.translate.instant('Labels.Currency') + ' ' + coinWeight);
    }

    if (includeMisc || includeModifiers) {
      const equipment = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.EQUIPMENT, collection);
      if (includeModifiers) {
        const modifiersDisplay = this.creatureService.getModifierTooltips(equipment.modifiers, collection);
        parts = parts.concat(modifiersDisplay);
      }
      if (includeMisc) {
        const misc = this.creatureService.getMiscModifierValue(equipment);
        if (misc !== 0) {
          parts.push(this.translate.instant('Labels.Misc') + ' ' + misc);
        }
      }
    }
    return parts.join('\n');
  }

  getEncumberedLimit(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    const str = this.creatureService.getAbilityBySid(SID.ABILITIES.STRENGTH, collection);
    const strScore = this.creatureService.getAbilityScore(str, collection);
    const creatureListProficiency = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.ENCUMBERED, collection);
    const modifiers = this.creatureService.getModifiers(creatureListProficiency.modifiers, collection);
    const misc = this.creatureService.getMiscModifierValue(creatureListProficiency);
    return (strScore * STRENGTH_MULTIPLIERS.ENCUMBERED) + misc + modifiers;
  }

  isEncumbered(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): boolean {
    if (!playerCharacter.characterSettings.equipment.useEncumbrance) {
      return false;
    }

    const equipment = this.getCarrying(playerCharacter, collection);
    const encumberedLimit = this.getEncumberedLimit(playerCharacter, collection);

    return equipment >= encumberedLimit;
  }

  getHeavilyEncumberedLimit(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): number {
    const str = this.creatureService.getAbilityBySid(SID.ABILITIES.STRENGTH, collection);
    const strScore = this.creatureService.getAbilityScore(str, collection);
    const creatureListProficiency = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.HEAVILY_ENCUMBERED, collection);
    const modifiers = this.creatureService.getModifiers(creatureListProficiency.modifiers, collection);
    const misc = this.creatureService.getMiscModifierValue(creatureListProficiency);
    return (strScore * STRENGTH_MULTIPLIERS.HEAVILY_ENCUMBERED) + misc + modifiers;
  }

  isHeavilyEncumbered(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): boolean {
    if (!playerCharacter.characterSettings.equipment.useEncumbrance) {
      return false;
    }

    const equipment = this.getCarrying(playerCharacter, collection);
    const encumberedLimit = this.getHeavilyEncumberedLimit(playerCharacter, collection);

    return equipment >= encumberedLimit;
  }

  hasModifiedAttackRollDisadvantage(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, abilitySID: number): boolean {
    if (this.isHeavilyEncumbered(playerCharacter, collection) && this.abilityAppliesToHeavilyEncumbered(abilitySID)) {
      return true;
    }
    return this.creatureService.hasModifiedAttackRollDisadvantage(playerCharacter, abilitySID, collection);
  }

  getModifiedAttackRollDisadvantageTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, abilitySID: number): string {
    let parts = [];
    if (this.isHeavilyEncumbered(playerCharacter, collection) && this.abilityAppliesToHeavilyEncumbered(abilitySID)) {
      parts.push(this.translate.instant('Headers.HeavilyEncumbered'));
    }
    parts = parts.concat(this.creatureService.getModifiedAttackRollDisadvantageTooltip(playerCharacter, abilitySID, collection));
    return parts.join('\n');
  }

  hasModifiedAttackRollAdvantage(playerCharacter: PlayerCharacter): boolean {
    return this.creatureService.hasModifiedAttackRollAdvantage(playerCharacter);
  }

  getModifiedAttackRollAdvantageTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, abilitySID: number): string {
    return this.creatureService.getModifiedAttackRollAdvantageTooltip(playerCharacter);
  }

  hasModifiedAbilityCheckDisadvantage(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, abilitySID: number, skillSID: number = null): boolean {
    if (this.isHeavilyEncumbered(playerCharacter, collection) && this.abilityAppliesToHeavilyEncumbered(abilitySID)) {
      return true;
    }
    return this.creatureService.hasModifiedAbilityCheckDisadvantage(playerCharacter, abilitySID, skillSID, collection);
  }

  getModifiedAbilityCheckDisadvantageTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, abilitySID: number, skillSID: number = null): string {
    let parts = [];
    if (this.isHeavilyEncumbered(playerCharacter, collection) && this.abilityAppliesToHeavilyEncumbered(abilitySID)) {
      parts.push(this.translate.instant('Headers.HeavilyEncumbered'));
    }
    parts = parts.concat(this.creatureService.getModifiedAbilityCheckDisadvantageTooltip(playerCharacter, abilitySID, skillSID, collection));
    return parts.join('\n');
  }

  hasModifiedSaveDisadvantage(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, abilitySID: number): boolean {
    if (this.isHeavilyEncumbered(playerCharacter, collection) && this.abilityAppliesToHeavilyEncumbered(abilitySID)) {
      return true;
    }
    return this.creatureService.hasModifiedSaveDisadvantage(playerCharacter, abilitySID, collection);
  }

  getModifiedSaveDisadvantageTooltip(playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection, abilitySID: number): string {
    let parts = [];
    if (this.isHeavilyEncumbered(playerCharacter, collection) && this.abilityAppliesToHeavilyEncumbered(abilitySID)) {
      parts.push(this.translate.instant('Headers.HeavilyEncumbered'));
    }
    parts = parts.concat(this.creatureService.getModifiedSaveDisadvantageTooltip(playerCharacter, abilitySID, collection));
    return parts.join('\n');
  }

  private abilityAppliesToHeavilyEncumbered(abilitySID: number): boolean {
    return abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY || abilitySID === SID.ABILITIES.CONSTITUTION;
  }

  hasModifiedSaveAutoFail(playerCharacter: PlayerCharacter, abilitySID: number): boolean {
    return this.creatureService.hasModifiedSaveAutoFail(playerCharacter, abilitySID);
  }

  getModifiedSaveAutoFailTooltip(playerCharacter: PlayerCharacter, abilitySID: number): string {
    return this.creatureService.getModifiedSaveAutoFailTooltip(playerCharacter, abilitySID);
  }

  canAttune(playerCharacter: PlayerCharacter, creatureItem: CreatureItem): boolean {
    if (creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = creatureItem.item as MagicalItem;
      if (magicalItem.attunementType === MagicalItemAttunementType.ALIGNMENT) {
        return this.getMagicalItemAttuneableAlignments(magicalItem, playerCharacter) != null;
      } else if (magicalItem.attunementType === MagicalItemAttunementType.RACE) {
        return this.getMagicalItemAttuneableRaces(magicalItem, playerCharacter) != null;
      } else {
        return this.getMagicalItemAttuneableClasses(magicalItem, playerCharacter).length > 0;
      }
    }

    return false;
  }

  getMagicalItemMaxSpellcastingAbility(magicalItem: MagicalItem, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    const classes = this.getMagicalItemApplicableClasses(magicalItem, playerCharacter);
    return this.getMaxAbilityModifier(classes, playerCharacter, collection);
  }

  getMagicalItemMaxPowerModifier(magicalItem: MagicalItem, playerCharacter: PlayerCharacter, attackType: AttackType, collection: CreatureConfigurationCollection): PowerModifier {
    const classes = this.getMagicalItemApplicableClasses(magicalItem, playerCharacter);
    let modifier = this.getMaxPowerModifier(classes, attackType, playerCharacter, collection);
    if (modifier == null) {
      modifier = new PowerModifier();
      modifier.proficiency = new Proficiency();
      modifier.proficiency.proficient = true;
      modifier.profModifier = this.creatureService.getProfModifier(collection);
    }
    return modifier;
  }

  getMagicalItemApplicableClasses(magicalItem: MagicalItem, playerCharacter: PlayerCharacter): ChosenClass[] {
    if (magicalItem.requiresAttunement) {
      return this.getMagicalItemAttuneableClasses(magicalItem, playerCharacter);
    } else {
      return playerCharacter.classes;
    }
  }

  getMagicalItemSpellMaxSpellcastingAbility(magicalItem: MagicalItem, spell: ListObject, playerCharacter: PlayerCharacter, collection: CreatureConfigurationCollection): Promise<CreatureAbilityProficiency> {
    return this.getMagicalItemSpellApplicableClasses(magicalItem, spell, playerCharacter).then((classes: ChosenClass[]) => {
      return this.getMaxAbilityModifier(classes, playerCharacter, collection);
    });
  }

  getMagicalItemSpellApplicableClasses(magicalItem: MagicalItem, spell: ListObject, playerCharacter: PlayerCharacter): Promise<ChosenClass[]> {
    if (magicalItem.requiresAttunement) {
      return Promise.resolve(this.getMagicalItemAttuneableClasses(magicalItem, playerCharacter));
    } else if (magicalItem.magicalItemType === MagicalItemType.SCROLL) {
      return this.getClassesForSpell(spell, playerCharacter);
    } else {
      return Promise.resolve(playerCharacter.classes);
    }
  }

  getMagicalItemAttuneableAlignments(magicalItem: MagicalItem, playerCharacter: PlayerCharacter): ListObject {
    if (magicalItem.requiresAttunement && magicalItem.attunementType === MagicalItemAttunementType.ALIGNMENT) {
      if (playerCharacter.alignment == null) {
        return null;
      }
      return _.find(magicalItem.attunementAlignments, (_alignment: ListObject) => {
        return _alignment.id === playerCharacter.alignment.id;
      });
    } else {
      return null;
    }
  }

  getMagicalItemAttuneableRaces(magicalItem: MagicalItem, playerCharacter: PlayerCharacter): ListObject {
    if (magicalItem.requiresAttunement && magicalItem.attunementType === MagicalItemAttunementType.RACE) {
      return _.find(magicalItem.attunementRaces, (_race: ListObject) => {
        return this.matchesRace(_race.id, playerCharacter.characterRace.race);
      });
    } else {
      return null;
    }
  }

  private matchesRace(raceId: string, race: Race): boolean {
    if (race == null) {
      return false;
    }
    if (race.id === raceId) {
      return true;
    }
    if (race.parent != null) {
      return this.matchesRace(raceId, race.parent as Race);
    }
    return false;
  }

  getMagicalItemAttuneableClasses(magicalItem: MagicalItem, playerCharacter: PlayerCharacter): ChosenClass[] {
    if (magicalItem.requiresAttunement) {
      switch (magicalItem.attunementType) {
        case MagicalItemAttunementType.ANY:
          return playerCharacter.classes;
        case MagicalItemAttunementType.CASTER:
          return this.getCasterClasses(playerCharacter);
        case MagicalItemAttunementType.CLASS:
          return this.getClasses(magicalItem.attunementClasses, playerCharacter);
      }
    } else {
      return [];
    }
  }

  getCasterClasses(playerCharacter: PlayerCharacter): ChosenClass[] {
    const classes: ChosenClass[] = [];
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      if (chosenClass.characterClass.casterType != null) {
        classes.push(chosenClass);
      } else if (chosenClass.subclass != null && chosenClass.subclass.casterType != null) {
        classes.push(chosenClass);
      }
    });
    return classes;
  }

  getClassesForSpell(spell: ListObject, playerCharacter: PlayerCharacter): Promise<ChosenClass[]> {
    const classes: ChosenClass[] = [];
    const promises: Promise<any>[] = [];
    playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      promises.push(this.characteristicService.getSpellConfigurations(chosenClass.characterClass.id).then((spellConfigurations: SpellConfiguration[]) => {
        const index = _.findIndex(spellConfigurations, (_spell: SpellConfiguration) => {
          return _spell.spell.id === spell.id;
        });
        if (index > -1) {
          classes.push(chosenClass);
        }
      }));

      if (chosenClass.subclass != null) {
        promises.push(this.characteristicService.getSpellConfigurations(chosenClass.subclass.id).then((spellConfigurations: SpellConfiguration[]) => {
          const index = _.findIndex(spellConfigurations, (_spell: SpellConfiguration) => {
            return _spell.spell.id === spell.id;
          });
          if (index > -1) {
            classes.push(chosenClass);
          }
        }));
      }
    });

    return Promise.all(promises).then(() => {
      return classes;
    });
  }

  isSpellInClassList(spell: ListObject, playerCharacter: PlayerCharacter): Promise<boolean> {
    if (playerCharacter == null) {
      return Promise.resolve(false);
    }

    return this.getClassesForSpell(spell, playerCharacter).then((classes: ChosenClass[]) => {
      return classes.length > 0;
    });

    // const characteristics: string[] = [];
    // playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
    //   characteristics.push(chosenClass.characterClass.id);
    //   if (chosenClass.subclass != null) {
    //     characteristics.push(chosenClass.subclass.id);
    //   }
    // });
    //
    // // characteristics.set(playerCharacter.characterRace.race.id, playerCharacter.characterRace.race);
    //
    // // if (playerCharacter.characterBackground.background != null) {
    // //   characteristics.set(playerCharacter.characterBackground.background.id, playerCharacter.characterBackground.background);
    // // }
    //
    // let spells: SpellConfiguration[] = [];
    // const promises: Promise<any>[] = [];
    // characteristics.forEach((characteristic: string) => {
    //   promises.push(this.characteristicService.getSpellConfigurations(characteristic).then((spellConfigurations: SpellConfiguration[]) => {
    //     spells = spells.concat(spellConfigurations);
    //   }));
    // });
    //
    // return Promise.all(promises).then(() => {
    //   const index = _.findIndex(spells, (_spell: SpellConfiguration) => {
    //     return _spell.spell.id === spell.id;
    //   });
    //   return index > -1;
    // });
  }

  uploadImage(playerCharacter: PlayerCharacter, file: File): Promise<SquireImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<SquireImage>(`${environment.backendUrl}/creatures/${playerCharacter.id}/image`, formData).toPromise();
  }

  deleteImage(playerCharacter: PlayerCharacter): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/creatures/${playerCharacter.id}/image`).toPromise();
  }
}
