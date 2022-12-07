import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmEqualValidator(main: string, confirm: string): ValidatorFn {
    return (group: AbstractControl): null | ValidationErrors => {
        if (!group.get(main) || !group.get(confirm)) {
            return {
                confirmEqual: 'Invalid control names'
            };
        }
        const mainValue = group.get(main)!.value;
        const confirmValue = group.get(confirm)!.value;
        return mainValue === confirmValue ? null : {
            confirmEqual: {
                main: mainValue,
                confirm: confirmValue
            }
        };
    };
}