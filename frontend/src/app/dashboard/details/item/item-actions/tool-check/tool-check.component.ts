import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {ListObject} from '../../../../../shared/models/list-object';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {Subscription} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {EventsService} from '../../../../../core/services/events.service';
import {DiceService} from '../../../../../core/services/dice.service';
import {EVENTS} from '../../../../../constants';
import {ItemType} from '../../../../../shared/models/items/item-type.enum';
import {Roll} from '../../../../../shared/models/rolls/roll';
import {RollResultDialogData} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {RollRequest} from '../../../../../shared/models/rolls/roll-request';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Proficiency} from '../../../../../shared/models/proficiency';
import {TranslateService} from '@ngx-translate/core';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';

@Component({
  selector: 'app-tool-check',
  templateUrl: './tool-check.component.html',
  styleUrls: ['./tool-check.component.scss']
})
export class ToolCheckComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() creatureItem: CreatureItem;
  @Input() collection: CreatureConfigurationCollection;
  @Output() continue = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();

  proficiency: Proficiency = new Proficiency();
  abilityModifier = 0;
  profModifier = 0;
  resurrectionPenalty = 0;
  misc = 0;
  total = 0;

  ability: ListObject = null;
  abilities: ListObject[] = [];
  noAbility = '';

  magicalItem: MagicalItem = null;
  eventSub: Subscription;
  loading = false;

  constructor(
    private dialog: MatDialog,
    private creatureItemService: CreatureItemService,
    private creatureService: CreatureService,
    private eventsService: EventsService,
    private diceService: DiceService,
    private translate: TranslateService,
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.initializeAbilities();
    this.initialize();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.creatureItem = this.getCreatureItem();
        if (this.creatureItem == null || this.creatureItem.quantity === 0) {
          this.cancelClick();
          return;
        }
        this.initialize();
      }
    });
  }

  private initialize(): void {
    this.proficiency.proficient = this.creatureService.isItemProficient(this.creatureItem, this.collection);
    this.profModifier = this.getProfModifier();
    this.resurrectionPenalty = this.creature.creatureHealth.resurrectionPenalty;
    this.updateTotal();

    if (this.creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      this.magicalItem = this.creatureItem.item as MagicalItem;
    }
  }

  private initializeAbilities(): void {
    this.noAbility = this.translate.instant('None');
    this.abilities = [];
    const abilities = this.abilityService.getAbilitiesDetailedFromStorageAsListObject();
    const noAbility = new ListObject('0', '');
    abilities.unshift(noAbility);
    this.abilities = abilities;

    this.ability = this.abilities[0];
  }

  private getCreatureItem(): CreatureItem {
    const flatItems = this.creatureItemService.getFlatItemList(this.creature.items);
    for (let i = 0; i < flatItems.length; i++) {
      const creatureItem = flatItems[i];
      if (creatureItem.id === this.creatureItem.id) {
        return creatureItem;
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  continueClick(): void {
    this.loading = true;

    this.creatureService.rollStandard(this.creature, this.getRollRequest()).then((roll: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.creature, roll);
      this.dialog.open(RollResultDialogComponent, dialogConfig);
      this.continue.emit();
    });
  }

  private getRollRequest(): RollRequest {
    let name = this.creatureItem.item.name;
    if (this.creatureItem.magicalItem != null && this.creatureItem.magicalItem.name !== '') {
      name = `${name} - ${this.creatureItem.magicalItem.name}`;
    }

    return this.diceService.getStandardRollRequest(
      name,
      this.total,
      this.proficiency.advantage,
      this.proficiency.disadvantage
    );
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  private getProfModifier(): number {
    const profMod = this.creatureService.getProfModifier(this.collection);
    return this.creatureService.getProfModifierValue(profMod, this.proficiency.proficient, this.proficiency);
  }

  proficiencyChange(): void {
    this.profModifier = this.getProfModifier();
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.abilityModifier + this.profModifier + this.misc - this.resurrectionPenalty;
  }

  abilityChange(value: ListObject): void {
    this.ability = value;
    const ability = this.creatureService.getAbility(this.ability.id, this.collection);
    this.abilityModifier = this.creatureService.getAbilityModifier(ability, this.collection);
    this.updateTotal();
  }
}
