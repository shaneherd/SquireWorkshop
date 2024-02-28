import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {EventsService} from '../../../../core/services/events.service';
import * as _ from 'lodash';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreaturePowerList} from '../../../../shared/models/creatures/creature-power-list';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-character-feature-info-slide-in',
  templateUrl: './character-feature-info-slide-in.component.html',
  styleUrls: ['./character-feature-info-slide-in.component.scss']
})
export class CharacterFeatureInfoSlideInComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  features: CreatureFeature[] = [];
  hasLimitedUse = false;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.UpdateFeatureList) {
        this.initializeValues();
      }
    });
  }

  private initializeValues(): void {
    this.features = _.cloneDeep(this.playerCharacter.creatureFeatures.features);
    this.characterService.setLimitedUseCalculatedMax(this.features, this.playerCharacter, this.collection);
    this.hasLimitedUse = this.doesHaveLimitedUse();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private doesHaveLimitedUse(): boolean {
    for (let i = 0; i < this.features.length; i++) {
      if (this.features[i].calculatedMax > 0) {
        return true;
      }
    }
    return false;
  }

  saveClick(): void {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    this.features.forEach((creatureFeature: CreatureFeature) => {
      if (creatureFeature.calculatedMax > 0) {
        const power = new CreaturePower();
        power.id = creatureFeature.id;
        power.powerId = creatureFeature.powerId;
        power.usesRemaining = creatureFeature.usesRemaining;
        power.active = creatureFeature.active;
        creaturePowerList.creaturePowers.push(power);
      }
    });

    this.creatureService.updateCreaturePowers(this.playerCharacter, creaturePowerList).then(() => {
      this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
      this.save.emit();
    });
  }

  closeClick(): void {
    this.close.emit();
  }

  resetClick(): void {
    this.characterService.resetPowerLimitedUses(this.features, this.playerCharacter, this.collection, false, false, true).then(() => {
      this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
      this.save.emit();
    });
  }
}
