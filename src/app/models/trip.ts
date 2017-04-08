import { Deal } from './deal';

export class Trip {
    readonly currency: string = '';
    readonly deals: Deal[] = [];

    constructor(props: {
        currency: string,
        deals: Deal[]
    }) {
        this.currency = props.currency;
        this.deals = props.deals;
    }
}
