import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-spellbook',
    templateUrl: './spellbook.component.html',
    styleUrls: ['./spellbook.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SpellbookComponent implements OnInit {
    private spells;

    private spellSubscription: Subscription;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.spellSubscription = this.api.GET(`/spells`).subscribe((res)=>{
            this.spells = res;
        });
    }

    ngOnDestroy(){
        this.spellSubscription.unsubscribe();
    }
}