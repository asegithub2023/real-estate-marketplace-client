import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PropertyService } from '../../services/property';
import { Property } from '../../models/property';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LoadingComponent
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss'
})
export class PropertyDetailsComponent implements OnInit {

  private readonly propertyService = inject(PropertyService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  property: Property | null = null;

  loading = false;
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'Invalid property ID.';
      return;
    }

    this.loadProperty(id);
  }

  loadProperty(id: number): void {
    this.loading = true;
    this.error = '';

    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.property = property;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load property.';
        this.cdr.markForCheck();
      }
    });
  }

  getPropertyImage(): string {
    return this.property?.images?.[0]?.imageUrl
      || 'assets/images/property-placeholder.jpg';
  }
}