import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';
  @Input() visible = false;
}
