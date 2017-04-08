import { Deal } from './deal';
import * as _ from 'underscore';

export class Trip {
    readonly fromCity: string = '';
    readonly toCity: string = '';
    readonly currency: string = '';
    readonly combination: Deal[] = [];

    constructor(props: {
        fromCity: string,
        toCity: string,
        currency: string,
        combination: Deal[]
    }) {
        this.fromCity = props.fromCity;
        this.toCity = props.toCity;
        this.currency = props.currency;
        this.combination = props.combination;
    }

    get totalDuration(): number {
        return _.reduce(this.combination, (totalDuration: number, currentDeal: Deal) => {
            return totalDuration + currentDeal.duration.totalMinutes;
        }, 0);
    }

    get totalCost(): number {
        return _.reduce(this.combination, (totalCost: number, currentDeal: Deal) => {
            return totalCost + currentDeal.discountedCost;
        }, 0);
    }
}
