import * as _ from 'lodash';

export class SlideInHeader {
  name: string;
  customHeaderColor: string;
  event: string;
  closeable: boolean;
  configurable: boolean;
  disabled = false;
  close: any;
  configure: any;
  confirmClose: any;
  closeOnClick: boolean;
  showBack: boolean;
  showShare: boolean;
  shareDisabled: boolean;
  backClick: () => void;
  shareClick: () => void;

  constructor(name: string, closeable: boolean, close: any, configurable = false, configure = null, closeOnClick = true, showBack = false, showShare = false, shareDisabled = false) {
    this.name = name;
    this.event = _.uniqueId();
    this.closeable = closeable;
    this.close = close;
    this.configurable = configurable;
    this.configure = configure;
    this.closeOnClick = closeOnClick;
    this.showBack = showBack;
    this.showShare = showShare;
    this.shareDisabled = shareDisabled;
  }
}
