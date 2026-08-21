import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PropertyService } from '../../../services/property';
import { Property } from '../../../models/property';
import { PagedRequest } from '../../../models/paged-request';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.scss'
})
export class MyPropertiesComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);

  properties: Property[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProperties();
  }

  private loadProperties(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request: PagedRequest = {
      page: 1,
      pageSize: 20,
      orderBy: 'id',
      descending: true
    };

    this.propertyService.getProperties(request).subscribe({
      next: (response) => {
        this.properties = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load your properties.';
        this.isLoading = false;
      }
    });
  }
}