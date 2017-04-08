import { Duration } from './duration';

export class Deal {
    readonly transport: string = '';
    readonly departure: string = '';
    readonly arrival: string = '';
    readonly duration: Duration = null;
    readonly cost: number = 0;
    readonly discount: number = 0;
    readonly reference: string = '';


    constructor(props: {
        transport: string,
        departure: string,
        arrival: string,
        duration: Duration,
        cost: number,
        discount: number,
        reference: string
    }) {
        this.transport = props.transport;
        this.departure = props.departure;
        this.arrival = props.arrival;
        this.duration = props.duration;
        this.cost = props.cost;
        this.discount = props.discount;
        this.reference = props.reference;
    }

    get discountedCost(): number {
        return this.discount ? this.cost - (this.cost * (this.discount / 100)) : this.cost;
    }
}
