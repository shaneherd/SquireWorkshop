import {CharacterPageType} from './character-page-type.enum';

export class CharacterPage {
  characterPageType: CharacterPageType;
  order = 0;
  visible = true;

  constructor(characterPageType: CharacterPageType, order: number, visible: boolean = true) {
    this.characterPageType = characterPageType;
    this.order = order;
    this.visible = visible;
  }
}
