import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterspells',
    pure: false
})
export class SpellFilter implements PipeTransform {
    transform(spells: any[], name: string, school: string, concentration: string, classes: {}[], vsm: {}): any {
        // Filter spells by name
        spells = spells.filter(spell => spell[`SPELL_NAME`].toLowerCase().startsWith(name.trim().toLowerCase()));
        // Filter spells by school
        if(school != 'None')
            spells = spells.filter(spell => spell[`SCHOOL`].toLowerCase() == school.toLowerCase());
        // Filter spells by whether or not they require concentration
        if(concentration != "N/A")
            spells = spells.filter(spell => 
                (concentration == `Yes` && spell[`CONCENTRATION`] == 1) || 
                (concentration == `No` && spell[`CONCENTRATION`] == 0)
            );
        // Filter spells by class
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
        // Filter spells by VSM requirements
        if(vsm[`verbal`] || vsm[`somatic`] || vsm[`material`]){
            spells = spells.filter(spell => {
                return spell[`VERBAL`] == vsm[`verbal`] && 
                    spell[`SOMATIC`] == vsm[`somatic`] && 
                    ((spell[`MATERIALS`] == null && !vsm[`material`]) || (spell[`MATERIALS`] !== null && vsm[`material`]))
            });
        }
        return spells;
    }
}