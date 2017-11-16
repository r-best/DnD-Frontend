import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignsComponent implements OnInit {
    private campaigns;
    
    private campaignSubscription: Subscription;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.campaignSubscription = this.api.GET(`/campaigns`).subscribe((res)=>{
            this.campaigns = res;
        });
    }

    ngOnDestroy(){
        this.campaignSubscription.unsubscribe();
    }
}
