import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';
import {ListObject} from '../../../../shared/models/list-object';
import {DamageTypeService} from '../../../../core/services/attributes/damage-type.service';
import {SkillService} from '../../../../core/services/attributes/skill.service';
import {WeaponPropertyService} from '../../../../core/services/attributes/weapon-property.service';
import {ConditionService} from '../../../../core/services/attributes/condition.service';
import {SpellSchoolService} from '../../../../core/services/attributes/spell-school.service';
import {AreaOfEffectService} from '../../../../core/services/attributes/area-of-effect.service';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {MatSelect} from '@angular/material/select';

export class QuickReference {
  id = '';
  title = '';
  description = '';
  parent: QuickReference = null;
  children: QuickReference[] = [];
  tables: QuickReferenceTable[] = [];
  expanded = false;
  initialized = false;
}

export class QuickReferenceTable {
  title = '';
  description = '';
  columns: string[] = [];
  rows: QuickReferenceTableRow[] = [];
}

export class QuickReferenceTableRow {
  values: string[] = [];
}

@Component({
  selector: 'app-quick-references-slide-in',
  templateUrl: './quick-references-slide-in.component.html',
  styleUrls: ['./quick-references-slide-in.component.scss']
})
export class QuickReferencesSlideInComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter();

  loading = false;

  selectedItem: QuickReference;
  public headerFilterFormControl: FormControl = new FormControl();
  headers: QuickReference[] = [];
  filteredHeaders: QuickReference[] = [];
  valueSub: Subscription;
  protected _onDestroy = new Subject<void>();

  quickReferences: QuickReference[] = [];

  constructor(
    private translate: TranslateService,
    private alignmentService: AlignmentService,
    private damageTypeService: DamageTypeService,
    private skillService: SkillService,
    private weaponPropertyService: WeaponPropertyService,
    private conditionService: ConditionService,
    private areaOfEffectService: AreaOfEffectService,
    private spellSchoolService: SpellSchoolService,
    @Inject(DOCUMENT) document
  ) { }

  ngOnInit() {
    this.loading = true;
    // this.selectedItem = new QuickReference();
    // this.selectedItem.title = this.translate.instant('Search');
    this.initializeQuickReferences().then(() => {
      const headers: QuickReference[] = this.getHeaders(this.quickReferences);
      headers.sort((left: QuickReference, right: QuickReference) => {
        return left.title.localeCompare(right.title);
      });

      this.headers = headers;
      this.filteredHeaders = this.headers.slice();

      this.setParents(this.quickReferences, null);

      this.loading = false;
    });

    this.valueSub = this.headerFilterFormControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterHeaders();
      });
  }

  ngOnDestroy() {
    this.valueSub.unsubscribe();
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private getHeaders(quickReferences: QuickReference[]): QuickReference[] {
    let headers: QuickReference[] = [];

    quickReferences.forEach((quickReference: QuickReference) => {
      headers.push(quickReference);
      if (quickReference.children.length > 0) {
        headers = headers.concat(this.getHeaders(quickReference.children));
      }
    });

    return headers;
  }

  private setParents(quickReferences: QuickReference[], parent: QuickReference): void {
    quickReferences.forEach((quickReference: QuickReference) => {
      if (quickReference.children.length > 0) {
        this.setParents(quickReference.children, quickReference);
      }
      quickReference.parent = parent;
    });
  }

  closeClick(): void {
    this.close.emit();
  }

  private initializeQuickReferences(): Promise<any> {
    const promises = [];

    promises.push(this.initializeAilments());
    promises.push(this.initializeAlignments());
    promises.push(this.initializeCombat());
    promises.push(this.initializeConditions());
    promises.push(this.initializeEnvironment());
    promises.push(this.initializeMonsters());
    promises.push(this.initializePoisons());
    promises.push(this.initializeSkills());
    promises.push(this.initializeSpellcasting());
    promises.push(this.initializeTraps());
    promises.push(this.initializeTravel());
    promises.push(this.initializeWeaponProperties());

    return Promise.all(promises).then(() => {
      this.quickReferences.sort((left: QuickReference, right: QuickReference) => {
        return left.title.localeCompare(right.title);
      });
      return Promise.resolve();
    });
  }

  private initializeAilments(): Promise<QuickReference> {
    const ailments = this.getQuickReference('Ailments');
    this.quickReferences.push(ailments);
    ailments.children.push(this.getQuickReference('Ailments.Diseases'));
    const madness = this.getQuickReference('Ailments.Madness');
    ailments.children.push(madness);
    madness.children.push(this.getQuickReference('Ailments.Madness.GoingMad'));
    madness.children.push(this.getQuickReference('Ailments.Madness.ShortTermMadness'));
    madness.children.push(this.getQuickReference('Ailments.Madness.LongTermMadness'));
    madness.children.push(this.getQuickReference('Ailments.Madness.IndefiniteMadness'));
    madness.children.push(this.getQuickReference('Ailments.Madness.CuringMadness'));

    return Promise.resolve(ailments);
  }

  private initializeAlignments(): Promise<QuickReference> {
    const alignmentsReference = this.getQuickReference('Alignments');
    this.quickReferences.push(alignmentsReference);
    return this.alignmentService.getAlignments().then((alignments: ListObject[]) => {
      alignments.forEach((alignment: ListObject) => {
        alignmentsReference.children.push(this.getQuickReferenceFromListObject(alignment));
      });

      return alignmentsReference;
    });
  }

  private initializeCombat(): Promise<QuickReference> {
    const combat = this.getQuickReference('Combat');
    this.quickReferences.push(combat);
    combat.children.push(this.getQuickReference('Combat.SurpriseRound'));
    combat.children.push(this.getQuickReference('Combat.YourTurn'));
    const actionsInCombat = this.getQuickReference('Combat.ActionsInCombat');
    combat.children.push(actionsInCombat);
    const mainAction = this.getQuickReference('Combat.ActionsInCombat.MainAction');
    actionsInCombat.children.push(mainAction);
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Attack'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.CastASpell'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Dash'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Disengage'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Dodge'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Help'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Hide'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Ready'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.Search'));
    mainAction.children.push(this.getQuickReference('Combat.ActionsInCombat.MainAction.UseAnObject'));
    const movementAndPosition = this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition');
    actionsInCombat.children.push(movementAndPosition);
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.BreakingUpYourMove'));
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.MovingBetweenAttacks'));
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.UsingDifferentSpeeds'));
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.DifficultTerrain'));
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.BeingProne'));
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.MovingAroundOtherCreatures'));
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.Space'));
    movementAndPosition.children.push(this.getQuickReference('Combat.ActionsInCombat.MovementAndPosition.SqueezingIntoASmallerSpace'));
    actionsInCombat.children.push(this.getQuickReference('Combat.ActionsInCombat.BonusActions'));
    const reactions = this.getQuickReference('Combat.ActionsInCombat.Reactions');
    actionsInCombat.children.push(reactions);
    reactions.children.push(this.getQuickReference('Combat.ActionsInCombat.Reactions.OpportunityAttack'));
    combat.children.push(this.getQuickReference('Combat.TwoWeaponFighting'));
    const grappling = this.getQuickReference('Combat.Grappling');
    combat.children.push(grappling);
    grappling.children.push(this.getQuickReference('Combat.Grappling.EscapingAGrapple'));
    grappling.children.push(this.getQuickReference('Combat.Grappling.MovingAGrappledCreature'));
    combat.children.push(this.getQuickReference('Combat.ShovingACreature'));
    const cover = this.getQuickReference('Combat.Cover');
    combat.children.push(cover);
    cover.children.push(this.getQuickReference('Combat.Cover.HalfCover'));
    cover.children.push(this.getQuickReference('Combat.Cover.ThreeQuartersCover'));
    cover.children.push(this.getQuickReference('Combat.Cover.TotalCover'));
    combat.children.push(this.getQuickReference('Combat.CriticalHits'));
    const damage = this.getQuickReference('Combat.Damage');
    combat.children.push(damage);
    const damageTypes = this.getQuickReference('Combat.Damage.DamageTypes');
    damage.children.push(damageTypes);
    const damageModifiers = this.getQuickReference('Combat.Damage.DamageModifiers');
    damage.children.push(damageModifiers);
    damageModifiers.children.push(this.getQuickReference('Combat.Damage.DamageModifiers.Resistance'));
    damageModifiers.children.push(this.getQuickReference('Combat.Damage.DamageModifiers.Vulnerability'));
    damage.children.push(this.getQuickReference('Combat.Damage.InstantDeath'));
    damage.children.push(this.getQuickReference('Combat.Damage.FallingUnconscious'));
    damage.children.push(this.getQuickReference('Combat.Damage.DeathSavingThrows'));
    damage.children.push(this.getQuickReference('Combat.Damage.Stabilizing'));
    damage.children.push(this.getQuickReference('Combat.Damage.MonstersAndDeath'));
    damage.children.push(this.getQuickReference('Combat.Damage.KnockingACreatureOut'));

    return this.damageTypeService.getDamageTypes().then((list: ListObject[]) => {
      list.forEach((damageType: ListObject) => {
        damageTypes.children.push(this.getQuickReferenceFromListObject(damageType));
      });

      return combat;
    });
  }

  private initializeConditions(): Promise<QuickReference> {
    const conditionReference = this.getQuickReference('Conditions');
    this.quickReferences.push(conditionReference);

    const conditions = this.conditionService.getConditionsFromStorage();
    conditions.forEach((condition: ListObject) => {
      conditionReference.children.push(this.getQuickReferenceFromListObject(condition));
    });

    conditionReference.tables = [];
    conditionReference.tables.push(this.getQuickReferenceTable(
      'Exhaustion',
      ['Level', 'Effect'],
      [
        ['1', 'Disadvantage on ability checks'],
        ['2', 'Speed halved'],
        ['3', 'Disadvantage on attack rolls and saving throws'],
        ['4', 'Hit point maximum halved'],
        ['5', 'Speed reduced to 0'],
        ['6', 'Death']
      ],
      this.translate.instant('QuickReferences.Conditions.Exhaustion.Description')
    ));

    return Promise.resolve(conditionReference);
  }

  private initializeEnvironment(): Promise<QuickReference> {
    const environment = this.getQuickReference('Environment');
    this.quickReferences.push(environment);
    environment.children.push(this.getQuickReference('Environment.Falling'));
    environment.children.push(this.getQuickReference('Environment.Suffocating'));
    const visionAndLight = this.getQuickReference('Environment.VisionAndLight');
    environment.children.push(visionAndLight);
    visionAndLight.children.push(this.getQuickReference('Environment.VisionAndLight.LightlyObscured'));
    visionAndLight.children.push(this.getQuickReference('Environment.VisionAndLight.HeavilyObscured'));
    visionAndLight.children.push(this.getQuickReference('Environment.VisionAndLight.BrightLight'));
    visionAndLight.children.push(this.getQuickReference('Environment.VisionAndLight.DimLight'));
    visionAndLight.children.push(this.getQuickReference('Environment.VisionAndLight.Darkness'));
    const senses = this.getQuickReference('Environment.Senses');
    environment.children.push(senses);
    senses.children.push(this.getQuickReference('Environment.Senses.Blindsignt'));
    senses.children.push(this.getQuickReference('Environment.Senses.Darkvision'));
    senses.children.push(this.getQuickReference('Environment.Senses.Tremorsense'));
    senses.children.push(this.getQuickReference('Environment.Senses.Truesight'));

    environment.tables = [];
    environment.tables.push(this.getQuickReferenceTable(
      'Light',
      ['Source', 'Bright (ft)', 'Dim (ft)', 'Duration'],
      [
        ['Candle',               '5',  '5',  '1 hour'],
        ['Lamp',                 '15', '30', '6 hours'],
        ['Lantern, bullseye',    '60', '60', '6 hours'],
        ['Lantern, hooded',      '30', '30', '6 hours'],
        ['Lantern lowered hood', '0',  '5',  '6 hours'],
        ['Torch',                '20', '20', '1 hour']
      ]
    ));

    return Promise.resolve(environment);
  }

  private initializeMonsters(): Promise<QuickReference> {
    const monsters = this.getQuickReference('Monsters');
    this.quickReferences.push(monsters);
    const monsterTypes = this.getQuickReference('Monsters.MonsterTypes');
    monsters.children.push(monsterTypes);
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.ABERRATION'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.BEAST'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.CELESTIAL'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.CONSTRUCT'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.DRAGON'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.ELEMENTAL'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.FEY'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.FIEND'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.GIANT'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.HUMANOID'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.MONSTROSITY'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.OOZE'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.PLANT'));
    monsterTypes.children.push(this.getQuickReference('Monsters.MonsterTypes.UNDEAD'));
    const actions = this.getQuickReference('Monsters.Actions');
    monsters.children.push(actions);
    actions.children.push(this.getQuickReference('Monsters.Actions.Reactions'));
    actions.children.push(this.getQuickReference('Monsters.Actions.LimitedUsage'));
    actions.children.push(this.getQuickReference('Monsters.Actions.LegendaryActions'));
    actions.children.push(this.getQuickReference('Monsters.Actions.LairActions'));

    return Promise.resolve(monsters);
  }

  private initializePoisons(): Promise<QuickReference> {
    const poisons = this.getQuickReference('Poisons');
    this.quickReferences.push(poisons);
    poisons.children.push(this.getQuickReference('Poisons.Contact'));
    poisons.children.push(this.getQuickReference('Poisons.Ingested'));
    poisons.children.push(this.getQuickReference('Poisons.Inhaled'));
    poisons.children.push(this.getQuickReference('Poisons.Injury'));
    return Promise.resolve(poisons);
  }

  private initializeSkills(): Promise<QuickReference> {
    const skillsReference = this.getQuickReference('Skills');
    this.quickReferences.push(skillsReference);
    skillsReference.children.push(this.getQuickReference('Skills.GroupChecks'));

    skillsReference.tables = [];
    skillsReference.tables.push(this.getQuickReferenceTable(
      'Typical Difficulty Classes',
      ['Task', 'DC'],
      [
        ['Very Easy', '5'],
        ['Easy', '10'],
        ['Medium', '15'],
        ['Hard', '20'],
        ['Very Hard', '25'],
        ['Nearly Impossible', '30'],
      ]
    ));
    return this.skillService.getSkills().then((skills: ListObject[]) => {
      skills.forEach((skill: ListObject) => {
        skillsReference.children.push(this.getQuickReferenceFromListObject(skill));
      });

      return skillsReference;
    });
  }

  private initializeSpellcasting(): Promise<QuickReference> {
    const spellcasting = this.getQuickReference('Spellcasting');
    this.quickReferences.push(spellcasting);
    spellcasting.children.push(this.getQuickReference('Spellcasting.Cantrips'));
    spellcasting.children.push(this.getQuickReference('Spellcasting.Rituals'));
    const components = this.getQuickReference('Spellcasting.Components');
    spellcasting.children.push(components);
    components.children.push(this.getQuickReference('Spellcasting.Components.Verbal'));
    components.children.push(this.getQuickReference('Spellcasting.Components.Somatic'));
    components.children.push(this.getQuickReference('Spellcasting.Components.Material'));
    const aoes = this.getQuickReference('Spellcasting.AreaOfEffects');
    spellcasting.children.push(aoes);

    const promises = [];
    promises.push(this.areaOfEffectService.getAreaOfEffects().then((list: ListObject[]) => {
      list.forEach((areaOfEffect: ListObject) => {
        aoes.children.push(this.getQuickReferenceFromListObject(areaOfEffect));
      });
    }));
    const schools = this.getQuickReference('Spellcasting.TheSchoolsOfMagic');
    spellcasting.children.push(schools);
    promises.push(this.spellSchoolService.getSpellSchools().then((list: ListObject[]) => {
      list.forEach((school: ListObject) => {
        schools.children.push(this.getQuickReferenceFromListObject(school));
      });
    }));

    return Promise.all(promises).then(() => {
      return Promise.resolve(spellcasting);
    });
  }

  private initializeTraps(): Promise<QuickReference> {
    const traps = this.getQuickReference('Traps');
    this.quickReferences.push(traps);
    traps.children.push(this.getQuickReference('Traps.TriggeringATrap'));
    traps.children.push(this.getQuickReference('Traps.DetectingAndDisablingATrap'));

    traps.tables = [];
    traps.tables.push(this.getQuickReferenceTable(
      'Trap Save DCs and Attack Bonuses',
      ['Trap Danger', 'Save DC', 'Attack Bonus'],
      [
        ['Setback', '10-11', '+3 to +5'],
        ['Dangerous', '12-15', '+6 to +8'],
        ['Deadly', '16-20', '+9 to +12']
      ]
    ));
    traps.tables.push(this.getQuickReferenceTable(
      'Damage Severity by Level',
      ['Level', 'Setback', 'Dangerous', 'Deadly'],
      [
        ['"1-4', '1d10', '2d10', '4d10'],
        ['5-10', '2d10', '4d10', '10d10'],
        ['11-16', '4d10', '10d10', '18d10'],
        ['17-20', '10d10', '18d10', '24d10']
      ]
    ));

    return Promise.resolve(traps);
  }

  private initializeTravel(): Promise<QuickReference> {
    const travel = this.getQuickReference('Travel');
    this.quickReferences.push(travel);
    travel.children.push(this.getQuickReference('Travel.ForcedMarch'));
    travel.children.push(this.getQuickReference('Travel.MountsAndVehicles'));
    travel.children.push(this.getQuickReference('Travel.DifficultTerrain'));
    travel.children.push(this.getQuickReference('Travel.ClimbingSwimmingAndCrawling'));
    travel.children.push(this.getQuickReference('Travel.LongJump'));
    travel.children.push(this.getQuickReference('Travel.HighJump'));

    travel.tables = [];
    travel.tables.push(this.getQuickReferenceTable(
      'Travel Pace',
      ['Pace', 'Minute', 'Hour', 'Day'],
      [
        ['Fast', '400 feet', '4 miles', '30 miles'],
        ['Normal', '300 feet', '3 miles', '24 miles'],
        ['Slow', '200 feet', '2 miles', '18 miles']
      ]
    ));

    return Promise.resolve(travel);
  }

  private initializeWeaponProperties(): Promise<QuickReference> {
    const weaponPropertiesReference = this.getQuickReference('WeaponProperties');
    this.quickReferences.push(weaponPropertiesReference);
    return this.weaponPropertyService.getWeaponProperties().then((weaponProperties: ListObject[]) => {
      weaponProperties.forEach((weaponProperty: ListObject) => {
        weaponPropertiesReference.children.push(this.getQuickReferenceFromListObject(weaponProperty));
      });
      weaponPropertiesReference.children.push(this.getQuickReference('WeaponProperties.Improvised'));
      weaponPropertiesReference.children.push(this.getQuickReference('WeaponProperties.Silvered'));

      return weaponPropertiesReference;
    });
  }

  private getQuickReference(key: string): QuickReference {
    const quickReference = new QuickReference();
    quickReference.id = key;
    quickReference.title = this.translate.instant(`QuickReferences.${key}.Header`);
    const description = this.translate.instant(`QuickReferences.${key}.Description`);
    if (description !== `QuickReferences.${key}.Description`) {
      quickReference.description = description;
    }
    return quickReference;
  }

  private getQuickReferenceFromListObject(listObject: ListObject): QuickReference {
    const quickReference = new QuickReference();
    quickReference.id = listObject.id;
    quickReference.title = listObject.name;
    if (listObject.description != null && listObject.description !== '') {
      quickReference.description = listObject.description;
    }
    return quickReference;
  }

  private getQuickReferenceTable(title: string, columns: string[], rows: string[][], description: string = ''): QuickReferenceTable {
    const table = new QuickReferenceTable();
    table.title = title;
    table.description = description;
    table.columns = columns;

    rows.forEach((row: string[]) => {
      const tableRow = new QuickReferenceTableRow();
      tableRow.values = row;
      table.rows.push(tableRow);
    });

    return table;
  }

  private filterHeaders(): void {
    let search = this.headerFilterFormControl.value;
    if (!search) {
      this.filteredHeaders = this.headers.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredHeaders = this.headers.filter(item => item.title.toLowerCase().indexOf(search) > -1);
  }

  scrollToHeader(quickReference: QuickReference): void {
    quickReference.expanded = true;
    this.expandParents(quickReference);

    setTimeout(() => {
      const el: HTMLElement = document.getElementById(quickReference.id);
      if (el != null) {
        el.scrollIntoView({behavior: 'smooth'});
      }
    }, 500);
  }

  private expandParents(quickReference: QuickReference): void {
    if (quickReference.parent != null) {
      quickReference.parent.expanded = true;
      this.expandParents(quickReference.parent);
    }
  }

  selectOpen(sel: MatSelect) {
    sel.placeholder = '';
  }

  selectClose(sel: MatSelect) {
    if (sel.value === undefined) {
      sel.placeholder = this.translate.instant('Search')
    }
  }

  closeSection(quickReference: QuickReference): void {
    if (this.selectedItem != null && quickReference.id === this.selectedItem.id) {
      this.selectedItem = null;
    }
  }
}
