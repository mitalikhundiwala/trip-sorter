import * as _ from 'underscore';
import { Trip } from '../../models/trip';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit {

  private _trips: Trip[];
  @Input() set trips(value: Trip[]) {
    if (value) {
      this._trips = value;
      this._primaryTrip = _.first(this.trips);
      this._additionalTrips = _.rest(this.trips)
    }
  }

  get trips(): Trip[] {
    return this._trips;
  }

  private _primaryTrip: Trip;
  get primaryTrip(): Trip {
    return this._primaryTrip;
  }

  private _additionalTrips: Trip[];
  get additionalTrips(): Trip[] {
    return this._additionalTrips;
  }

  constructor() { }

  ngOnInit() {
  }

}
