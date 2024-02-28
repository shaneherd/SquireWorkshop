import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-join-campaign-slide-in',
  templateUrl: './join-campaign-slide-in.component.html',
  styleUrls: ['./join-campaign-slide-in.component.scss']
})
export class JoinCampaignSlideInComponent {
  @Input() playerCharacter: PlayerCharacter;
  @Output() join = new EventEmitter();
  @Output() close = new EventEmitter();

  token = '';

  constructor(
    private characterService: CharacterService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  joinClick(): void {
    this.characterService.joinCampaign(this.playerCharacter.id, this.token).then(() => {
      this.notificationService.success(this.translate.instant('Campaign.SuccessJoining'));
      this.join.emit();
    }, () => {
      this.notificationService.error(this.translate.instant('Campaign.ErrorJoining'));
    });
  }

  closeClick(): void {
    this.close.emit();
  }
}
