import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'since'
})
export class SinceDatePipe implements PipeTransform {
    timeDiffs = {
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
    };
    transform(value: string | Date): string {
        // let currentDate: Date;
        // if (!(value instanceof Date)) {
        //     currentDate = new Date(value);
        // }
        // else {
        //     currentDate = value;
        // }

        // let sinceDate = (Date.now() - currentDate.valueOf()) / 60000;

        // switch (true) {
        //     case (sinceDate < 1):
        //         return "à l'instant";
        //     case (sinceDate < 60):
        //         return `il y a ${Math.floor(sinceDate)} minutes`;
        //     case (sinceDate < 120):
        //         return `il y a une heure`;
        //     case (sinceDate < 1440):
        //         return `il y a ${Math.floor(sinceDate / 60)} heures`;
        //     case (sinceDate < 2880):
        //         return `il y a un jour`;
        //     case (sinceDate < 10080):
        //         return `il y a ${Math.floor(sinceDate / 60 / 24)} jours`;
        //     case (sinceDate < 20160):
        //         return `il y a une semaine`;
        //     case (sinceDate < 43200):
        //         return `il y a ${Math.floor(sinceDate / 60 / 24 / 7)} semaines`;
        //     case (sinceDate < 525600):
        //         return `il y a ${Math.floor(sinceDate / 60 / 24 / 30)} mois`;
        //     case (sinceDate < 1051200):
        //         return `il y a une année`;
        //     default:
        //         return `il y a ${Math.floor(sinceDate / 60 / 24 / 365)} années`;
        // }
        const now = Date.now();
        const then = new Date(value).getTime();
        const diff = now - then;

        switch (true) {
            case (diff < this.timeDiffs.minute):
                return 'Il y a quelques secondes';
            case (diff < this.timeDiffs.hour):
                return 'Il y a quelques minutes';
            case (diff < this.timeDiffs.day):
                return 'Il y a quelques heures';
            case (diff < this.timeDiffs.week):
                return 'Il y a quelques jours';
            case (diff < this.timeDiffs.month):
                return 'Il y a quelques semaines';
            case (diff < this.timeDiffs.year):
                return 'Il y a quelques mois';
            default:
                return 'Il y a plus d\'un an';
        }
    }
}

