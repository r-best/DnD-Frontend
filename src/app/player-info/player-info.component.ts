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

    private playerSubscription: Subscription;
    private levelsSubscription: Subscription;
    private abilitiesSubscription: Subscription;
    private attacksSubscription: Subscription;
    private itemsSubscription: Subscription;
    private spellsSubscription: Subscription;

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        let playerName = this.route.snapshot.params[`player`];
        this.playerSubscription = this.api.GET(`/campaigns/${this.campaign}/players/${playerName}`)
            .subscribe((res)=>{
                this.player = res;
            });
        this.levelsSubscription = this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/level`)
            .subscribe(res => {
                this.levels = res;
            });
        this.abilitiesSubscription = this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/abilities`)
            .subscribe(res => {
                this.abilities = res;
            });
        this.attacksSubscription = this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/attacks`)
            .subscribe(res => {
                this.attacks = res;
            });
        this.itemsSubscription = this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/items`)
            .subscribe(res => {
                this.items = res;
            });
        this.spellsSubscription = this.api.GET(`/campaigns/${this.campaign}/players/${playerName}/spells`)
            .subscribe(res => {
                res.sort((a, b) => {
                    return a[`SPELL_NAME`].localeCompare(b[`SPELL_NAME`])
                });
                res.forEach(element => { // For each spell returned
                    // Insert it into the correct array based on its level
                    this.spells[element[`LV`]].push(element);
                });
            });
    }

    ngOnDestroy(){
        this.playerSubscription.unsubscribe();
        this.levelsSubscription.unsubscribe();
        this.abilitiesSubscription.unsubscribe();
        this.attacksSubscription.unsubscribe();
        this.itemsSubscription.unsubscribe();
        this.spellsSubscription.unsubscribe();
    }

    getModifier(score: number): string{
        let modifier = Math.floor(score/2) - 5;
        return modifier < 0 ? `-${modifier}` : `+${modifier}`;
    }
}