import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import * as _ from 'lodash';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {PowerModifier} from '../../../../shared/models/powers/power-modifier';
import {CreatureSpellList} from '../../../../shared/models/creatures/creature-spell-list';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-character-spell-info-slide-in',
  templateUrl: './character-spell-info-slide-in.component.html',
  styleUrls: ['./character-spell-info-slide-in.component.scss']
})
export class CharacterSpellInfoSlideInComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() attackModifiers: Map<string, PowerModifier>;
  @Input() saveModifiers: Map<string, PowerModifier>;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  spells: CreatureSpell[] = [];
  viewingSpell: CreatureSpell = null;

  //viewing spell modifiers
  attackModifier: PowerModifier = null;
  saveModifier: PowerModifier = null;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.updateSpellsList();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.SpellcastingAbilityChange
        || event === EVENTS.ModifiersUpdated) {
        if (this.viewingSpell != null) {
          this.spellClick(this.viewingSpell);
        }
      } else if (event === EVENTS.UpdateSpellList) {
        this.updateSpellsList();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private updateSpellsList(): void {
    this.spells = _.cloneDeep(this.playerCharacter.creatureSpellCasting.spells);
  }

  spellClick(creatureSpell: CreatureSpell): void {
    this.attackModifier = this.attackModifiers.get(creatureSpell.assignedCharacteristic);
    this.saveModifier = this.saveModifiers.get(creatureSpell.assignedCharacteristic);
    this.viewingSpell = creatureSpell;
  }

  closeDetails(): void {
    this.viewingSpell = null;
  }

  saveClick(): void {
    const creatureSpellList: CreatureSpellList = new CreatureSpellList();
    creatureSpellList.creatureSpells = this.spells;

    this.spells.forEach((creatureSpell: CreatureSpell) => {
      if (!creatureSpell.prepared) {
        creatureSpell.active = false;
        creatureSpell.concentrating = false;
      }
    });

    this.creatureService.prepareSpell(this.playerCharacter, creatureSpellList).then(() => {
      this.playerCharacter.creatureSpellCasting.spells = this.spells;
      this.eventsService.dispatchEvent(EVENTS.FetchSpellList);
      this.save.emit();
    });
  }

  closeClick(): void {
    this.close.emit();
  }

}
