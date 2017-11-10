import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-spellpage',
  templateUrl: './spellpage.component.html',
  styleUrls: ['./spellpage.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpellpageComponent implements OnInit {
    private spell: JSON;

    private spellSubcription: Subscription;

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        console.log(`/spells/${this.route.snapshot.params[`spell`]}`)
        this.spellSubcription = this.api.GET(`/spells/${this.route.snapshot.params[`spell`]}`).subscribe(res => {
            this.spell = res;
        });
    }

    ngOnDestroy(){
        this.spellSubcription.unsubscribe();
    }
}
