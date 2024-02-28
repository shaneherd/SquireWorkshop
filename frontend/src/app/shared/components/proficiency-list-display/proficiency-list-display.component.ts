import {Component, Input, OnInit} from '@angular/core';
import {ListProficiency} from '../../models/list-proficiency';

@Component({
  selector: 'app-proficiency-list-display',
  templateUrl: './proficiency-list-display.component.html',
  styleUrls: ['./proficiency-list-display.component.scss']
})
export class ProficiencyListDisplayComponent implements OnInit {
  @Input() proficiencies: ListProficiency[];
  @Input() label: string;
  @Input() displayNone = true;

  hasProficiencies = false;

  constructor() { }

  ngOnInit() {
    this.initialize();
  }

  private initialize(): boolean {
    for (let i = 0; i < this.proficiencies.length; i++) {
      const prof: ListProficiency = this.proficiencies[i];
      if (prof.proficient) {
        this.hasProficiencies = true;
        return;
      }

      if (prof.childrenProficiencies != null) {
        for (let j = 0; j < prof.childrenProficiencies.length; j++) {
          const child: ListProficiency = prof.childrenProficiencies[j];
          if (child.proficient) {
            this.hasProficiencies = true;
            return;
          }
        }
      }
    }
    return false;
  }

}
