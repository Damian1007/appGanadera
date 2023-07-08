import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        TabsComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule
    ],
    exports: [
        TabsComponent
    ]
})
export class ComponentsModule { }