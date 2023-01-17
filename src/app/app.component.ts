import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/login/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/login/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/login/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/login/Archived', icon: 'archive' },
    { title: 'Trash', url: '/login/Trash', icon: 'trash' },
    { title: 'Spam', url: '/login/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
