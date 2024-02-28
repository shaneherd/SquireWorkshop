import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ValidateCharacterIgnoreFeaturesDialogData} from './validate-character-ignore-features-dialog-data';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CharacterValidationWarning} from '../../../shared/models/creatures/characters/character-validation';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../services/events.service';

export class IgnoreFeatureConfiguration {
  ignore = false;
  warning: CharacterValidationWarning;
  message = '';
}

@Component({
  selector: 'app-validate-character-ignore-features-dialog',
  templateUrl: './validate-character-ignore-features-dialog.component.html',
  styleUrls: ['./validate-character-ignore-features-dialog.component.scss']
})
export class ValidateCharacterIgnoreFeaturesDialogComponent implements OnInit, OnDestroy {
  data: ValidateCharacterIgnoreFeaturesDialogData;
  eventSub: Subscription;
  warnings: IgnoreFeatureConfiguration[] = [];
  ignoreUnselectedFeatures = false;
  ignoreUnselectedSpells = false;
  ignoreUnselectedAsi = false;
  hasMissingFeatures = false;
  hasMissingSpells = false;
  hasMissingASI = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: ValidateCharacterIgnoreFeaturesDialogData,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<ValidateCharacterIgnoreFeaturesDialogComponent>,
    private translate: TranslateService
  ) {
    this.data = d;
  }

  ngOnInit() {
    const warnings = [];
    this.data.warnings.forEach((warning: CharacterValidationWarning) => {
      const config = new IgnoreFeatureConfiguration();
      config.warning = warning;
      config.message = this.getWarningMessage(warning);
      warnings.push(config);
      if (warning.missingFeatures || warning.noFeaturesSelected) {
        this.hasMissingFeatures = true;
      }
      if (warning.missingSpells || warning.noSpellsSelected) {
        this.hasMissingSpells = true;
      }
      if (warning.missingASI || warning.missingFeat) {
        this.hasMissingASI = true;
      }
    });
    this.warnings = warnings;
    this.ignoreUnselectedFeatures = this.data.autoIgnoreUnselectedFeatures;
    this.ignoreUnselectedSpells = this.data.autoIgnoreUnselectedSpells;
    this.ignoreUnselectedAsi = this.data.autoIgnoreUnselectedAsi;
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private getWarningMessage(warning: CharacterValidationWarning): string {
    const parts: string[] = [];
    if (warning.noFeaturesSelected) {
      parts.push(this.translate.instant('CharacterValidation.Warning.NoFeaturesSelected'));
    } else if (warning.missingFeatures) {
      parts.push(this.translate.instant('CharacterValidation.Warning.UnselectedFeatures'));
    }
    if (warning.noSpellsSelected) {
      parts.push(this.translate.instant('CharacterValidation.Warning.NoSpellsSelected'));
    } else if (warning.missingSpells) {
      parts.push(this.translate.instant('CharacterValidation.Warning.UnselectedSpells'));
    }
    if (warning.missingASI) {
      parts.push(this.translate.instant('CharacterValidation.Warning.AsiUnassigned'));
    }
    if (warning.missingFeat) {
      parts.push(this.translate.instant('CharacterValidation.Warning.NoFeatSelected'));
    }
    return parts.join('\n');
  }

  ignoreUnselectedFeaturesChange(event: MatCheckboxChange): void {
    this.ignoreUnselectedFeatures = event.checked;
  }

  ignoreUnselectedSpellsChange(event: MatCheckboxChange): void {
    this.ignoreUnselectedSpells = event.checked;
  }

  ignoreUnselectedAsiChange(event: MatCheckboxChange): void {
    this.ignoreUnselectedAsi = event.checked;
  }

  continue(): void {
    this.data.continue(this.ignoreUnselectedFeatures, this.ignoreUnselectedSpells, this.ignoreUnselectedAsi);
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  goToPage(index: number): void {
    this.data.goToPage(index);
    this.dialogRef.close();
  }

}
