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

    private isNewCampaignDialogueOpen: boolean = false;
    private newCampaignNameField: string = "";
    private badEntryAlert: boolean = false;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.refreshCampaignList();
    }

    refreshCampaignList(){
        this.api.GET(`/campaigns`).then((res)=>{
            this.campaigns = res;
        });
    }
    
    confirmDeleteCampaign(){
        alert(`I havent implemented this yet be patient`);
    }

    openNewCampaignDialogue(){
        if(!this.isNewCampaignDialogueOpen)
            this.isNewCampaignDialogueOpen = true;
    }

    closeNewCampaignDialogue(){
        if(this.isNewCampaignDialogueOpen){
            this.isNewCampaignDialogueOpen = false;
            this.newCampaignNameField = "";
            this.badEntryAlert = false;
            this.refreshCampaignList();
        }
    }

    createCampaign(name: string){
        if(new RegExp("^[A-Za-z0-9-\\s]+$").test(name)){
            if(this.badEntryAlert)
                this.badEntryAlert = false;
            // this.api.PUT(`/campaigns/${name}`, {}).then(res => {
                
            // });
        }
        else
            this.badEntryAlert = true;
            
    }
}
