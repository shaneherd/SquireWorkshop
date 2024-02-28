import {Component, Input, OnInit} from '@angular/core';
import {Proficiency} from '../../models/proficiency';

@Component({
  selector: 'app-advantage-display',
  templateUrl: './advantage-display.component.html',
  styleUrls: ['./advantage-display.component.scss']
})
export class AdvantageDisplayComponent implements OnInit {
  @Input() proficiency: Proficiency = new Proficiency();
  @Input() advantage: boolean;
  @Input() disadvantage: boolean;

  constructor() { }

  ngOnInit() {
    if (this.advantage != null) {
      this.proficiency.advantage = this.advantage;
    }
    if (this.disadvantage != null) {
      this.proficiency.disadvantage = this.disadvantage;
    }
  }

}
