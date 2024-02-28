import {Component, Input, OnInit} from '@angular/core';
import {Background} from '../../../../shared/models/characteristics/background';
import {BackgroundTraitCollection} from '../../../manage/background/background-info/background-info.component';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {BackgroundService} from '../../../../core/services/characteristics/background.service';
import {BackgroundTraitType} from '../../../../shared/models/characteristics/background-trait-type.enum';
import {CharacteristicConfigurationCollection} from '../../../../shared/models/characteristics/characteristic-configuration-collection';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';

@Component({
  selector: 'app-background-details',
  templateUrl: './background-details.component.html',
  styleUrls: ['./background-details.component.scss']
})
export class BackgroundDetailsComponent implements OnInit {
  @Input() background: Background;

  traitCollection = new BackgroundTraitCollection();
  VARIATION = BackgroundTraitType.VARIATION;
  PERSONALITY = BackgroundTraitType.PERSONALITY;
  IDEAL = BackgroundTraitType.IDEAL;
  BOND = BackgroundTraitType.BOND;
  FLAW = BackgroundTraitType.FLAW;
  characteristicConfigurationCollection = new CharacteristicConfigurationCollection();

  constructor(
    private characteristicService: CharacteristicService,
    private backgroundService: BackgroundService
  ) { }

  ngOnInit() {
    this.traitCollection.variations = this.background.variations;
    this.traitCollection.personalities = this.background.personalities;
    this.traitCollection.ideals = this.background.ideals;
    this.traitCollection.bonds = this.background.bonds;
    this.traitCollection.flaws = this.background.flaws;
    this.updateParentTraits(this.background.parent);

    this.characteristicService.initializeConfigurationCollection(this.background, false).then((collection: CharacteristicConfigurationCollection) => {
      this.characteristicConfigurationCollection = collection;
    });
  }

  private updateParentTraits(parent: Characteristic): void {
    if (parent != null && parent.characteristicType === CharacteristicType.BACKGROUND) {
      this.traitCollection.parentVariations = this.backgroundService.getAllVariations(parent as Background);
      this.traitCollection.parentPersonalities = this.backgroundService.getAllPersonalities(parent as Background);
      this.traitCollection.parentIdeals = this.backgroundService.getAllIdeals(parent as Background);
      this.traitCollection.parentBonds = this.backgroundService.getAllBonds(parent as Background);
      this.traitCollection.parentFlaws = this.backgroundService.getAllFlaws(parent as Background);
    } else {
      this.traitCollection.parentVariations = [];
      this.traitCollection.parentPersonalities = [];
      this.traitCollection.parentIdeals = [];
      this.traitCollection.parentBonds = [];
      this.traitCollection.parentFlaws = [];
    }
  }

}
