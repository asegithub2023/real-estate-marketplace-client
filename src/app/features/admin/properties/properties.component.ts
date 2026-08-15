import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AdminProperty {
  id: number;
  title: string;
  owner: string;
  location: string;
  price: string;
  status: string;
}

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent {

  searchTerm = '';

  properties: AdminProperty[] = [
    {
      id: 1,
      title: 'Modern Family House',
      owner: 'Abebe Kebede',
      location: 'Addis Ababa',
      price: '$120,000',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Luxury Apartment',
      owner: 'Sara Ahmed',
      location: 'Bole',
      price: '$85,000',
      status: 'Pending'
    },
    {
      id: 3,
      title: 'Commercial Building',
      owner: 'John Doe',
      location: 'Kazanchis',
      price: '$250,000',
      status: 'Rejected'
    }
  ];

  get filteredProperties(): AdminProperty[] {
    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      return this.properties;
    }

    return this.properties.filter(property =>
      property.title.toLowerCase().includes(search) ||
      property.owner.toLowerCase().includes(search) ||
      property.location.toLowerCase().includes(search)
    );
  }

  updateStatus(property: AdminProperty, status: string): void {
    property.status = status;
  }
}