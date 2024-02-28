import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {SelectionItem} from '../../../../shared/models/items/selection-item';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';
import {DiceCollection} from '../../../../shared/models/characteristics/dice-collection';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureInventory} from '../../../../shared/models/creatures/creature-inventory';
import {ItemQuantity} from '../../../../shared/models/items/item-quantity';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {StartingEquipmentChoice} from '../../../../constants';
import {DiceService} from '../../../../core/services/dice.service';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollRequest} from '../../../../shared/models/rolls/roll-request';
import {CreatureWealth} from '../../../../shared/models/creatures/creature-wealth';
import {CreatureWealthAmount} from '../../../../shared/models/creatures/creature-wealth-amount';
import {CostUnitService} from '../../../../core/services/items/cost-unit.service';
import {StartingEquipment} from '../../../../shared/models/startingEquipment/starting-equipment';
import {StartingEquipmentItemGroup} from '../../../../shared/models/startingEquipment/starting-equipment-item-group';
import {StartingEquipmentItemGroupOption} from '../../../../shared/models/startingEquipment/starting-equipment-item-group-option';
import {StartingEquipmentItemGroupOptionItem} from '../../../../shared/models/startingEquipment/starting-equipment-item-group-option-item';
import {StartingEquipmentType} from '../../../../shared/models/startingEquipment/starting-equipment-type.enum';
import {ItemListObject} from '../../../../shared/models/items/item-list-object';
import {ItemFilterService} from '../../../../core/services/item-filter.service';

export class StartingEquipmentPage {
  characteristic: Characteristic;
  startingEquipmentChoice: StartingEquipmentChoice;
  groups: StartingEquipmentSelectionGroup[] = [];
  startingGold: DiceCollection = new DiceCollection();
  hasChoice = false;
  hasGold = false;
  hasItems = false;
  goldCalculationLabel = '';
  startingGoldValue = 0;
  maxGold = 0;
}

export class StartingEquipmentSelectionGroup {
  expanded = true;
  group: StartingEquipmentItemGroup;
  options: StartingEquipmentSelectionGroupOption[] = [];
}

export class StartingEquipmentSelectionGroupOption {
  option: StartingEquipmentItemGroupOption;
  selected = false;
  items: StartingEquipmentSelectionGroupOptionItem[] = [];
}

export class StartingEquipmentSelectionGroupOptionItem {
  item: StartingEquipmentItemGroupOptionItem;
  selectionItem: SelectionItem;
  displayName = '';
  secondaryDisplayName = '';
  quantity = 0;
}

@Component({
  selector: 'app-starting-equipment',
  templateUrl: './starting-equipment.component.html',
  styleUrls: ['./starting-equipment.component.scss']
})
export class StartingEquipmentComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  loading = false;
  step = 0;
  pages: StartingEquipmentPage[] = [];
  currentPage: StartingEquipmentPage = new StartingEquipmentPage();
  viewingItem: StartingEquipmentSelectionGroupOptionItem;
  startingEquipmentChoices: StartingEquipmentChoice[] = [];

  allSelectedItems: SelectionItem[] = [];
  totalGold = 0;

  constructor(
    private characteristicService: CharacteristicService,
    private creatureService: CreatureService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private diceService: DiceService,
    private costUnitService: CostUnitService,
    private itemFilterService: ItemFilterService
  ) { }

  ngOnInit() {
    this.initializePages();
    this.startingEquipmentChoices = [];
    this.startingEquipmentChoices.push('EQUIPMENT');
    this.startingEquipmentChoices.push('CURRENCY');
  }

  private initializePages(): void {
    this.loading = true;
    const primaryClass = this.playerCharacter.classes[0].characterClass;
    const race = this.playerCharacter.characterRace.race;
    const background = this.playerCharacter.characterBackground.background;

    this.itemFilterService.initializeFilterOptions().then(() => {
      const promises: Promise<any>[] = [];
      promises.push(this.initializePage(primaryClass, primaryClass.startingGold, 0));
      promises.push(this.initializePage(race, null, race.startingGold));
      if (background != null) {
        promises.push(this.initializePage(background, null, background.startingGold));
      }

      Promise.all(promises).then(() => {
        //todo - sort pages
        this.selectionChange();
        this.updateTotalGold();
        if (this.pages.length > 0) {
          this.currentPage = this.pages[0];
        }
        this.loading = false;
      });
    });
  }

  private initializePage(characteristic: Characteristic, startingGold: DiceCollection, goldModifier: number): Promise<any> {
    if (characteristic == null) {
      return Promise.resolve();
    }

    const page = new StartingEquipmentPage();
    page.characteristic = characteristic;
    if (startingGold == null) {
      startingGold = new DiceCollection();
      startingGold.numDice = 0;
      startingGold.diceSize = DiceSize.ONE;
      startingGold.miscModifier = 0;
    }
    startingGold.miscModifier += goldModifier;
    page.startingGold = startingGold;
    page.hasGold = page.startingGold.numDice > 0 || page.startingGold.miscModifier > 0;
    if (page.startingGold.numDice > 0) {
      page.goldCalculationLabel = this.translate.instant('StartingGoldCalculation', {
        numDice: page.startingGold.numDice,
        diceSize: this.translate.instant('DiceSize.' + page.startingGold.diceSize),
        modifier: page.startingGold.miscModifier
      });
      const maxResult = this.diceService.getMaxResult(page.startingGold.numDice, page.startingGold.diceSize);
      page.maxGold = maxResult * page.startingGold.miscModifier;
    } else if (page.startingGold.miscModifier > 0) {
      page.startingGoldValue = page.startingGold.miscModifier;
    }

    return this.characteristicService.getStartingEquipment(characteristic, true).then((startingEquipment: StartingEquipment[]) => {
      const groupMap = new Map<number, StartingEquipmentItemGroup>();
      this.characteristicService.initializeStartingEquipmentGroup(startingEquipment, groupMap, null);
      const groups = Array.from(groupMap.values());

      groups.sort((left: StartingEquipmentItemGroup, right: StartingEquipmentItemGroup) => {
        return left.groupNumber - right.groupNumber;
      });

      let hasItems = false;
      groups.forEach((group: StartingEquipmentItemGroup) => {
        group.options.sort((left: StartingEquipmentItemGroupOption, right: StartingEquipmentItemGroupOption) => {
          return left.optionNumber - right.optionNumber;
        });

        group.options.forEach((option: StartingEquipmentItemGroupOption) => {
          hasItems = hasItems || option.items.length > 0;
        });

        this.characteristicService.updateOptionLabels(group);
      });

      groups.forEach((group: StartingEquipmentItemGroup) => {
        const selectionGroup = this.initializeGroup(group);
        if (selectionGroup != null) {
          page.groups.push(selectionGroup);
        }
      });

      page.hasItems = hasItems;
      page.hasChoice = page.startingGold.numDice > 0 && page.hasItems;
      if (page.hasChoice || !page.hasGold) {
        page.startingEquipmentChoice = 'EQUIPMENT';
      } else if (page.hasGold) {
        page.startingEquipmentChoice = 'CURRENCY';
      }

      if (page.hasItems || page.hasGold) {
        this.pages.push(page);
      }
    });
  }

  private initializeGroup(group: StartingEquipmentItemGroup): StartingEquipmentSelectionGroup {
    const selectionGroup = new StartingEquipmentSelectionGroup();
    selectionGroup.group = group;

    group.options.forEach((option: StartingEquipmentItemGroupOption, index: number) => {
      const groupOption = new StartingEquipmentSelectionGroupOption();
      groupOption.option = option;
      groupOption.selected = index === 0;
      selectionGroup.options.push(groupOption);

      option.items.forEach((item: StartingEquipmentItemGroupOptionItem) => {
        const selectionItem = new StartingEquipmentSelectionGroupOptionItem();
        selectionItem.item = item;
        selectionItem.selectionItem = null;
        if (item.startingEquipmentType === StartingEquipmentType.ITEM && item.item != null) {
          selectionItem.selectionItem = new SelectionItem();
          selectionItem.selectionItem.item = new ItemListObject(item.item.id, item.item.name);
          selectionItem.displayName = item.item.name;
        } else if (item.startingEquipmentType === StartingEquipmentType.FILTER) {
          selectionItem.displayName = this.itemFilterService.getFilterDisplay(item.filters);
          selectionItem.secondaryDisplayName = this.translate.instant('ClickHereToChooseItem');
        }
        selectionItem.quantity = item.quantity;
        groupOption.items.push(selectionItem);
      });
    });

    return selectionGroup;
  }

  saveClick(): void {
    if (this.isMissingItems()) {
      this.promptMissingItems();
    } else if (this.isMissingCurrency()) {
      this.promptMissingCurrency();
    } else {
      this.promptConfirmation();
    }
  }

  private promptMissingItems(): void {
    const title = this.translate.instant('StartingEquipment.MissingItems.Title');
    const message = this.translate.instant('StartingEquipment.MissingItems.Message');
    this.showDialog(title, message);
  }

  private promptMissingCurrency(): void {
    const title = this.translate.instant('StartingEquipment.MissingCurrency.Title');
    const message = this.translate.instant('StartingEquipment.MissingCurrency.Message');
    this.showDialog(title, message);
  }

  private promptConfirmation(): void {
    const title = this.translate.instant('StartingEquipment.ContinueConfirmation.Title');
    const message = this.translate.instant('StartingEquipment.ContinueConfirmation.Message');
    this.showDialog(title, message);
  }

  private showDialog(title: string, message: string): void {
    const data = new YesNoDialogData();
    data.title = title;
    data.message = message;
    data.yes = () => {
      this.continueSave();
    };
    data.no = () => {
      //do nothing
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private isMissingCurrency(): boolean {
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages[i];
      if (page.hasGold && (!page.hasChoice || page.startingEquipmentChoice === 'CURRENCY')) {
        if (page.startingGoldValue === 0) {
          return true;
        }
      }
    }
    return false;
  }

  private isMissingItems(): boolean {
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages[i];
      if (page.hasItems && (!page.hasChoice || page.startingEquipmentChoice === 'EQUIPMENT')) {
        for (let j = 0; j < page.groups.length; j++) {
          const group = page.groups[j];
          const missingItems = this.isMissingGroupItems(group);
          if (missingItems) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private isMissingGroupItems(group: StartingEquipmentSelectionGroup): boolean {
    let missing = false;
    let selected = false;
    group.options.forEach((option: StartingEquipmentSelectionGroupOption) => {
      if (option.selected) {
        selected = true;
        option.items.forEach((item: StartingEquipmentSelectionGroupOptionItem) => {
          if (item.item.startingEquipmentType === StartingEquipmentType.FILTER && item.selectionItem == null) {
            missing = true;
          }
        });
      }
    });

    return missing || !selected;
  }

  private continueSave(): void {
    const promises: Promise<any>[] = [];

    const creatureInventory = new CreatureInventory();
    creatureInventory.items = this.allSelectedItems;
    if (creatureInventory.items.length > 0) {
      promises.push(this.creatureService.addItems(this.playerCharacter, creatureInventory));
    }

    if (this.totalGold > 0) {
      const updatedWealth = new CreatureWealth();
      updatedWealth.amounts = this.getUpdatedAmounts(this.totalGold);
      if (updatedWealth.amounts.length > 0) {
        promises.push(this.creatureService.updateCreatureWealth(this.playerCharacter, updatedWealth));
      }
    }

    Promise.all(promises).then(() => {
      this.continue.emit();
    });
  }

  private getUpdatedAmounts(goldGained: number): CreatureWealthAmount[] {
    const amounts: CreatureWealthAmount[] = [];
    const goldUnit = this.costUnitService.getCostUnitByAbbreviation('GP');
    if (goldUnit != null) {
      const goldCreatureWealthAmount = this.creatureService.getCreatureWealthByCostUnit(this.playerCharacter, goldUnit);
      if (goldCreatureWealthAmount != null) {
        goldCreatureWealthAmount.amount += goldGained;
        amounts.push(goldCreatureWealthAmount);
      }
    }
    return amounts;
  }

  updateTotalGold(): void {
    let total = 0
    this.pages.forEach((page: StartingEquipmentPage) => {
      if (page.hasGold && (!page.hasChoice || page.startingEquipmentChoice === 'CURRENCY')) {
        total += page.startingGoldValue;
      }
    });
    this.totalGold = total;
  }

  setStep(step: number): void {
    this.step = step;
    if (step < this.pages.length && step > -1) {
      this.currentPage = this.pages[step];
    }
  }

  toggleSelected(selectionItem: SelectionItem): void {
    selectionItem.selected = !selectionItem.selected;
    this.viewingItem = null;
  }

  onItemClick(item: StartingEquipmentSelectionGroupOptionItem): void {
    this.viewingItem = item;
  }

  closeItem(): void {
    this.viewingItem = null;
  }

  continueItem(selectionItem: SelectionItem): void {
    this.viewingItem.selectionItem = selectionItem;
    this.viewingItem.secondaryDisplayName = selectionItem.item.name;
    this.viewingItem = null;
    this.selectionChange();
  }

  selectionChange(): void {
    const itemMap = new Map<string, SelectionItem>();

    this.pages.forEach((page: StartingEquipmentPage) => {
      if (page.hasItems && (!page.hasChoice || page.startingEquipmentChoice === 'EQUIPMENT')) {
        page.groups.forEach((group: StartingEquipmentSelectionGroup) => {
          group.options.forEach((option: StartingEquipmentSelectionGroupOption) => {
            if (option.selected)  {
              option.items.forEach((item: StartingEquipmentSelectionGroupOptionItem) => {
                if (item.selectionItem != null && item.selectionItem.item != null) {
                  let itemQuantity = itemMap.get(item.selectionItem.item.id);
                  if (itemQuantity == null) {
                    itemQuantity = new SelectionItem();
                    itemQuantity.item = item.selectionItem.item;
                    itemMap.set(item.selectionItem.item.id, itemQuantity);
                  }
                  itemQuantity.quantity += item.quantity;
                }
              });
            }
          });
        });
      }
    });
    this.allSelectedItems = Array.from(itemMap.values());
  }

  private startingEquipmentTypeChange(choice: StartingEquipmentChoice): void {
    this.currentPage.startingEquipmentChoice = choice;
    this.selectionChange();
    this.updateTotalGold();
  }

  rollStartingGold(): void {
    this.creatureService.rollStandard(this.playerCharacter, this.getStartingGoldRollRequest()).then((roll: Roll) => {
      this.currentPage.startingGoldValue = roll.totalResult * this.currentPage.startingGold.miscModifier;
      this.updateTotalGold();
    });
  }

  private getStartingGoldRollRequest(): RollRequest {
    return this.diceService.getDiceRollRequest(
      this.currentPage.startingGold,
      this.translate.instant('StartingGoldRollRequest', {characteristic: this.currentPage.characteristic.name}),
      false
    );
  }

  maxStartingGold(): void {
    this.currentPage.startingGoldValue = this.currentPage.maxGold;
    this.updateTotalGold();
  }

  startingGoldValueChange(input): void {
    this.currentPage.startingGoldValue = parseInt(input.value, 10);
    this.updateTotalGold();
  }

  closeDetails(): void {
    this.close.emit();
  }

}
