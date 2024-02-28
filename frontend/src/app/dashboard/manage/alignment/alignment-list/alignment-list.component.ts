import {Component} from '@angular/core';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';

@Component({
  selector: 'app-alignment-list',
  templateUrl: './alignment-list.component.html',
  styleUrls: ['./alignment-list.component.scss']
})
export class AlignmentListComponent {
  loading = true;

  constructor(
    public alignmentService: AlignmentService
  ) { }

}
