import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PublishType} from '../../models/publish-type.enum';
import {PublishRequest} from '../../models/publish-request';
import {PublishDetails} from '../../models/publish-details';

@Component({
  selector: 'app-share-configuration',
  templateUrl: './share-configuration.component.html',
  styleUrls: ['./share-configuration.component.scss']
})
export class ShareConfigurationComponent {
  @Input() publishDetails = new PublishDetails();
  @Output() save = new EventEmitter<PublishRequest>();
  @Output() close = new EventEmitter();

  loading = false;

  constructor() { }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    this.loading = true;
    const request = new PublishRequest();
    request.publishType = this.publishDetails.published ? PublishType.UN_PUBLISH : PublishType.PUBLIC;
    this.save.emit(request);
  }

}
