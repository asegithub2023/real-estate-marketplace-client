import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PropertyService } from '../../../services/property';
import { AuthService } from '../../../services/auth.service';
import { Property } from '../../../models/property';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.scss'
})
export class MyPropertiesComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  properties: Property[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProperties();
  }

  private loadProperties(): void {
    const ownerId = this.authService.getCurrentUserId();

    if (!ownerId) {
      this.errorMessage = 'You must be logged in to view your properties.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.propertyService.getPropertiesByOwner(ownerId).subscribe({
      next: (properties) => {
        this.properties = properties;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load your properties.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}