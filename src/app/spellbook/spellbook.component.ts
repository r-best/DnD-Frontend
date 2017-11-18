import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';

let models = require(`../shared/models/models`);

@Component({
    selector: 'app-spellbook',
    templateUrl: './spellbook.component.html',
    styleUrls: ['./spellbook.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SpellbookComponent implements OnInit {
    private spells = [
        [], // Level 0 spells
        [], // Level 1 spells
        [], // Level 2 spells
        [], // Level 3 spells
        [], // Level 4 spells
        [], // Level 5 spells
        [], // Level 6 spells
        [], // Level 7 spells
        [], // Level 8 spells
        [], // Level 9 spells
    ];
    private classes = []; // Used to store a list of all classes and whether or not they've been checked in the filter

    private nameFilter: string = "";
    private schoolFilter: string = "None";
    private concentrationFilter: string = "N/A";

    private spellSubscription: Subscription;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.spellSubscription = this.api.GET(`/spells`).subscribe((res)=>{
            res.sort((a, b) => {
                return a[`SPELL_NAME`].localeCompare(b[`SPELL_NAME`])
            });
            this.classes = [];
            res.forEach(element => { // For each spell returned
                // Get the classes that can learn the spell
                let subscription = this.api.GET(`/spells/${element[`SPELL_NAME`]}/classes`).subscribe(res2 => {
                    element[`classes`] = [];
                    // For each one of those classes
                    res2.forEach(item => {
                        // If it's not already in the classes array, add it
                        if(!this.classes[item[`CLASS_NAME`]]) this.classes[item[`CLASS_NAME`]] = false;
                        // And attach the class to the spell object
                        element[`classes`].push(item[`CLASS_NAME`])
                    });
                    subscription.unsubscribe();
                });
                this.spells[element[`LV`]].push(element);
            });
        });
    }

    ngOnDestroy(){
        this.spellSubscription.unsubscribe();
    }
}