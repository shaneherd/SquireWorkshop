import {Component, Input, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../models/creatures/characters/player-character';
import {CharacterSettings} from '../../../models/creatures/characters/character-settings';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ChosenClass} from '../../../models/creatures/characters/chosen-class';

@Component({
  selector: 'app-spellcasting-settings',
  templateUrl: './spellcasting-settings.component.html',
  styleUrls: ['./spellcasting-settings.component.scss']
})
export class SpellcastingSettingsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() settings: CharacterSettings;

  constructor() { }

  ngOnInit() {
    this.initializeSettings();
  }

  private initializeSettings(): void {
    this.settings.spellcasting = _.cloneDeep(this.playerCharacter.characterSettings.spellcasting);
  }

  displayClassSpellcasting(event: MatCheckboxChange): void {
    this.settings.spellcasting.displayClassSpellcasting = event.checked;
  }

  classChange(event: MatCheckboxChange, chosenClass: ChosenClass): void {
    chosenClass.displaySpellcasting = event.checked;
  }

  displayRaceSpellcasting(event: MatCheckboxChange): void {
    this.settings.spellcasting.displayRaceSpellcasting = event.checked;
  }

  displayBackgroundSpellcasting(event: MatCheckboxChange): void {
    this.settings.spellcasting.displayBackgroundSpellcasting = event.checked;
  }

  displayOtherSpellcasting(event: MatCheckboxChange): void {
    this.settings.spellcasting.displayOtherSpellcasting = event.checked;
  }

  displayTags(event: MatCheckboxChange): void {
    this.settings.spellcasting.displayTags = event.checked;
  }

  highlightActive(event: MatCheckboxChange): void {
    this.settings.spellcasting.highlightActive = event.checked;
  }

}
