import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {BackgroundTrait} from '../../../../shared/models/characteristics/background-trait';
import {BackgroundTraitType} from '../../../../shared/models/characteristics/background-trait-type.enum';
import {SafeUrl} from '@angular/platform-browser';
import {ImageService} from '../../../../core/services/image.service';
import {SquireImage} from '../../../../shared/models/squire-image';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UserSubscriptionType} from '../../../../shared/models/user-subscription-type.enum';
import {UserService} from '../../../../core/services/user.service';

@Component({
  selector: 'app-character-characteristics',
  templateUrl: './character-characteristics.component.html',
  styleUrls: ['./character-characteristics.component.scss']
})
export class CharacterCharacteristicsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;

  variations: BackgroundTrait[] = [];
  personalities: BackgroundTrait[] = [];
  ideals: BackgroundTrait[] = [];
  bonds: BackgroundTrait[] = [];
  flaws: BackgroundTrait[] = [];

  hasVariation = false;
  hasPersonality = false;
  hasIdeal = false;
  hasBond = false;
  hasFlaw = false;

  sanitizedImage: SafeUrl = null;
  queryParamsSub: Subscription;
  userSub: Subscription;
  isPublic = false;
  isShared = false;
  isPro = false;

  editingImage = false;

  constructor(
    private route: ActivatedRoute,
    private imageService: ImageService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.variations = [];
    this.personalities = [];
    this.ideals = [];
    this.bonds = [];
    this.flaws = [];
    if (this.playerCharacter.characterBackground != null) {
      this.playerCharacter.characterBackground.chosenTraits.forEach((trait: BackgroundTrait) => {
        switch (trait.backgroundTraitType) {
          case BackgroundTraitType.VARIATION:
            this.variations.push(trait);
            break;
          case BackgroundTraitType.PERSONALITY:
            this.personalities.push(trait);
            break;
          case BackgroundTraitType.IDEAL:
            this.ideals.push(trait);
            break;
          case BackgroundTraitType.BOND:
            this.bonds.push(trait);
            break;
          case BackgroundTraitType.FLAW:
            this.flaws.push(trait);
            break;
        }
      });
    }

    this.hasVariation = this.isHasVariation();
    this.hasPersonality = this.isHasPersonality();
    this.hasIdeal = this.isHasIdeal();
    this.hasBond = this.isHasBond();
    this.hasFlaw = this.isHasFlaw();

    this.sanitizedImage = this.imageService.sanitizeImage(this.playerCharacter.image);

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
      });

    this.userSub = this.userService.userSubject.subscribe(async user => {
      this.isPro = user != null && user.userSubscription.type !== UserSubscriptionType.FREE;
    });
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  editImage(): void {
    if (!this.isPublic && !this.isShared) {
      this.editingImage = true;
    }
  }

  saveImage(image: SquireImage): void {
      this.sanitizedImage = this.imageService.sanitizeImage(image);
      this.editingImage = false;
  }

  deleteImage(): void {
    this.sanitizedImage = null;
    this.editingImage = false;
  }

  closeImage(): void {
    this.editingImage = false;
  }

  private isHasVariation(): boolean {
    if (this.playerCharacter.characterBackground.customVariation.length > 0) {
      return true;
    }
    return this.hasTraitType(BackgroundTraitType.VARIATION);
  }

  private isHasPersonality(): boolean {
    if (this.playerCharacter.characterBackground.customPersonality.length > 0) {
      return true;
    }
    return this.hasTraitType(BackgroundTraitType.PERSONALITY);
  }

  private isHasIdeal(): boolean {
    if (this.playerCharacter.characterBackground.customIdeal.length > 0) {
      return true;
    }
    return this.hasTraitType(BackgroundTraitType.IDEAL);
  }

  private isHasBond(): boolean {
    if (this.playerCharacter.characterBackground.customBond.length > 0) {
      return true;
    }
    return this.hasTraitType(BackgroundTraitType.BOND);
  }

  private isHasFlaw(): boolean {
    if (this.playerCharacter.characterBackground.customFlaw.length > 0) {
      return true;
    }
    return this.hasTraitType(BackgroundTraitType.FLAW);
  }

  private hasTraitType(backgroundTraitType: BackgroundTraitType): boolean {
    for (let i = 0; i < this.playerCharacter.characterBackground.chosenTraits.length; i++) {
      if (this.playerCharacter.characterBackground.chosenTraits[i].backgroundTraitType === backgroundTraitType) {
        return true;
      }
    }
    return false;
  }

}
