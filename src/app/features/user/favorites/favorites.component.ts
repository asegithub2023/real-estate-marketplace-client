import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Favorite } from '../../../models/favorite';
import { FavoriteService } from '../../../services/favorite.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {

  private readonly favoriteService = inject(FavoriteService);
  private readonly cdr = inject(ChangeDetectorRef);

  favorites: Favorite[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.favoriteService.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load favorites. Please try again.';

        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 3000);

        this.cdr.markForCheck();
      }
    });
  }

  removeFavorite(propertyId: number): void {
    this.favoriteService.removeFavorite(propertyId).subscribe({
      next: () => {

        this.favorites = this.favorites.filter(
          f => f.propertyId !== propertyId
        );

        this.successMessage = 'Favorite removed successfully.';

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);

        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to remove favorite. Please try again.';

        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 3000);

        this.cdr.markForCheck();
      }
    });
  }
}