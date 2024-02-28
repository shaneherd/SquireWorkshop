import {Component, Input, OnInit} from '@angular/core';
import {CreatureSpellSlot} from '../../../../shared/models/creatures/creature-spell-slot';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from '../../../../core/services/creatures/creature.service';

@Component({
  selector: 'app-creature-spell-slot-use-regain',
  templateUrl: './creature-spell-slot-use-regain.component.html',
  styleUrls: ['./creature-spell-slot-use-regain.component.scss']
})
export class CreatureSpellSlotUseRegainComponent implements OnInit {
  @Input() slot: CreatureSpellSlot;
  @Input() collection: CreatureConfigurationCollection;

  max = 0;
  tooltip = '';

  constructor(
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.max = this.creatureService.getMaxSpellSlots(this.slot, this.collection);
    this.tooltip = this.creatureService.getSpellSlotTooltip(this.slot, this.collection);
  }
}
