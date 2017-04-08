import { Deal } from '../../models/deal';
import { Duration } from '../../models/duration';

export class DealAdapter {
    static parseResponse(data: any): Deal {

        let deal: Deal = null;
        if (data) {
            deal = new Deal({
                transport: data.transport,
                departure: data.departure,
                arrival: data.arrival,
                duration: new Duration({
                    hours: parseInt(data.duration.h, 10),
                    minutes: parseInt(data.duration.m, 10)
                }),
                cost: data.cost,
                discount: data.discount,
                reference: data.reference
            });
        }
        return deal;
    }
}


