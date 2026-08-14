import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Property } from '../../../models/property';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

  favorites: Property[] = [];

  isLoading = false;
  errorMessage = '';

  removeFavorite(propertyId: number): void {
    this.favorites = this.favorites.filter(
      property => property.id !== propertyId
    );
  }
}