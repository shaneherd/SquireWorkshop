import { Injectable } from '@angular/core';
import {Tag} from '../../shared/models/tag';
import * as _ from 'lodash';
import {BarTagConfiguration} from '../../shared/models/bar-tag-configuration';

@Injectable({
  providedIn: 'root'
})
export class BarTagService {

  constructor() { }

  initializeTags(activeTags: Tag[], allTags: Tag[]): BarTagConfiguration[] {
    const collection: BarTagConfiguration[] = [];
    if (allTags != null) {
      allTags.forEach((tag: Tag) => {
        const config = new BarTagConfiguration();
        config.tag = tag;
        config.active = _.findIndex(activeTags, function(_tag) { return _tag.id === tag.id }) > -1;
        config.color = config.active ? tag.color : 'transparent';
        collection.push(config);
      });
    } else {
      activeTags.forEach((tag: Tag) => {
        const config = new BarTagConfiguration();
        config.tag = tag;
        config.active = true;
        config.color = tag.color;
        collection.push(config);
      });
    }

    return collection;
  }
}
