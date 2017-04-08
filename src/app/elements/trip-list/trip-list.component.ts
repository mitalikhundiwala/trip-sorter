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
    }
  }

  get trips(): Trip[] {
    return this._trips;
  }

  constructor() { }

  ngOnInit() {
  }

}
