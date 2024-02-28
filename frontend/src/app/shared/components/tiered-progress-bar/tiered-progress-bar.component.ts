import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-tiered-progress-bar',
  templateUrl: './tiered-progress-bar.component.html',
  styleUrls: ['./tiered-progress-bar.component.scss']
})
export class TieredProgressBarComponent implements OnInit, OnChanges {
  @Input() value: number;
  @Input() max: number;
  @Input() tier1 = 0;
  @Input() tier2 = 0;
  @Input() tier3 = 0;
  @Input() ascending = false;
  @Input() tooltipPercentage = true;

  progress = 0;
  tooltip = '';
  level = 0;
  tier1Percent = 0;
  tier2Percent = 33;
  tier3Percent = 66;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeTiers();
    this.updateProgress();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'value' || propName === 'ascending') {
          this.updateProgress();
        } else if (propName === 'max'
          || propName === 'tier1'
          || propName === 'tier2'
          || propName === 'tier3') {
          this.initializeTiers();
          this.updateProgress();
        }
      }
    }
  }

  private initializeTiers(): void {
    if (this.tier1 !== 0) {
      this.tier1Percent = this.tier1 / this.max * 100;
    } else {
      this.tier1Percent = 0;
    }
    if (this.tier2 !== 0) {
      this.tier2Percent = this.tier2 / this.max * 100;
    } else {
      this.tier2Percent = 33;
    }
    if (this.tier3 !== 0) {
      this.tier3Percent = this.tier3 / this.max * 100;
    } else {
      this.tier3Percent = 66;
    }
  }

  private updateProgress(): void {
    this.progress = this.value / this.max * 100;
    if (this.progress > 100) {
      this.progress = 100;
    }
    const percent = this.progress.toFixed(2);
    if (this.tooltipPercentage) {
      this.tooltip = this.translate.instant('PercentValue', {percent: percent});
    } else {
      this.tooltip = `${this.value} / ${this.max}`;
    }
    this.updateLevel();
  }

  private updateLevel(): void {
    if (this.ascending) {
      if (this.progress >= this.tier3Percent) {
        this.level = 3;
      } else if (this.progress >= this.tier2Percent) {
        this.level = 2;
      } else if (this.progress >= this.tier1Percent) {
        this.level = 1;
      } else {
        this.level = 0;
      }
    } else {
      if (this.progress <= this.tier2Percent) {
        this.level = 3;
      } else if (this.progress <= this.tier3Percent) {
        this.level = 2;
      } else if (this.progress <= 100) {
        this.level = 1;
      } else {
        this.level = 0;
      }
    }
  }
}
