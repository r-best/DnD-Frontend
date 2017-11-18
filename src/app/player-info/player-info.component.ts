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
    private levels: {};

    private playerSubscription: Subscription;
    private levelsSubscription: Subscription;

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
    }

    ngOnDestroy(){
        this.playerSubscription.unsubscribe();
        this.levelsSubscription.unsubscribe();
    }

}
