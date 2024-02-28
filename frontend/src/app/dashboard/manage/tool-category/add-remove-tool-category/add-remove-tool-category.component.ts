import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ToolCategoryService} from '../../../../core/services/attributes/tool-category.service';
import {ToolCategory} from '../../../../shared/models/attributes/tool-category';

@Component({
  selector: 'app-add-remove-tool-category',
  templateUrl: './add-remove-tool-category.component.html',
  styleUrls: ['./add-remove-tool-category.component.scss']
})
export class AddRemoveToolCategoryComponent implements OnInit {
  @Input() toolCategory: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingToolCategory: ToolCategory = null;

  constructor(
    private toolCategoryService: ToolCategoryService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.toolCategoryService.getToolCategory(this.toolCategory.id).then((toolCategory: ToolCategory) => {
      this.viewingToolCategory = toolCategory;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.toolCategory);
  }
}
