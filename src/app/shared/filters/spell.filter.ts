import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterspells',
    pure: false
})
export class SpellFilter implements PipeTransform {
    transform(items: any[], name: string, school: string, concentration: string): any {
        items = items.filter(item => item[`SPELL_NAME`].toLowerCase().startsWith(name.trim().toLowerCase()));
        if(school != 'None')
            items = items.filter(item => item[`SCHOOL`].toLowerCase() == school.toLowerCase());
        if(concentration != "N/A")
            items = items.filter(item => 
                (concentration == `Yes` && item[`CONCENTRATION`] == 1) || 
                (concentration == `No` && item[`CONCENTRATION`] == 0)
            );
        return items;
    }
}