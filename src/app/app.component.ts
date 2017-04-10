import { BehaviorSubject } from 'rxjs/Rx';
import { DealsService } from './services/deals.service';
import { Deal } from './models/deal';
import { Trip } from './models/trip';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';

import { MdSnackBar } from '@angular/material';
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
  useCar: boolean = true;
  useBus: boolean = true;
  useTrain: boolean = true;
  isFormValid: boolean = false;
  filteredFromCities: any;
  filteredToCities: any;
  matchingTrips: BehaviorSubject<Trip[]> = new BehaviorSubject([]);
  @ViewChild('orderBy')
  orderByCtrl: MdButtonToggleGroup;

  constructor(
    public snackBar: MdSnackBar,
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
    this.isFormValid = false;
    const fromCity: string = this.fromCityCtrl.value;
    const toCity: string = this.toCityCtrl.value;
    const orderBy: string = this.orderByCtrl.value;
    if (!fromCity) {
      this.snackBar.open('Please enter from city.', '', {
        duration: 3000
      });
    } else if (!toCity) {
      this.snackBar.open('Please enter to city.', '', {
        duration: 3000
      });
    } else if (!this.useCar && !this.useBus && !this.useTrain) {
      this.snackBar.open('Please select atleast one transport.', '', {
        duration: 3000
      });
    } else {
      this.isFormValid = true;
      this.matchingTrips.next(this._dealsService.findTrips(fromCity, toCity, orderBy, this.useCar, this.useBus, this.useTrain));
    }
  }
}
