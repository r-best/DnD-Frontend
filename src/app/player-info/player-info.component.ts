import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

const models = require(`../shared/models/models`);

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PlayerInfoComponent implements OnInit {
    private campaign: string;
    private player: {} = models.player;
    private levels: {} = models.playerLevel;
    private abilities: {} = [models.ability];
    private attacks: {} = [models.attack];
    private items: {} = [models.item];
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
    private VSMFilter = {
        verbal: false,
        somatic: false,
        material: false
    };

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        let playerName = this.route.snapshot.params[`player`];
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}`)
            .then((res)=>{
                this.player = res;
            });
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/level`)
            .then(res => {
                this.levels = res;
            });
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/abilities`)
            .then(res => {
                this.abilities = res;
            });
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/attacks`)
            .then(res => {
                this.attacks = res;
            });
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/items`)
            .then(res => {
                this.items = res;
            });
        this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/spells`)
            .then(res => {
                res.sort((a, b) => {
                    return a[`SPELL_NAME`].localeCompare(b[`SPELL_NAME`])
                });
                res.forEach(element => { // For each spell returned
                    // Insert it into the correct array based on its level
                    this.spells[element[`LV`]].push(element);
                });
            });
    }

    getModifier(score: number): string{
        let modifier = Math.floor(score/2) - 5;
        return modifier < 0 ? `-${modifier}` : `+${modifier}`;
    }
}