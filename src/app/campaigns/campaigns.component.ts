import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastService } from '../shared/services/toast.service';

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

    constructor(private api: ApiService, private toast: ToastService) { }

    ngOnInit() {
        this.refreshCampaignList();
    }

    refreshCampaignList(){
        this.api.GET(`/campaigns`).then((res)=>{
            this.campaigns = res;
        });
    }
    
    confirmDeleteCampaign(name: string){
        if(confirm(`Are you sure you want to delete '${name}'?`))
            this.api.DEL(`/campaigns/${name}`).then(res => {
                this.refreshCampaignList();
            });
    }

    openNewCampaignDialogue(){
        if(!this.isNewCampaignDialogueOpen)
            this.isNewCampaignDialogueOpen = true;
    }

    closeNewCampaignDialogue(){
        if(this.isNewCampaignDialogueOpen){
            this.isNewCampaignDialogueOpen = false;
            this.newCampaignNameField = "";
            this.refreshCampaignList();
        }
    }

    createCampaign(name: string){
        if(new RegExp("^[A-Za-z0-9-\\s]+$").test(name)){
            this.api.PUT(`/campaigns/${name}`, {}).then(res => {
                this.toast.showToast(`alert-success`, `Campaign '${name}' successfully added!`);
                this.closeNewCampaignDialogue();
            });
        }
        else
            this.toast.showToast(`alert-danger`, `Please make sure your entry contains only letters, numbers, hyphens, and spaces`);
    }
}