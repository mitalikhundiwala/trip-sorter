import { BehaviorSubject } from 'rxjs/Rx';
import * as _ from 'underscore';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

import { Deal } from '../models/deal';
import { Trip } from '../models/trip';
import { DealAdapter } from './adapters/deal.adapter';

@Injectable()
export class DealsService {
    private _url: string = `${environment.SERVICE_BASE_URL}`;
    private _headers: Headers = new Headers();

    private _deals: BehaviorSubject<Deal[]> = new BehaviorSubject([]);
    private _currency: BehaviorSubject<string> = new BehaviorSubject('');
    private _departureCities: BehaviorSubject<string[]> = new BehaviorSubject([]);
    private _arrivalCities: BehaviorSubject<string[]> = new BehaviorSubject([]);

    get deals(): BehaviorSubject<Deal[]> {
        return this._deals;
    }

    get departureCities(): BehaviorSubject<string[]> {
        return this._departureCities;
    }

    get arrivalCities(): BehaviorSubject<string[]> {
        return this._arrivalCities;
    }

    get currency(): BehaviorSubject<string> {
        return this._currency;
    }

    constructor(
        private _http: Http
    ) {
        this._headers.append('Content-Type', 'application/json');
    }

    fetchDeals(): Observable<Deal[]> {
        let promise: Promise<Deal[]> = new Promise((resolve, reject) => {
            return this._http.get(this._url + 'assets/data/response.json').map(res => res.json())
                .subscribe((data: any) => {
                    let deals: Deal[] = [];
                    if (data) {
                        if (data.deals) {
                            deals = (<Object[]>data.deals).map((deal: any) => {
                                return DealAdapter.parseResponse(deal);
                            });
                            const departureCities: string[] = _.chain(deals).map((currentDeal: Deal) => {
                                return currentDeal.departure;
                            }).uniq().value();
                            const arrivalCities: string[] = _.chain(deals).map((currentDeal: Deal) => {
                                return currentDeal.arrival;
                            }).uniq().value();
                            this._departureCities.next(departureCities);
                            this._arrivalCities.next(arrivalCities);
                        }
                        this._currency.next(data.currency);
                        this._deals.next(deals);
                    }
                    resolve(deals);
                }, (error) => {
                    reject(error);
                });
        });
        return <Observable<Deal[]>>Observable.fromPromise(promise);
    }

    findTrips(fromCity: string, toCity: string, orderBy: string): Trip[] {
        let matchingTrips: Trip[] = [];

        let dealsWithMatchingFromCity: Deal[] = _.filter(this.deals.getValue(), (currentDeal: Deal) => {
            return currentDeal.departure === fromCity;
        });

        let dealsWithMatchingToCity: Deal[] = _.filter(this.deals.getValue(), (currentDeal: Deal) => {
            return currentDeal.arrival === toCity;
        });

        let dealsWithExactMatch: Deal[] = _.intersection(dealsWithMatchingFromCity, dealsWithMatchingToCity);

        matchingTrips = _.map(dealsWithExactMatch, (currentDeal: Deal) => {
            return new Trip({
                fromCity: fromCity,
                toCity: toCity,
                currency: this.currency.getValue(),
                combination: [currentDeal]
            });
        });

        matchingTrips = _.sortBy(matchingTrips, (currentTrip: Trip) => {
            return orderBy === 'CHEAPEST' ? currentTrip.totalCost : currentTrip.totalDurationInMinutes;
        });

        return matchingTrips;
    }

}
