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
import { Graph } from '../models/graph';
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

    findTrips(fromCity: string, toCity: string, orderBy: string, useCar: boolean, useBus: boolean, useTrain: boolean): Trip[] {
        let matchingTrips: Trip[] = [];

        let filteredDeals: Deal[] = _.filter(this.deals.getValue(), (currentDeal: Deal) => {
            if (useCar && currentDeal.transport === 'car') {
                return true;
            } else if (useBus && currentDeal.transport === 'bus') {
                return true;
            } else if (useTrain && currentDeal.transport === 'train') {
                return true;
            }

            return false;
        });

        const dealsWithMatchingFromCity: Deal[] = _.filter(filteredDeals, (currentDeal: Deal) => {
            return currentDeal.departure === fromCity;
        });

        const dealsWithMatchingToCity: Deal[] = _.filter(filteredDeals, (currentDeal: Deal) => {
            return currentDeal.arrival === toCity;
        });

        const dealsWithExactMatch: Deal[] = _.intersection(dealsWithMatchingFromCity, dealsWithMatchingToCity);

        matchingTrips = _.map(dealsWithExactMatch, (currentDeal: Deal) => {
            return new Trip({
                fromCity: fromCity,
                toCity: toCity,
                currency: this.currency.getValue(),
                combination: [currentDeal]
            });
        });

        const departureCities: string[] = _.chain(filteredDeals).map((currentDeal: Deal) => {
            return currentDeal.departure;
        }).uniq().value();
        const arrivalCities: string[] = _.chain(filteredDeals).map((currentDeal: Deal) => {
            return currentDeal.arrival;
        }).uniq().value();
        const allCities = _.union(departureCities, arrivalCities);

        let routesMap: any = {};
        _.forEach(allCities, (currentCity: string) => {
            const matchingDeals: Deal[] = _.filter(filteredDeals, (currentDeal: Deal) => {
                return currentDeal.departure === currentCity;
            });
            routesMap[currentCity] = {};
            _.forEach(matchingDeals, (currentDeal: Deal) => {
                if (orderBy === 'CHEAPEST') {
                    routesMap[currentCity][currentDeal.arrival] = currentDeal.discountedCost;
                } else {
                    routesMap[currentCity][currentDeal.arrival] = currentDeal.duration.totalMinutes;
                }
            });
        });
        const Graph = (<any>window).Graph;
        const routesGraph = new Graph(routesMap);
        const shortestPath: string[] = routesGraph.findShortestPath(fromCity, toCity);
        if (shortestPath) {
            const dealsForPath: Deal[] = _.times(shortestPath.length - 1, (i: number) => {
                const departure: string = shortestPath[i];
                const arrival: string = shortestPath[i + 1];

                return _.chain(filteredDeals)
                    .filter((currentDeal: Deal) => {
                        return currentDeal.arrival === arrival && currentDeal.departure === departure;
                    })
                    .sortBy((currentDeal: Deal) => {
                        return orderBy === 'CHEAPEST' ? currentDeal.discountedCost : currentDeal.duration.totalMinutes;
                    })
                    .first()
                    .value();
            });

            const tripForShortestPath: Trip = new Trip({
                fromCity: fromCity,
                toCity: toCity,
                currency: this.currency.getValue(),
                combination: dealsForPath
            });

            if (tripForShortestPath && tripForShortestPath.combination.length > 1) {
                matchingTrips.push(tripForShortestPath);
            }
        }
        matchingTrips = _.sortBy(matchingTrips, (currentTrip: Trip) => {
            return orderBy === 'CHEAPEST' ? currentTrip.totalCost : currentTrip.totalDurationInMinutes;
        });
        return matchingTrips;
    }

}
