import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

const models = require(`../shared/models/models`);

@Component({
  selector: 'app-spellpage',
  templateUrl: './spellpage.component.html',
  styleUrls: ['./spellpage.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpellpageComponent implements OnInit {
    private spell: {} = models.spell;
    private classes: {}[];

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        console.log(`/spells/${this.route.snapshot.params[`spell`]}`)
        this.api.GET(`/spells/${this.route.snapshot.params[`spell`]}`).then(res => {
            this.spell = res;
        });
        this.api.GET(`/spells/${this.route.snapshot.params[`spell`]}/classes`).then(res => {
            this.classes = res;
        });
    }
}
