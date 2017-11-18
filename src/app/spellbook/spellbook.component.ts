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

    private spellSubscription: Subscription;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.spellSubscription = this.api.GET(`/spells`).subscribe((res)=>{
            res.sort((a, b) => {
                return a[`SPELL_NAME`].localeCompare(b[`SPELL_NAME`])
            });
            res.forEach(element => {
                let level = element[`LV`];
                this.spells[level].push(element);
            });
        });
    }

    ngOnDestroy(){
        this.spellSubscription.unsubscribe();
    }
}