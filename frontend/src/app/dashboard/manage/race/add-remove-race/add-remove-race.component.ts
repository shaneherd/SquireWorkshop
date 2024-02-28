import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {Race} from '../../../../shared/models/characteristics/race';
import {RaceService} from '../../../../core/services/characteristics/race.service';

@Component({
  selector: 'app-add-remove-race',
  templateUrl: './add-remove-race.component.html',
  styleUrls: ['./add-remove-race.component.scss']
})
export class AddRemoveRaceComponent implements OnInit {
  @Input() race: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingRace: Race = null;

  constructor(
    private raceService: RaceService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.raceService.getRace(this.race.id).then((race: Race) => {
      this.viewingRace = race;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.race);
  }
}
