import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import jsPDF from 'jspdf';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {SkillService} from '../../../../core/services/attributes/skill.service';
import {Skill} from '../../../../shared/models/attributes/skill';
import {SID} from '../../../../constants';
import {CreatureSkillListProficiency} from '../../../../shared/models/creatures/creature-skill-list-proficiency';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {TranslateService} from '@ngx-translate/core';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {CreatureHitDice} from '../../../../shared/models/creatures/creature-hit-dice';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {Spell} from '../../../../shared/models/powers/spell';
import {Feature} from '../../../../shared/models/powers/feature';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {UserSubscriptionType} from '../../../../shared/models/user-subscription-type.enum';
import {UserService} from '../../../../core/services/user.service';
import {Subscription} from 'rxjs';
import {SafeUrl} from '@angular/platform-browser';
import {ImageService} from '../../../../core/services/image.service';

export class CharacterAbilityColumn {
  name: string;
  value: string;
  savingThrow: CharacterProfDisplay;
  skills: CharacterProfDisplay[] = [];

  constructor(name: string, value: string, savingThrow: string, proficient: boolean) {
    this.name = name;
    this.value = value;
    this.savingThrow = new CharacterProfDisplay('', savingThrow, proficient);
    this.skills = [];
  }
}

export class CharacterProfDisplay {
  label: string;
  value: string;
  proficient: boolean;

  constructor(label: string, value: string, proficient: boolean) {
    this.label = label;
    this.value = value;
    this.proficient = proficient;
  }
}

export const MAX_PRINT_EQUIPMENT_ITEMS = 23;
export const MAX_PRINT_FEATURE_ITEMS = 23;

@Component({
  selector: 'app-print-character',
  templateUrl: './print-character.component.html',
  styleUrls: ['./print-character.component.scss']
})
export class PrintCharacterComponent implements OnInit, OnDestroy {
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() cancel = new EventEmitter();

  userSub: Subscription;
  isPro = false;
  includeSpells = true;
  includeSpellDetails = false;
  includeFeatureDetails = false;
  centerImage = true;

  loading = false;
  abilities: CharacterAbilityColumn[] = [];
  str: CharacterAbilityColumn;
  dex: CharacterAbilityColumn;
  con: CharacterAbilityColumn;
  int: CharacterAbilityColumn;
  wis: CharacterAbilityColumn;
  cha: CharacterAbilityColumn;

  ac = '0';
  hp = '';
  initiative = '';
  proficiencyBonus = '';
  speed = '';
  hitDice = '';

  pp = 0;
  gp = 0;
  ep = 0;
  sp = 0;
  cp = 0;
  carrying;

  equipment: string[] = [];
  features: string[] = [];

  spellcastingAbility = '';
  spellAttack = '';
  spellSaveDc = '';

  spellDetails: Spell[] = [];
  featureDetails: Feature[] = [];
  sanitizedImage: SafeUrl = null;

  constructor(
    private userService: UserService,
    private skillsService: SkillService,
    private creatureService: CreatureService,
    private creatureItemService: CreatureItemService,
    private abilityService: AbilityService,
    private characterService: CharacterService,
    private translate: TranslateService,
    private spellService: SpellService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.userSub = this.userService.userSubject.subscribe(async user => {
      this.isPro = user != null && user.userSubscription.type !== UserSubscriptionType.FREE;
    });

    this.initializeAbilities();
    this.initializeSkills();
    this.ac = this.characterService.getAC(this.playerCharacter, this.collection).toString(10);
    const currentHP = this.creatureService.getCurrentHP(this.playerCharacter, this.collection);
    const maxHP = this.characterService.getMaxHP(this.playerCharacter, this.collection);
    this.hp = currentHP + ' / ' + maxHP;

    const profModifier = this.creatureService.getProfModifier(this.collection);
    this.proficiencyBonus = this.abilityService.convertScoreToString(profModifier);

    const initiativeModifier = this.creatureService.getInitiativeModifier(this.collection);
    this.initiative = this.abilityService.convertScoreToString(initiativeModifier);

    const speedType = this.characterService.getSpeedType(this.playerCharacter);
    const speedConfig = this.characterService.getSpeedConfiguration(this.playerCharacter, this.collection, speedType, this.playerCharacter.characterSettings.speed);
    const speed = this.characterService.getSpeed(speedConfig);
    this.speed = this.translate.instant('Headers.FeetValue', {'feet': speed});

    const classHitDice = this.playerCharacter.classes[0].characterClass.hitDice.diceSize;
    const remaining = this.getHitDiceRemaining(classHitDice);
    this.hitDice = `${remaining}d${this.translate.instant('DiceSize.' + classHitDice)}`;

    this.pp = this.getWealth('PP');
    this.gp = this.getWealth('GP');
    this.ep = this.getWealth('EP');
    this.sp = this.getWealth('SP');
    this.cp = this.getWealth('CP');
    const weight = this.characterService.getCarrying(this.playerCharacter, this.collection);
    this.carrying = this.translate.instant('WeightValue', { 'value': weight });

    this.initializeEquipment();
    this.initializeFeatures();
    this.initializeSpellcasting();
    this.sanitizedImage = this.imageService.sanitizeImage(this.playerCharacter.image);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  private getHitDiceRemaining(classHitDice: DiceSize): number {
    let remaining = 0;
    this.playerCharacter.creatureHealth.creatureHitDice.forEach((creatureHitDice: CreatureHitDice) => {
      if (creatureHitDice.diceSize === classHitDice) {
        remaining += creatureHitDice.remaining;
      }
    });
    return remaining;
  }

  private initializeAbilities(): void {
    this.str = this.initializeAbility(SID.ABILITIES.STRENGTH);
    this.dex = this.initializeAbility(SID.ABILITIES.DEXTERITY);
    this.con = this.initializeAbility(SID.ABILITIES.CONSTITUTION);
    this.int = this.initializeAbility(SID.ABILITIES.INTELLIGENCE);
    this.wis = this.initializeAbility(SID.ABILITIES.WISDOM);
    this.cha = this.initializeAbility(SID.ABILITIES.CHARISMA);
  }

  private initializeAbility(abilityId: number): CharacterAbilityColumn {
    const ability = this.creatureService.getAbilityBySid(abilityId, this.collection);
    const score = this.creatureService.getAbilityScore(ability, this.collection);
    const value = this.abilityService.getScoreAndModifier(score);
    const save = this.creatureService.getAbilitySaveModifier(ability, this.playerCharacter, this.collection);
    const savingThrowValue = this.abilityService.convertScoreToString(save);
    const savingThrowProficient = ability.saveProficiency != null &&
      (ability.saveProficiency.proficient || ability.saveProficiency.inheritedFrom.length > 0);

    const abilityColumn = new CharacterAbilityColumn(ability.ability.abbr, value, savingThrowValue, savingThrowProficient);
    this.abilities.push(abilityColumn);
    return abilityColumn;
  }

  private initializeSkills(): void {
    this.skillsService.getSkillsDetailed().then((skills: Skill[]) => {
      skills.forEach((skill: Skill) => {
        if (skill.sid !== 0) {
          const ability = this.getAbility(skill.ability.sid);
          if (ability != null) {
            const skillProf = this.getSkill(skill.id);
            const skillModifier = this.creatureService.getSkillAbilityModifier(skillProf, this.playerCharacter, this.collection);
            const totalModifier = this.abilityService.convertScoreToString(skillModifier);
            const proficient = skillProf.proficient || skillProf.inheritedFrom.length > 0;
            const skillDisplay = new CharacterProfDisplay(skill.name, totalModifier, proficient);
            ability.skills.push(skillDisplay);
          }
        }
      });
    });
  }

  private getSkill(id: string): CreatureSkillListProficiency {
    for (let i = 0; i < this.collection.proficiencyCollection.skillProficiencies.length; i++) {
      const skill = this.collection.proficiencyCollection.skillProficiencies[i];
      if (skill.skill.id === id) {
        return skill;
      }
    }
    return null;
  }

  private getAbility(abilityId: number): CharacterAbilityColumn {
    switch (abilityId) {
      case SID.ABILITIES.STRENGTH:
        return this.str;
      case SID.ABILITIES.DEXTERITY:
        return this.dex;
      case SID.ABILITIES.CONSTITUTION:
        return this.con;
      case SID.ABILITIES.INTELLIGENCE:
        return this.int;
      case SID.ABILITIES.WISDOM:
        return this.wis;
      case SID.ABILITIES.CHARISMA:
        return this.cha;
    }
    return null;
  }

  private getWealth(costUnit: string): number {
    for (let i = 0; i < this.playerCharacter.creatureWealth.amounts.length; i++) {
      const amount = this.playerCharacter.creatureWealth.amounts[i];
      if (amount.costUnit.abbreviation === costUnit) {
        return amount.amount;
      }
    }
    return 0;
  }

  private initializeEquipment(): void {
    const items = this.creatureItemService.getFlatItemList(this.playerCharacter.items);
    const mergedItems = this.creatureItemService.mergeItems(items);
    mergedItems.sort((left: CreatureItem, right: CreatureItem) => {
      return left.name.localeCompare(right.name);
    });

    this.equipment = [];
    mergedItems.forEach((item: CreatureItem) => {
      let name = item.item.name;
      if (item.magicalItem != null) {
        name += ' (' + item.magicalItem.name + ')';
      }
      if (item.quantity > 1) {
        name += ' x ' + item.quantity;
      }
      this.equipment.push(name);
    });

    this.cleanUpList(this.equipment, MAX_PRINT_EQUIPMENT_ITEMS);
  }

  private initializeFeatures(): void {
    this.features = [];
    this.playerCharacter.creatureFeatures.features.forEach((creatureFeature: CreatureFeature) => {
      let name = creatureFeature.feature.name;
      if (creatureFeature.feature.characteristic != null) {
        name += ' (' + creatureFeature.feature.characteristic.name + ')';
      }
      this.features.push(name);
    });
    this.cleanUpList(this.features, MAX_PRINT_FEATURE_ITEMS);
  }

  private cleanUpList(list: string[], requiredLength: number): void {
    if (list.length > requiredLength) {
      const extraItems = list.length - requiredLength;
      list.splice(requiredLength, extraItems);
    } else if (list.length < requiredLength) {
      const current = list.length;
      for (let i = current; i < requiredLength; i++) {
        list.push('');
      }
    }
  }

  private initializeSpellcasting(): void {
    const primaryClass = this.playerCharacter.classes[0];
    const characteristicId = primaryClass.characterClass.id;
    const ability: CreatureAbilityProficiency = this.characterService.getChosenClassSpellCastingAbility(primaryClass, this.collection);
    const attackModifier = this.creatureService.getSpellModifier(ability, this.collection, primaryClass.spellcastingAttack, AttackType.ATTACK, characteristicId);
    const saveModifier = this.creatureService.getSpellModifier(ability, this.collection, primaryClass.spellcastingSave, AttackType.SAVE, characteristicId);

    if (ability == null) {
      this.spellcastingAbility = this.translate.instant('None');
    } else {
      this.spellcastingAbility = ability.ability.abbr;
    }

    const savePowerModifier = this.creatureService.getModifiers(saveModifier.modifiers, this.collection);
    const saveModifierValue = this.spellService.getSpellSaveDC(saveModifier, savePowerModifier);
    this.spellSaveDc = saveModifierValue.toString(10);

    const attackPowerModifier = this.creatureService.getModifiers(attackModifier.modifiers, this.collection);
    const attackModifierValue = this.spellService.getSpellAttackModifier(attackModifier, attackPowerModifier, this.playerCharacter);
    this.spellAttack = this.abilityService.convertScoreToString(attackModifierValue);
  }

  private initializeSpellDetails(): void {
    if (this.spellDetails.length > 0) {
      return;
    }
    this.loading = true;
    this.creatureService.getSpellsDetailed(this.playerCharacter).then((spells: Spell[]) => {
      this.spellDetails = spells;
      this.loading = false;
    });
  }

  private initializeFeatureDetails(): void {
    if (this.featureDetails.length > 0) {
      return;
    }
    this.loading = true;
    this.creatureService.getFeaturesDetailed(this.playerCharacter).then((features: Feature[]) => {
      this.featureDetails = features;
      this.loading = false;
    });
  }

  downloadAsPDF(): void {
    this.loading = true;
    const self = this;
    setTimeout(() => {
      const pdfTable = this.pdfTable.nativeElement;
      const doc = new jsPDF('portrait', 'pt', 'letter');
      const docWidth = doc.internal.pageSize.getWidth();
      doc.setProperties({
        title: this.playerCharacter.name
      });
      doc.setFont('BerryRotunda');
      doc.html(pdfTable, {
        autoPaging: 'text',
        margin: [30, 25, 30, 25], //top, right, bottom, left
        width: docWidth - 50,
        windowWidth: 900,
        fontFaces: [{
          family: 'berry',
          style: 'normal' as any,
          weight: 'normal' as any,
          src: [{url: '/assets/fonts/BerryRotunda.ttf', format: 'truetype'}]
        }],
        callback: function(docOut) {
          docOut.save(`${self.playerCharacter.name}.pdf`);
          // docOut.output('dataurlnewwindow');
          self.loading = false;
        }
      });
    });
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  includeSpellsChange(event: MatCheckboxChange): void {
    this.includeSpells = event.checked;
  }

  includeSpellDetailsChange(event: MatCheckboxChange): void {
    this.includeSpellDetails = event.checked;
    if (this.includeSpellDetails) {
      this.initializeSpellDetails();
    }
  }

  includeFeatureDetailsChange(event: MatCheckboxChange): void {
    this.includeFeatureDetails = event.checked;
    if (this.includeFeatureDetails) {
      this.initializeFeatureDetails();
    }
  }

  centerImageChange(event: MatCheckboxChange): void {
    this.centerImage = event.checked;
  }
}
