import { BehaviorSubject } from 'rxjs/Rx';
import * as _ from 'underscore';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

import { Deal } from '../models/deal';
import { DealAdapter } from './adapters/deal.adapter';

@Injectable()
export class DealsService {
    private _url: string = `${environment.SERVICE_BASE_URL}`;
    private _headers: Headers = new Headers();

    private _deals: BehaviorSubject<Deal[]> = new BehaviorSubject([]);
    private _currency: BehaviorSubject<string> = new BehaviorSubject('');

    get deals(): BehaviorSubject<Deal[]> {
        return this._deals;
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
                            this._deals.next(deals);
                        }
                        this._currency.next(data.currency);
                    }
                    resolve(deals);
                }, (error) => {
                    reject(error);
                });
        });
        return <Observable<Deal[]>>Observable.fromPromise(promise);
    }

}
