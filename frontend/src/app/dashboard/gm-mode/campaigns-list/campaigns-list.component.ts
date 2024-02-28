import {Component, OnDestroy, OnInit} from '@angular/core';
import {Filters} from '../../../core/components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {CampaignService} from '../../../core/services/campaign.service';

@Component({
  selector: 'app-campaigns-list',
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.scss']
})
export class CampaignsListComponent implements OnInit, OnDestroy {
  loading = true;
  filters: Filters;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  queryParamsSub: Subscription;

  constructor(
    public campaignService: CampaignService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.filters = new Filters();

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
        if (this.isPublic) {
          this.listSource = ListSource.PUBLIC_CONTENT;
        } else if (this.isShared) {
          this.listSource = ListSource.PRIVATE_CONTENT;
        } else {
          this.listSource = ListSource.MY_STUFF;
        }
      });
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
  }
}
