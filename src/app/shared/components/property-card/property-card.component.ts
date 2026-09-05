import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss'
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: any;

  get imageUrl(): string {
    return this.property.images?.[0]?.imageUrl
      ?? 'assets/images/property-placeholder.jpg';
  }
}
