import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayersComponent implements OnInit {
    private campaign;
    private players;
    
    private playerSubscription: Subscription;

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        console.log(`Campaign: ${this.campaign}`)
        console.log(`/campaigns/${this.route.snapshot.params[`campaign`]}`)
        this.playerSubscription = this.api.GET(`/campaigns/${this.route.snapshot.params[`campaign`]}/players`).subscribe((res)=>{
            this.players = res;
        });
    }

    ngOnDestroy(){
        this.playerSubscription.unsubscribe();
    }
}
