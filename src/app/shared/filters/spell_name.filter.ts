import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'spellname',
    pure: false
})
export class SpellNameFilter implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item[`SPELL_NAME`].toLowerCase().startsWith(filter.trim()));
    }
}