import {EntityType} from './entity-type.enum';

export class Entity {
  entityType: EntityType;
  id = '0';
  name = '';
  object: Object = null;

  constructor(entityType: EntityType, id: string, name: string, object: Object) {
    this.entityType = entityType;
    this.id = id;
    this.name = name;
    this.object = object;
  }
}
