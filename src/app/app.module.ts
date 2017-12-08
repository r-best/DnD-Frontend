import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ApiService } from './shared/services/api.service';
import { ToastService } from './shared/services/toast.service';
import { UtilsService } from './shared/services/utils.service';

import { SpellFilter } from './shared/filters/spell.filter';
import { KeysFilter } from './shared/filters/keys.filter';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpellbookComponent } from './spellbook/spellbook.component';
import { SpellpageComponent } from './spellpage/spellpage.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { PlayersComponent } from './players/players.component';
import { PlayerInfoComponent } from './player-info/player-info.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { LevelupComponent } from './levelup/levelup.component';

const routes: Routes = [
    {path: ``, redirectTo: `/dashboard`, pathMatch: `full`},
    {path: 'dashboard', component: DashboardComponent},
    {path: `spellbook`, component: SpellbookComponent},
    {path: `spellbook/:spell`, component: SpellpageComponent},
    {path: `campaigns`, component: CampaignsComponent},
    {path: `campaigns/:campaign`, component: PlayersComponent},
    {path: `campaigns/:campaign/createPlayer`, component: CreatePlayerComponent},
    {path: `campaigns/:campaign/:player`, component: PlayerInfoComponent},
    {path: `campaigns/:campaign/:player/levelup`, component: LevelupComponent}
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        SpellbookComponent,
        SpellpageComponent,
        CampaignsComponent,
        PlayersComponent,
        PlayerInfoComponent,
        CreatePlayerComponent,
        LevelupComponent,
        SpellFilter,
        KeysFilter
    ],
    providers: [ApiService, ToastService, UtilsService],
    bootstrap: [AppComponent]
})
export class AppModule { }
