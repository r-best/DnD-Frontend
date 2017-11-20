import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

const models = require(`../shared/models/models`);

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
    private campaign: string;
    private players: {};
    
    private playersSubscription: Subscription;

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        console.log(`Campaign: ${this.campaign}`)
        console.log(`/campaigns/${this.route.snapshot.params[`campaign`]}`)
        this.playersSubscription = this.api.GET(`/campaigns/${this.route.snapshot.params[`campaign`]}/players`).subscribe((res)=>{
            this.players = res;
        });
    }

    ngOnDestroy(){
        this.playersSubscription.unsubscribe();
    }
    
    confirmDeletePlayer(){
        alert(`I havent implemented this yet be patient`);
    }
}
