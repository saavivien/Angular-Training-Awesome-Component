import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'naming'
})
export class NamingPipe implements PipeTransform {
    transform(name: { firstName: string, lastName: string }, locale: 'fr' | 'en' = 'fr'): string {
        const lastNameToDisplay = name.lastName.toUpperCase();
        const firstNametoDispay = name.firstName ? (name.firstName.charAt(0).toUpperCase() + name.firstName.substring(1, name.firstName.length).toLowerCase()) : '';
        return locale === 'fr' ? `${lastNameToDisplay} ${firstNametoDispay}` : `${firstNametoDispay} ${lastNameToDisplay}`
    }

}