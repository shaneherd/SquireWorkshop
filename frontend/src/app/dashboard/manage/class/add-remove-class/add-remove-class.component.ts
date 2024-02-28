import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {CharacterClass} from '../../../../shared/models/characteristics/character-class';
import {CharacterClassService} from '../../../../core/services/characteristics/character-class.service';

@Component({
  selector: 'app-add-remove-class',
  templateUrl: './add-remove-class.component.html',
  styleUrls: ['./add-remove-class.component.scss']
})
export class AddRemoveClassComponent implements OnInit {
  @Input() characterClass: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingCharacterClass: CharacterClass = null;

  constructor(
    private characterClassService: CharacterClassService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.characterClassService.getClass(this.characterClass.id).then((characterClass: CharacterClass) => {
      this.viewingCharacterClass = characterClass;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.characterClass);
  }
}
