import {Component, Input, OnInit} from '@angular/core';
import {Proficiency, ProficiencyType} from '../../../../../shared/models/proficiency';
import {Monster} from '../../../../../shared/models/creatures/monsters/monster';
import {ItemProficiency} from '../../../../../shared/models/items/item-proficiency';

@Component({
  selector: 'app-companion-prof-section',
  templateUrl: './companion-prof-section.component.html',
  styleUrls: ['./companion-prof-section.component.scss']
})
export class CompanionProfSectionComponent implements OnInit {
  @Input() label: string;
  @Input() proficiencyType: ProficiencyType;
  @Input() monster: Monster;

  attributeProfs: Proficiency[] = [];
  itemProfs: ItemProficiency[] = [];

  constructor() { }

  ngOnInit() {
    this.initialize();
  }

  private initialize(): void {
    this.monster.attributeProfs.forEach((attributeProf: Proficiency) => {
      if (attributeProf.attribute.proficiencyType === this.proficiencyType) {
        this.attributeProfs.push(attributeProf);
      }
    });
    // this.monster.itemProfs.forEach((itemProficiency: ItemProficiency) => {
    //   if (itemProficiency.item.proficiencyType === this.proficiencyType) {
    //     this.itemProfs.push(itemProficiency);
    //   }
    // });
  }
}
