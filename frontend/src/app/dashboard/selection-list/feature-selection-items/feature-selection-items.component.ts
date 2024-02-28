import {Component, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {FeatureMenuItem} from '../features-selection-list/features-selection-list.component';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-feature-selection-items',
  templateUrl: './feature-selection-items.component.html',
  styleUrls: ['./feature-selection-items.component.scss']
})
export class FeatureSelectionItemsComponent {
  @Input() features: FeatureMenuItem[] = [];
  @Input() playerCharacter: PlayerCharacter;
  @Input() loading = false;
  @Input() allowMultiSelect = true;
  @Output() featureClick = new EventEmitter();
  @Output() checkChange = new EventEmitter();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  toggleSelected(feature: FeatureMenuItem): void {
    if (!feature.selected && !this.allowMultiSelect) {
      this.features.forEach((menuItem: FeatureMenuItem) => {
        menuItem.selected = false;
      });
    }
    feature.selected = !feature.selected;
    this.checkChange.emit(feature);
  }

  onFeatureClick(feature: FeatureMenuItem): void {
    this.featureClick.emit(feature);
  }

}
