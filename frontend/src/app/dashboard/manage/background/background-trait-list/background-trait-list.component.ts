import {Component, ElementRef, Input} from '@angular/core';
import {BackgroundTrait} from '../../../../shared/models/characteristics/background-trait';
import {BackgroundTraitType} from '../../../../shared/models/characteristics/background-trait-type.enum';

@Component({
  selector: 'app-background-trait-list',
  templateUrl: './background-trait-list.component.html',
  styleUrls: ['./background-trait-list.component.scss']
})
export class BackgroundTraitListComponent {
  @Input() editing: boolean;
  @Input() label: string;
  @Input() backgroundTraitType: BackgroundTraitType;
  @Input() traits: BackgroundTrait[];
  @Input() parentTraits: BackgroundTrait[];

  constructor(
    private myElement: ElementRef
  ) { }

  deleteTrait(trait: BackgroundTrait): void {
    const index = this.traits.indexOf(trait);
    if (index > -1) {
      this.traits.splice(index, 1);
    }
  }

  addTrait(): void {
    this.traits.push(new BackgroundTrait(this.backgroundTraitType));
    const self = this;
    setTimeout(() => {
      const inputs = self.myElement.nativeElement.getElementsByClassName('background-trait');
      const lastInput = inputs[inputs.length - 1];
      lastInput.children[0].focus();
    });
  }

  hasTraits(): boolean {
    return this.traits.length > 0 || this.parentTraits.length > 0;
  }
}
