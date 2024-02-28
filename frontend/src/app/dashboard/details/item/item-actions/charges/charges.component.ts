import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {ListObject} from '../../../../../shared/models/list-object';
import {EVENTS} from '../../../../../constants';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {EventsService} from '../../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';
import {Roll} from '../../../../../shared/models/rolls/roll';
import {RollResultDialogData} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {RollRequest} from '../../../../../shared/models/rolls/roll-request';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DiceService} from '../../../../../core/services/dice.service';
import {TranslateService} from '@ngx-translate/core';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {ItemType} from '../../../../../shared/models/items/item-type.enum';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class ChargesComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() creatureItem: CreatureItem;
  @Input() containers: ListObject[];
  @Output() continue = new EventEmitter<null>();
  @Output() recharge = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();

  magicalItem: MagicalItem = null;
  eventSub: Subscription;
  loading = false;
  charges = 0;

  constructor(
    private dialog: MatDialog,
    private creatureItemService: CreatureItemService,
    private creatureService: CreatureService,
    private eventsService: EventsService,
    private diceService: DiceService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
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
    this.charges = this.creatureItem.chargesRemaining;

    if (this.creatureItem.item.itemType === ItemType.MAGICAL_ITEM) {
      this.magicalItem = this.creatureItem.item as MagicalItem;
    }
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
    const item = _.cloneDeep(this.creatureItem);
    item.chargesRemaining = this.charges;
    this.creatureItemService.updateItems([item], this.creature).then(() => {
      this.creatureItem.chargesRemaining = item.chargesRemaining;
      this.loading = false;
      this.continue.emit();
    });
  }

  rechargeClick(): void {
    this.loading = true;
    const item = _.cloneDeep(this.creatureItem);

    this.creatureService.rollStandard(this.creature, this.getRollRequest()).then((roll: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.creature, roll);
      this.dialog.open(RollResultDialogComponent, dialogConfig);

      item.chargesRemaining += roll.totalResult;
      if (item.chargesRemaining > item.maxCharges) {
        item.chargesRemaining = item.maxCharges;
      }

      this.creatureItemService.updateItems([item], this.creature).then(() => {
        this.creatureItem.chargesRemaining = item.chargesRemaining;
        this.loading = false;
        this.recharge.emit();
      });
    });
  }

  private getRollRequest(): RollRequest {
    let name = this.creatureItem.item.name;
    if (this.creatureItem.magicalItem != null && this.creatureItem.magicalItem.name !== '') {
      name = `${name} - ${this.creatureItem.magicalItem.name}`;
    }
    return this.diceService.getDiceRollRequest(
      this.magicalItem.rechargeRate,
      this.translate.instant('RechargeItem', {item: name})
    );
  }

  cancelClick(): void {
    this.cancel.emit();
  }

}
