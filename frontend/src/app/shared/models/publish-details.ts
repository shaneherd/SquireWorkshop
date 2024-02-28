import {PublishType} from './publish-type.enum';

export class PublishDetails {
  published = false;
  publishType: PublishType = PublishType.NONE;
  users: string[] = [];
}
