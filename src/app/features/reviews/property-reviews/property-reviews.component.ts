import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-property-reviews',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './property-reviews.component.html',
  styleUrl: './property-reviews.component.scss'
})
export class PropertyReviewsComponent {

  reviews: Review[] = [
    {
      id: 1,
      userName: 'Abebe Kebede',
      rating: 5,
      comment: 'Excellent property and great location.',
      date: '2 days ago'
    },
    {
      id: 2,
      userName: 'Sara Ahmed',
      rating: 4,
      comment: 'Very nice property. I really liked the area.',
      date: '1 week ago'
    }
  ];

  newRating = 0;
  newComment = '';

  setRating(rating: number): void {
    this.newRating = rating;
  }

  submitReview(): void {
    if (!this.newRating || !this.newComment.trim()) {
      return;
    }

    const review: Review = {
      id: Date.now(),
      userName: 'You',
      rating: this.newRating,
      comment: this.newComment.trim(),
      date: 'Just now'
    };

    this.reviews.unshift(review);

    this.newRating = 0;
    this.newComment = '';
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
