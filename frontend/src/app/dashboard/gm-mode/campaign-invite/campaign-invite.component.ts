import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {Campaign} from '../../../shared/models/campaigns/campaign';
import {CampaignService} from '../../../core/services/campaign.service';
import {NotificationService} from '../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-campaign-invite',
  templateUrl: './campaign-invite.component.html',
  styleUrls: ['./campaign-invite.component.scss']
})
export class CampaignInviteComponent {
  @Input() campaign: Campaign;
  @Output() close = new EventEmitter();

  eventSub: Subscription;

  constructor(
    private campaignService: CampaignService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  closeDetails(): void {
    this.close.emit();
  }

  refreshToken(): void {
    this.campaignService.refreshToken(this.campaign.id).then((token: string) => {
      this.campaign.token = token;
    }, () => {
      this.notificationService.error(this.translate.instant('Campaign.Invite.RefreshError'))
    });
  }

  copyToken(tokenElement): void {
    const textArea = document.createElement('textarea');
    textArea.value = tokenElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
}
