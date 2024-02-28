import {ManageListItem, ManageService} from '../../../shared/components/manage-list/manage-list.component';
import {ExportDetailsService} from '../../services/export/export.service';

export class ManageResultsDialogData {
  items: ManageListItem[] = [];
  service: ManageService;
  exportService: ExportDetailsService;
  cancel: () => void;
  done: () => void;
  manageType: ManageType;
  exportType = '';
  proExportOnly = false;
  preloadedItem: object = null;
}

export enum ManageType {
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  EXPORT = 'EXPORT'
}
