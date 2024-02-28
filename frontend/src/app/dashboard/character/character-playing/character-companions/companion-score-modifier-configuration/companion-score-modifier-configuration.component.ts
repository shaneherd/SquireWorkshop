import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {MonsterAbilityScore} from '../../../../../shared/models/creatures/monsters/monster';
import {Subscription} from 'rxjs';
import {CompanionService} from '../../../../../core/services/creatures/companion.service';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {EventsService} from '../../../../../core/services/events.service';
import {EVENTS} from '../../../../../constants';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CompanionModifier} from '../../../../../shared/models/creatures/companions/companion-modifier';

@Component({
  selector: 'app-companion-score-modifier-configuration',
  templateUrl: './companion-score-modifier-configuration.component.html',
  styleUrls: ['./companion-score-modifier-configuration.component.scss']
})
export class CompanionScoreModifierConfigurationComponent implements OnInit, OnDestroy {
  @Input() companion: Companion;
  @Input() companionCollection: CreatureConfigurationCollection;
  @Input() characterCollection: CreatureConfigurationCollection;
  @Input() base = 0;
  @Input() companionProf: number;
  @Input() characterProf: number;
  @Input() companionModifier: CompanionModifier;

  profValue = 0;
  total = 0;
  abilityScore: MonsterAbilityScore = new MonsterAbilityScore();
  eventSub: Subscription;

  constructor(
    private companionService: CompanionService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.updateProfValue();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.MonsterChanged) {
        this.updateTotal();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  useCharactersProfChange(event: MatCheckboxChange): void {
    this.companionModifier.includeCharactersProf = event.checked;
    this.updateProfValue();
  }

  private updateProfValue(): void {
    this.profValue = this.companionModifier.includeCharactersProf ? this.characterProf + this.companionProf : this.companionProf;
    this.updateTotal();
  }

  miscChange(input): void {
    this.companionModifier.misc = parseInt(input.value, 10);
    this.updateTotal();
  }

  private updateTotal(): void {
    this.total = this.base + this.companionModifier.misc + this.profValue;
  }

  includeCharactersProfChange(event: MatCheckboxChange): void {
    this.companionModifier.includeCharactersProf = event.checked;
    this.updateProfValue();
  }
}
