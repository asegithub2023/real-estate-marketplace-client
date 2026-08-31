import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PropertyService } from '../../services/property';
import { ConversationService } from '../../services/conversation.service';
import { AuthService } from '../../services/auth.service';
import { Property } from '../../models/property';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { getListingTypeLabel } from '../../shared/utils/property-status';

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
  private readonly conversationService = inject(ConversationService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  property: Property | null = null;

  loading = false;
  error = '';

  isStartingConversation = false;
  contactError = '';

  currentImageIndex = 0;

  readonly getListingTypeLabel = getListingTypeLabel;

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
        this.currentImageIndex = 0;
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
    return this.property?.images?.[this.currentImageIndex]?.imageUrl
      || 'assets/images/property-placeholder.jpg';
  }

  get isFirstImage(): boolean {
    return this.currentImageIndex === 0;
  }

  get isLastImage(): boolean {
    const total = this.property?.images?.length ?? 0;
    return total === 0 || this.currentImageIndex === total - 1;
  }

  get hasMultipleImages(): boolean {
    return (this.property?.images?.length ?? 0) > 1;
  }

  previousImage(): void {
    if (this.isFirstImage) {
      return;
    }

    this.currentImageIndex--;
    this.cdr.markForCheck();
  }

  nextImage(): void {
    if (this.isLastImage) {
      return;
    }

    this.currentImageIndex++;
    this.cdr.markForCheck();
  }

  get isOwnProperty(): boolean {
    return !!this.property && this.property.ownerId === this.authService.getCurrentUserId();
  }

  contactOwner(): void {
    if (!this.property || this.isStartingConversation) {
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/properties/${this.property.id}` }
      });
      return;
    }

    this.isStartingConversation = true;
    this.contactError = '';

    this.conversationService.startConversation(this.property.id).subscribe({
      next: (conversation) => {
        this.isStartingConversation = false;
        this.router.navigate(['/dashboard/messages'], {
          queryParams: { conversationId: conversation.id }
        });
      },
      error: () => {
        this.isStartingConversation = false;
        this.contactError = 'Unable to start conversation. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}