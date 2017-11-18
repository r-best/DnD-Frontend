import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterspells',
    pure: false
})
export class SpellFilter implements PipeTransform {
    transform(items: any[], name: string, school: string): any {
        items = items.filter(item => item[`SPELL_NAME`].toLowerCase().startsWith(name.trim().toLowerCase()));
        if(school != 'None')
            items = items.filter(item => item[`SCHOOL`].toLowerCase() == school.toLowerCase());
        return items;
    }
}