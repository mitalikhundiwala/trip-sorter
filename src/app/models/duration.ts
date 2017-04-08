export class Duration {
    readonly hours: number = 0;
    readonly minutes: number = 0;

    static fromMinutes(minutes: number): Duration {
        return new Duration({
            hours: Math.floor(minutes / 60),
            minutes: minutes % 60
        });
    }

    constructor(props: {
        hours: number,
        minutes: number
    }) {
        this.hours = props.hours;
        this.minutes = props.minutes;
    }

    get totalMinutes(): number {
        return (this.hours * 60) + this.minutes;
    }
}
