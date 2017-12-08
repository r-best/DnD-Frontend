import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

    constructor() { }
    
    /*
        Gets the modifier associated with a score as
        a string in the form of the modifier number
        with a plus or minus in front
    */
    getModifier(score: number): string{
        let modifier = Math.floor((score - 10) / 2);
        return modifier < 0 ? `${modifier}` : `+${modifier}`;
    }

    getModifierAsInt(score: number): number{
        return Math.floor((score - 10) / 2);
    }

    // Both min and max are inclusive
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
