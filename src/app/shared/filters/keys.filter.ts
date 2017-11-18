import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys',
    pure: false
})
export class KeysFilter implements PipeTransform {
    transform(items: any[]): any {
        return items == undefined ? items : Object.keys(items);
    }
}