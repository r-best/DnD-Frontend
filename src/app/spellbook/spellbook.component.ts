import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-spellbook',
    templateUrl: './spellbook.component.html',
    styleUrls: ['./spellbook.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SpellbookComponent implements OnInit {
    private spells;

    constructor(private api: ApiService) { }

    ngOnInit() {
        let x;
        this.api.GET(`/spells`).subscribe((res)=>{
            this.spells = res;
        });
    }

}