import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Companion} from '../../../../../shared/models/creatures/companions/companion';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {SpellConfiguration} from '../../../../../shared/models/characteristics/spell-configuration';
import {Spell} from '../../../../../shared/models/powers/spell';
import {CreatureSpell} from '../../../../../shared/models/creatures/creature-spell';
import {DamageConfigurationCollection} from '../../../../../shared/models/damage-configuration-collection';
import {ModifierConfigurationCollection} from '../../../../../shared/models/modifier-configuration-collection';
import {PowerService} from '../../../../../core/services/powers/power.service';
import {CreatureService} from '../../../../../core/services/creatures/creature.service';
import {PowerModifier} from '../../../../../shared/models/powers/power-modifier';
import {AttackType} from '../../../../../shared/models/attack-type.enum';

@Component({
  selector: 'app-companion-spell-slide-in',
  templateUrl: './companion-spell-slide-in.component.html',
  styleUrls: ['./companion-spell-slide-in.component.scss']
})
export class CompanionSpellSlideInComponent implements OnInit {
  @Input() creatureSpell: CreatureSpell;
  @Input() companion: Companion;
  @Input() collection: CreatureConfigurationCollection;
  @Output() use = new EventEmitter<SpellConfiguration>();
  @Output() close = new EventEmitter();

  loading = false;
  viewingSpell: Spell = null;
  selectedSlot = 0;
  slotsRemaining = -1;
  useDisabled = false;
  damages: DamageConfigurationCollection;
  modifiers: ModifierConfigurationCollection;
  attackModifier: PowerModifier = new PowerModifier();
  saveModifier: PowerModifier = new PowerModifier();

  constructor(
    private cd: ChangeDetectorRef,
    private creatureService: CreatureService,
    private powerService: PowerService,
  ) { }

  ngOnInit() {
    this.initializeSpell();
    this.initializeModifiers();
  }

  private initializeSpell(): void {
    this.powerService.getPower(this.creatureSpell.spell.id).then((spell: Spell) => {
      this.viewingSpell = spell;
      this.loading = false;
    });
  }

  private initializeModifiers(): void {
    const ability = this.creatureService.getAbility(this.companion.monster.spellcastingAbility, this.collection);
    this.attackModifier = this.creatureService.getSpellModifier(ability, this.collection, this.companion.creatureSpellCasting.spellcastingAttack, AttackType.ATTACK, null);
    this.saveModifier = this.creatureService.getSpellModifier(ability, this.collection, this.companion.creatureSpellCasting.spellcastingSave, AttackType.SAVE, null);
  }

  closeClick(): void {
    this.close.emit();
  }

  slotChange(selectedSlot: number): void {
    this.selectedSlot = selectedSlot;
    if (selectedSlot > 0) {
      this.slotsRemaining = this.creatureService.getSpellSlotsForLevel(this.companion, selectedSlot);
    } else {
      this.slotsRemaining = -1;
    }
    this.updateUseDisabled();
    this.cd.detectChanges();
  }

  private updateUseDisabled(): void {
    this.useDisabled = this.slotsRemaining === 0 && !this.creatureSpell.active;
  }

  damageChange(damages: DamageConfigurationCollection): void {
    this.damages = damages;
  }

  modifierChange(modifiers: ModifierConfigurationCollection): void {
    this.modifiers = modifiers;
  }

}
