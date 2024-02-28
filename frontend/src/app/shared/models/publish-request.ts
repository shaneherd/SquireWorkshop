import {PublishType} from './publish-type.enum';

export class PublishRequest {
  publishType: PublishType = PublishType.PUBLIC;
  users: string[] = [];
}
