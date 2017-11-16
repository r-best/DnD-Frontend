import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PlayerInfoComponent implements OnInit {
    private campaign;
    private player;

    private playerSubscription: Subscription;

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        this.playerSubscription = this.api.GET(`/campaigns/${this.campaign}/players/${this.route.snapshot.params[`player`]}`).subscribe((res)=>{
            this.player = res;
        });
    }
  
    ngOnDestroy(){
        this.playerSubscription.unsubscribe();
    }

}
