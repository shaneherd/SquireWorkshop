export class YesNoDialogData {
  title: string;
  message: string;
  cancelable = false;
  yes: () => void;
  no: () => void;
  cancel: () => void;
}
