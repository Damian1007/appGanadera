import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '', icon: 'mail' },
    { title: 'Outbox', url: '', icon: 'paper-plane' },
    { title: 'Favorites', url: '', icon: 'heart' },
    { title: 'Archived', url: '', icon: 'archive' },
    { title: 'Trash', url: '', icon: 'trash' },
    { title: 'Spam', url: '', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
