import {Component, Input, OnInit} from '@angular/core';
import {Characteristics} from '../../../shared/models/creatures/characters/characteristics';
import {DeityService} from '../../../core/services/attributes/deity.service';
import {ListObject} from '../../../shared/models/list-object';
import {AlignmentService} from '../../../core/services/attributes/alignment.service';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {Gender} from '../../../shared/models/creatures/characters/gender.enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-character-edit-characteristics',
  templateUrl: './character-edit-characteristics.component.html',
  styleUrls: ['./character-edit-characteristics.component.scss']
})
export class CharacterEditCharacteristicsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() characteristics: Characteristics;

  deities: ListObject[] = [];
  alignments: ListObject[] = [];
  selectedAlignment: ListObject = null;
  genders: Gender[] = [];

  constructor(
    private alignmentService: AlignmentService,
    private deityService: DeityService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeAlignments();
    this.initializeDeities();
    this.initializeGenders();
  }

  private initializeAlignments(): void {
    this.alignments = [];
    this.alignmentService.getAlignments().then((alignments: ListObject[]) => {
      alignments.unshift(new ListObject('0', this.translate.instant('Unaligned')));
      this.alignments = alignments;
      this.initializeSelectedAlignment();
    });
  }

  private initializeSelectedAlignment(): void {
    if (this.playerCharacter.alignment != null) {
      for (let i = 0; i < this.alignments.length; i++) {
        const alignment = this.alignments[i];
        if (alignment.id === this.playerCharacter.alignment.id) {
          this.alignmentChange(alignment);
          return;
        }
      }
    }
    if (this.alignments.length > 0) {
      this.alignmentChange(this.alignments[0]);
    }
  }

  alignmentChange(alignment: ListObject): void {
    this.selectedAlignment = alignment;
    if (alignment.id === '0') {
      this.playerCharacter.alignment = null;
    } else {
      this.playerCharacter.alignment = alignment;
    }
  }

  private initializeDeities(): void {
    this.deities = [];
    this.deityService.getDeities().then((deities: ListObject[]) => {
      const none = new ListObject('0', this.translate.instant('None'));
      deities = deities.slice(0);
      deities.unshift(none);
      this.deities = deities;
      this.initializeSelectedDeity();
    });
  }

  private initializeSelectedDeity(): void {
    if (this.characteristics.deity != null) {
      for (let i = 0; i < this.deities.length; i++) {
        const deity = this.deities[i];
        if (deity.id === this.characteristics.deity .id) {
          this.characteristics.deity = deity;
          return;
        }
      }
    }
    if (this.deities.length > 0) {
      this.characteristics.deity = this.deities[0];
    }
  }

  deityChange(deity: ListObject): void {
    this.characteristics.deity = deity;
  }

  private initializeGenders(): void {
    this.genders = [];
    this.genders.push(Gender.NEUTRAL);
    this.genders.push(Gender.MALE);
    this.genders.push(Gender.FEMALE);
  }

  genderChange(gender: Gender): void {
    this.characteristics.gender = gender;
  }


}
