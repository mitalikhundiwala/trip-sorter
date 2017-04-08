import { BehaviorSubject } from 'rxjs/Rx';
import { DealsService } from './services/deals.service';
import { Deal } from './models/deal';
import { Trip } from './models/trip';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';

import { MdButtonToggleGroup } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  deals: Deal[] = [];
  fromCityCtrl: FormControl;
  toCityCtrl: FormControl;
  filteredFromCities: any;
  filteredToCities: any;
  matchingTrips: BehaviorSubject<Trip[]> = new BehaviorSubject([]);
  @ViewChild('orderBy')
  orderByCtrl: MdButtonToggleGroup;

  constructor(
    private _dealsService: DealsService
  ) {
    this._dealsService.fetchDeals()
      .subscribe((deals) => {
        this.deals = deals;
      });
    this.fromCityCtrl = new FormControl();
    this.toCityCtrl = new FormControl();
    this.filteredFromCities = this.fromCityCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterFromCities(name));

    this.filteredToCities = this.toCityCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterToCities(name));
  }

  filterFromCities(value: string) {
    return value ? this._dealsService.departureCities.getValue()
      .filter(input => new RegExp(`^${value}`, 'gi').test(input))
      : this._dealsService.departureCities.getValue();
  }

  filterToCities(value: string) {
    return value ? this._dealsService.arrivalCities.getValue()
      .filter(input => new RegExp(`^${value}`, 'gi').test(input))
      : this._dealsService.arrivalCities.getValue();
  }

  searchTrips() {
    const fromCity: string = this.fromCityCtrl.value;
    const toCity: string = this.toCityCtrl.value;
    const orderBy: string = this.orderByCtrl.value;
    this.matchingTrips.next(this._dealsService.findTrips(fromCity, toCity, orderBy));
  }
}
