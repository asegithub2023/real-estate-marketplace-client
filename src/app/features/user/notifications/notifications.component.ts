import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  icon: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {

  notifications: Notification[] = [];

  get unreadCount(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }

  markAsRead(notification: Notification): void {
    notification.isRead = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(
      notification => notification.id !== id
    );
  }
}
