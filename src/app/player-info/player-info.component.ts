import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UtilsService } from '../shared/services/utils.service';
import { ToastService } from '../shared/services/toast.service';

const models = require(`../shared/models/models`);

@Component({
    selector: 'app-player-info',
    templateUrl: './player-info.component.html',
    styleUrls: ['./player-info.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PlayerInfoComponent implements OnInit {
    private isNewItemDialogueOpen: boolean = false;
    private newItemNameField: string = "";
    private newItemDescrField: string = "";
    private newItemQuantityField: number = 0;

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
    private concentrationFilter = `N/A`;
    private VSMFilter = {
        verbal: false,
        somatic: false,
        material: false
    };

    constructor(private api: ApiService, private route: ActivatedRoute, private utils: UtilsService, private toast: ToastService) { }

    ngOnInit() {
        this.campaign = this.route.snapshot.params[`campaign`];
        this.refreshPlayerData();
    }

    refreshPlayerData(){
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

    confirmDeleteItem(item) {
        console.dir(item);
        let itemName = item.ITEM_NAME;
        if (confirm(`Are you sure you want to delete item '${itemName}?`)) {
            // console.log('deleting item', item);
            // this.api.DEL
            let playerName = this.route.snapshot.params[`player`];
            console.log('Deleting item', item);
            this.api.DEL(`/campaigns/${this.campaign}/players/${playerName}/items/${itemName}`).then(res => {
                console.log('Item deleted.');
                this.refreshPlayerData();
            });
        }
    }

    createNewItem(ITEM_NAME, DESCR, QUANTITY) {
        let item = {
            ITEM_NAME,
            DESCR,
            QUANTITY
        };

        if (this.isValidItem(item)) {
            this.closeNewItemDialogue();
            let playerName: string = this.route.snapshot.params[`player`];
            console.log('Adding item', item);
            this.api.PUT(`/campaigns/${this.campaign}/players/${playerName}/items/${item.ITEM_NAME}`, item).then(res => {
                console.log('Item added.');
                this.refreshPlayerData();
            });
        } else {
            console.warn('Invalid item', item);
        }


        debugger;
        // let item = {
            // ITEM_NAME:
        // }
        //     if(new RegExp("^[A-Za-z0-9-\\s]+$").test(name)){
        //         this.api.PUT(`/campaigns/${name}`, {}).then(res => {
        //             if(res[`err`])
        //                 this.toast.showToast(`alert-danger`, `Failed to add campaign '${name}'`);
        //             else{
        //                 this.toast.showToast(`alert-success`, `Campaign '${name}' successfully added!`);
        //                 this.closeNewCampaignDialogue();
        //             }
        //         });
        //     }
        //     else
        //         this.toast.showToast(`alert-danger`, `Please make sure your entry contains only letters, numbers, hyphens, and spaces`);
        // }
    }

    isValidItem(item) {
        let textRegExp = new RegExp("^[A-Za-z0-9-\\s]+$");
        let numRegExp = new RegExp("^[0-9]+$");
        if (item.ITEM_NAME.length == 0) {
            this.toast.showToast(`alert-danger`, `Please make sure you enter an item name`);
        } else if (item.DESCR.length == 0) {
            this.toast.showToast(`alert-danger`, `Please make sure you enter an item description`);
        } else if (item.QUANTITY.length == 0) {
            this.toast.showToast(`alert-danger`, `Please make sure you enter an item quantity`);
        } else if (!textRegExp.test(item.ITEM_NAME)) {
            this.toast.showToast(`alert-danger`, `Please make sure your item name contains only letters, numbers, hyphens, and spaces`);
        } else if (!textRegExp.test(item.DESCR)) {
            this.toast.showToast(`alert-danger`, `Please make sure your item description contains only letters, numbers, hyphens, and spaces`);
        } else if (!numRegExp.test(item.QUANTITY)) {
            this.toast.showToast(`alert-danger`, `Please make sure your item quantity is numeric`);
        } else if (item.QUANTITY < 1) {
            this.toast.showToast(`alert-danger`, `Please make sure your item quantity is one or greater`);
        } else {
            return true;
        }
        return false;
        // test name
    }

    openNewItemDialogue(){
        if (!this.isNewItemDialogueOpen) this.isNewItemDialogueOpen = true;
    }

    closeNewItemDialogue(){
        if (this.isNewItemDialogueOpen) {
            this.isNewItemDialogueOpen = false;
            this.newItemNameField = "";
            this.newItemDescrField = "";
            this.newItemQuantityField = 0;
            this.refreshPlayerData();
        }
    }
}
