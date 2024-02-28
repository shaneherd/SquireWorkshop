import {StartingEquipmentType} from './starting-equipment-type.enum';
import {ListObject} from '../list-object';
import {Filters} from '../../../core/components/filters/filters';
import {StartingEquipmentConfigurationCollectionGroup} from './starting-equipment-configuration-collection-group';

export class StartingEquipmentConfigurationCollectionItem {
  group: StartingEquipmentConfigurationCollectionGroup;
  originalGroup: StartingEquipmentConfigurationCollectionGroup;
  itemType: StartingEquipmentType = StartingEquipmentType.ITEM;
  item: ListObject;
  filters: Filters = new Filters();
  quantity = 1;
  inherited = false;
}
