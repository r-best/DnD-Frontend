import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterspells',
    pure: false
})
export class SpellFilter implements PipeTransform {
    transform(spells: any[], name: string, school: string, concentration: string, classes: {}[]): any {
        spells = spells.filter(spell => spell[`SPELL_NAME`].toLowerCase().startsWith(name.trim().toLowerCase()));
        if(school != 'None')
            spells = spells.filter(spell => spell[`SCHOOL`].toLowerCase() == school.toLowerCase());
        if(concentration != "N/A")
            spells = spells.filter(spell => 
                (concentration == `Yes` && spell[`CONCENTRATION`] == 1) || 
                (concentration == `No` && spell[`CONCENTRATION`] == 0)
            );
        classes = Object.keys(classes).filter(element => classes[element]);
        if(Object.keys(classes).length > 0){
            spells = spells.filter(spell => {
                let include: boolean = false;
                classes.forEach((element: string) => {
                    if(spell[`classes`].includes(element))
                        include = true;
                });
                return include;
            });
        }
        return spells;
    }
}