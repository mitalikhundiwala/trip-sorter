export class Duration {
    readonly hours: number = 0;
    readonly minutes: number = 0;


    constructor(props: {
        hours: number,
        minutes: number
    }) {
        this.hours = props.hours;
        this.minutes = props.minutes;
    }
}
