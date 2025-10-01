import { Component } from '@angular/core';

@Component({
    selector: 'app-announcements',
    standalone: false,
    templateUrl: './announcements.html',
    styleUrl: './announcements.scss'
})
export class Announcements {
    activeTab: 'notifications' | 'create-announcements' | 'promos' = 'notifications';

    setTab(tab: 'notifications' | 'create-announcements' | 'promos') {
        this.activeTab = tab;
    }
}