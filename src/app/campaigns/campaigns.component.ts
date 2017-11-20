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

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.refreshCampaignList();
    }

    refreshCampaignList(){
        this.api.GET(`/campaigns`).then((res)=>{
            this.campaigns = res;
        });
    }
}
