import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {SlideInHeader} from '../../models/slideInHeader.model';
import {ListObject} from '../../models/list-object';
import {DetailsValidator} from '../../../dashboard/details/details/details-validator';
import {ButtonAction} from '../../models/button/button-action';
import {ButtonActionGroup} from '../../models/button/button-action-group';
import {MatDialog} from '@angular/material/dialog';
import {EventsService} from '../../../core/services/events.service';
import {ResolutionService} from '../../../core/services/resolution.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnChanges, OnDestroy {
  isDesktop = true;
  slideInHeader: SlideInHeader;
  @Input() headerName = '';
  @Input() customHeaderColor = '';
  @Input() loading = false;
  @Input() fixed = false;
  @Input() extraLarge = false;
  @Input() listObject: ListObject = null;
  @Input() configurable = false;
  @Input() slideLeft = true;
  @Output() configure = new EventEmitter();

  @Input() primaryLabel = '';
  @Input() primaryDisabled = false;
  @Input() primaryCloseOnClick = true;
  @Input() primaryExtraCloseOnClick: boolean;
  @Input() primaryConfirmationTitle = '';
  @Input() primaryConfirmationMessage = '';
  @Input() primaryValidator: DetailsValidator;
  @Input() primaryActions: ButtonAction[] = [];
  @Input() primaryGroups: ButtonActionGroup[] = [];

  @Input() secondaryLabel = '';
  @Input() secondaryDisabled = false;
  @Input() secondaryCloseOnClick = true;
  @Input() secondaryExtraCloseOnClick: boolean;
  @Input() secondaryConfirmationTitle = '';
  @Input() secondaryConfirmationMessage = '';
  @Input() secondaryValidator: DetailsValidator;
  @Input() secondaryActions: ButtonAction[] = [];
  @Input() secondaryGroups: ButtonActionGroup[] = [];

  @Input() tertiaryLabel = '';
  @Input() tertiaryDisabled = false;
  @Input() tertiaryCloseOnClick = true;
  @Input() tertiaryExtraCloseOnClick: boolean;
  @Input() tertiaryConfirmationTitle = '';
  @Input() tertiaryConfirmationMessage = '';
  @Input() tertiaryValidator: DetailsValidator;
  @Input() tertiaryActions: ButtonAction[] = [];
  @Input() tertiaryGroups: ButtonActionGroup[] = [];

  @Input() closeOnClick = true;
  @Output() close = new EventEmitter();
  @Output() primary = new EventEmitter<ButtonAction>();
  @Output() primaryExtra: EventEmitter<ButtonAction>;
  @Output() secondary = new EventEmitter<ButtonAction>();
  @Output() secondaryExtra: EventEmitter<ButtonAction>;
  @Output() tertiary = new EventEmitter<ButtonAction>();
  @Output() tertiaryExtra: EventEmitter<ButtonAction>;

  resSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    private resolutionService: ResolutionService
  ) { }

  ngOnInit() {
    if (this.primaryExtraCloseOnClick == null) {
      this.primaryExtraCloseOnClick = this.primaryCloseOnClick;
    }
    if (this.primaryExtra == null) {
      this.primaryExtra = this.primary;
    }
    if (this.secondaryExtraCloseOnClick == null) {
      this.secondaryExtraCloseOnClick = this.secondaryCloseOnClick;
    }
    if (this.secondaryExtra == null) {
      this.secondaryExtra = this.secondary;
    }
    if (this.tertiaryExtraCloseOnClick == null) {
      this.tertiaryExtraCloseOnClick = this.tertiaryCloseOnClick;
    }
    if (this.tertiaryExtra == null) {
      this.tertiaryExtra = this.tertiary;
    }
    this.resSub = this.resolutionService.width.subscribe(width => {
      this.isDesktop = ResolutionService.isDesktop(width);
    });

    const self = this;
    this.slideInHeader = new SlideInHeader(this.headerName, true, () => {
      self.close.emit();
    }, this.configurable, () => {
      self.configure.emit();
    });
    this.slideInHeader.closeOnClick = this.closeOnClick;
    this.slideInHeader.customHeaderColor = this.customHeaderColor;
  }

  ngOnDestroy() {
    this.resSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.slideInHeader == null) {
      return;
    }
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'headerName') {
          this.slideInHeader.name = changes[propName].currentValue;
        }
      }
    }
  }

  primaryClick(action: ButtonAction): void {
    this.handleClick(action, this.primary, this.primaryCloseOnClick);
  }

  primaryExtraClick(action: ButtonAction): void {
    this.handleClick(action, this.primaryExtra, this.primaryExtraCloseOnClick);
  }

  secondaryClick(action: ButtonAction): void {
    this.handleClick(action, this.secondary, this.secondaryCloseOnClick);
  }

  secondaryExtraClick(action: ButtonAction): void {
    this.handleClick(action, this.secondaryExtra, this.secondaryExtraCloseOnClick);
  }

  tertiaryClick(action: ButtonAction): void {
    this.handleClick(action, this.tertiary, this.tertiaryCloseOnClick);
  }

  tertiaryExtraClick(action: ButtonAction): void {
    this.handleClick(action, this.tertiaryExtra, this.tertiaryExtraCloseOnClick);
  }

  private handleClick(action: ButtonAction, confirm: EventEmitter<ButtonAction>, closeOnClick: boolean): void {
    if (closeOnClick) {
      this.eventsService.dispatchEvent(this.slideInHeader.event);
      setTimeout(() => {
        confirm.emit(action);
      }, 250);
    } else {
      confirm.emit(action);
    }
  }
}
