import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CompanionScoreModifier} from '../../../../../shared/models/creatures/companions/companion-score-modifier';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {CompanionService} from '../../../../../core/services/creatures/companion.service';
import {MonsterAbilityScore} from '../../../../../shared/models/creatures/monsters/monster';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {EventsService} from '../../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {EVENTS} from '../../../../../constants';

@Component({
  selector: 'app-companion-ability-score-configuration',
  templateUrl: './companion-ability-score-configuration.component.html',
  styleUrls: ['./companion-ability-score-configuration.component.scss']
})
export class CompanionAbilityScoreConfigurationComponent implements OnInit, OnDestroy {
  @Input() companion: Companion;
  @Input() companionCollection: CreatureConfigurationCollection;
  @Input() characterCollection: CreatureConfigurationCollection;
  @Input() characterProf: number;
  @Input() companionScoreModifier: CompanionScoreModifier;

  base = 0;
  profValue = 0;
  total = 0;
  abilityScore: MonsterAbilityScore = new MonsterAbilityScore();
  characterScore = 0;
  eventSub: Subscription;

  constructor(
    private companionService: CompanionService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeBase();
    const ability = this.creatureService.getAbility(this.companionScoreModifier.abilityId, this.characterCollection);
    this.characterScore = this.creatureService.getAbilityScore(ability, this.characterCollection);
    this.updateProfValue();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.MonsterChanged) {
        this.initializeBase();
        this.updateTotal();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeBase(): void {
    this.abilityScore = this.companionService.getMonsterAbilityScore(this.companionScoreModifier.abilityId, this.companion)
    this.base = this.abilityScore.value;
  }

  useCharactersProfChange(event: MatCheckboxChange): void {
    this.companionScoreModifier.includeCharactersProf = event.checked;
    this.updateProfValue();
  }

  private updateProfValue(): void {
    this.profValue = this.companionScoreModifier.includeCharactersProf ? this.characterProf : 0;
    this.updateTotal();
  }

  miscChange(input): void {
    this.companionScoreModifier.misc = parseInt(input.value, 10);
    this.updateTotal();
  }

  private updateTotal(): void {
    this.total = this.base + this.companionScoreModifier.misc + this.profValue;
  }

  useCharactersScoreChange(event: MatCheckboxChange): void {
    this.companionScoreModifier.useCharactersScore = event.checked;
    this.updateProfValue();
  }

}
