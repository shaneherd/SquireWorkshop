import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {DeityCategoryService} from '../../../../core/services/attributes/deity-category.service';
import {DeityCategory} from '../../../../shared/models/attributes/deity-category';

@Component({
  selector: 'app-add-remove-deity-category',
  templateUrl: './add-remove-deity-category.component.html',
  styleUrls: ['./add-remove-deity-category.component.scss']
})
export class AddRemoveDeityCategoryComponent implements OnInit {
  @Input() deityCategory: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingDeityCategory: DeityCategory = null;

  constructor(
    private deityCategoryService: DeityCategoryService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.deityCategoryService.getDeityCategory(this.deityCategory.id).then((deityCategory: DeityCategory) => {
      this.viewingDeityCategory = deityCategory;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.deityCategory);
  }
}
