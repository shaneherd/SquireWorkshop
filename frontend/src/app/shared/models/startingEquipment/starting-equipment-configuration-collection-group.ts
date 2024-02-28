import {StartingEquipmentConfigurationCollectionItem} from './starting-equipment-configuration-collection-item';

export class StartingEquipmentConfigurationCollectionGroup {
  id = '0';
  groupNumber = 1;
  numToChoose = 1;
  items: StartingEquipmentConfigurationCollectionItem[] = [];
  parent: StartingEquipmentConfigurationCollectionGroup = null;
  originalParent: StartingEquipmentConfigurationCollectionGroup = null;
  groups: StartingEquipmentConfigurationCollectionGroup[] = [];
  inherited = false;
}
