import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonAction} from '../../../shared/models/button/button-action';
import {TranslateService} from '@ngx-translate/core';
import {CampaignCharacter} from '../../../shared/models/campaigns/campaign-character';

@Component({
  selector: 'app-campaign-character-slide-in',
  templateUrl: './campaign-character-slide-in.component.html',
  styleUrls: ['./campaign-character-slide-in.component.scss']
})
export class CampaignCharacterSlideInComponent implements OnInit {
  @Input() campaignCharacter: CampaignCharacter;
  @Output() view = new EventEmitter<boolean>();
  @Output() close = new EventEmitter();
  @Output() remove = new EventEmitter<CampaignCharacter>();

  primaryActions: ButtonAction[] = [];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeActions();
  }

  private initializeActions(): void {
    this.primaryActions = [];
    const self = this;
    const viewBtn = new ButtonAction('VIEW', self.translate.instant('Campaign.Character.View'), () => {
      self.viewClick(false);
    });
    this.primaryActions.push(viewBtn);

    const newTabBtn = new ButtonAction('NEW_TAB', self.translate.instant('Campaign.Character.NewTab'), () => {
      self.viewClick(true);
    });
    this.primaryActions.push(newTabBtn);
  }

  viewClick(newTab: boolean): void {
    this.view.emit(newTab);
  }

  removeClick(): void {
    this.remove.emit(this.campaignCharacter);
  }

  closeDetails(): void {
    this.close.emit();
  }

}
