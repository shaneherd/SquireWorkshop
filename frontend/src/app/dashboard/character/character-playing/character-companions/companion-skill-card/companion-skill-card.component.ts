import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureSkillListProficiency} from '../../../../../shared/models/creatures/creature-skill-list-proficiency';
import {Roll} from '../../../../../shared/models/rolls/roll';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {RollResultDialogData} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';
import {RollResultDialogComponent} from '../../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {DiceService} from '../../../../../core/services/dice.service';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CompanionService} from '../../../../../core/services/creatures/companion.service';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';

@Component({
  selector: 'app-companion-skill-card',
  templateUrl: './companion-skill-card.component.html',
  styleUrls: ['./companion-skill-card.component.scss']
})
export class CompanionSkillCardComponent implements OnInit {
  @Input() companion: Companion;
  @Input() collection: CreatureConfigurationCollection;
  @Input() characterCollection: CreatureConfigurationCollection;
  @Input() skill: CreatureSkillListProficiency;
  @Input() disabled = false;
  @Output() click = new EventEmitter<CreatureSkillListProficiency>();

  skillModifier = 0;
  totalModifier = '';
  fromCharacter = false;

  constructor(
    private dialog: MatDialog,
    private diceService: DiceService,
    private creatureService: CreatureService,
    private companionService: CompanionService,
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  private initialize(): void {
    const characterProf = this.creatureService.getProfModifier(this.characterCollection);
    this.skillModifier = this.companionService.getSkillAbilityModifier(this.skill, this.companion, this.collection, characterProf);
    if (this.companion.includeCharacterSkills) {
      const characterSkill = this.creatureService.getSkill(this.skill.skill.id, this.characterCollection);
      const characterScore = this.creatureService.getSkillAbilityModifier(characterSkill, this.companion, this.characterCollection);
      if (characterScore > this.skillModifier) {
        this.skillModifier = characterScore;
        this.fromCharacter = true;
      }
    }
    this.totalModifier = this.abilityService.convertScoreToString(this.skillModifier);
  }

  skillClick(): void {
    const rollRequest = this.diceService.getStandardRollRequest(
      this.skill.item.name,
      this.skillModifier,
      false,
      false
    );

    this.creatureService.rollStandard(this.companion, rollRequest).then((roll: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.companion, roll);
      this.dialog.open(RollResultDialogComponent, dialogConfig);

      this.click.emit(this.skill);
    });
  }

}
