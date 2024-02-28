import {ImportItemConfiguration} from '../../../shared/imports/import-item';

export class ImportResultsDialogData {
  title: string;
  message: string;
  configs: ImportItemConfiguration[] = [];
  cancel: () => void;
  done: () => void;
}
