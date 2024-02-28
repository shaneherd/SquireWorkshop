import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Subscription} from 'rxjs';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import * as _ from 'lodash';
import {CreaturePowerList} from '../../../../shared/models/creatures/creature-power-list';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {CreaturePower} from '../../../../shared/models/creatures/creature-power';

@Component({
  selector: 'app-creature-spell-limited-use-slide-in',
  templateUrl: './creature-spell-limited-use-slide-in.component.html',
  styleUrls: ['./creature-spell-limited-use-slide-in.component.scss']
})
export class CreatureSpellLimitedUseSlideInComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  spells: CreatureSpell[] = [];
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
    this.spells = _.cloneDeep(this.creature.innateSpellCasting.spells);
    // this.characterService.setLimitedUseCalculatedMax(this.features, this.playerCharacter, this.collection);
    this.hasLimitedUse = this.doesHaveLimitedUse();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private doesHaveLimitedUse(): boolean {
    for (let i = 0; i < this.spells.length; i++) {
      if (this.spells[i].innateMaxUses > 0) {
        return true;
      }
    }
    return false;
  }

  saveClick(): void {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    this.spells.forEach((creatureSpell: CreatureSpell) => {
      if (creatureSpell.innateMaxUses > 0) {
        const power = new CreaturePower();
        power.id = creatureSpell.id;
        power.powerId = creatureSpell.powerId;
        power.usesRemaining = creatureSpell.usesRemaining;
        power.active = creatureSpell.active;
        creaturePowerList.creaturePowers.push(power);
      }
    });

    this.creatureService.updateCreaturePowers(this.creature, creaturePowerList).then(() => {
      this.creature.innateSpellCasting.spells = this.spells;
      this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
      this.save.emit();
    });
  }

  closeClick(): void {
    this.close.emit();
  }

  resetClick(): void {
    this.creatureService.resetInnateSpellUses(this.spells, this.creature).then(() => {
      this.creature.innateSpellCasting.spells = this.spells;
      this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
      this.save.emit();
    });
  }
}
