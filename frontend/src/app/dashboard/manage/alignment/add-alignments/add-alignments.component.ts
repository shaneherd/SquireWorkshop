import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {MatDialog} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-add-alignments',
  templateUrl: './add-alignments.component.html',
  styleUrls: ['./add-alignments.component.scss']
})
export class AddAlignmentsComponent implements OnInit {
  @Input() alignmentsToIgnore: ListObject[] = [];
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<ListObject[]>();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  loading = false;
  viewingAlignment: MenuItem = null;
  alignments: MenuItem[] = [];

  constructor(
    private dialog: MatDialog,
    private alignmentService: AlignmentService
  ) { }

  ngOnInit() {
    this.initializeAlignments();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  private initializeAlignments(): void {
    this.loading = true;
    this.alignmentService.getAlignments().then((alignments: ListObject[]) => {
      const applicableAlignments: ListObject[] = [];
      alignments.forEach((alignment: ListObject) => {
        if (!this.containsAlignment(alignment)) {
          applicableAlignments.push(alignment);
        }
      });

      this.setAlignments(applicableAlignments);
      this.loading = false;
    });
  }

  private setAlignments(alignments: ListObject[]): void {
    this.alignments = [];
    alignments.forEach((alignment: ListObject) => {
      this.alignments.push(new MenuItem(alignment.id, alignment.name));
    });
  }

  private containsAlignment(alignment: ListObject): boolean {
    if (this.alignmentsToIgnore != null) {
      for (let i = 0; i < this.alignmentsToIgnore.length; i++) {
        const alignmentToIgnore = this.alignmentsToIgnore[i];
        if (alignmentToIgnore.id === alignment.id) {
          return true;
        }
      }
    }
    return false;
  }

  checkedChange(event: MatCheckboxChange, alignment: MenuItem): void {
    alignment.selected = event.checked;
  }

  private getSelectedAlignments(): ListObject[] {
    const selectedAlignments: ListObject[] = [];
    this.alignments.forEach((alignment: MenuItem) => {
      if (alignment.selected) {
        selectedAlignments.push(new ListObject(alignment.id, alignment.name));
      }
    });
    return selectedAlignments;
  }

  continueClick(): void {
    this.continue.emit(this.getSelectedAlignments());
  }

  cancelClick(): void {
    this.close.emit();
  }

  toggleSelected(alignment: MenuItem): void {
    alignment.selected = !alignment.selected;
    this.viewingAlignment = null;
  }

  closeDetails(): void {
    this.viewingAlignment = null;
  }

  alignmentClick(item: MenuItem): void {
    this.viewingAlignment = item;
  }
}
