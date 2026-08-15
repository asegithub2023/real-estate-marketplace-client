import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  description: string;
}

interface Property {
  title: string;
  location: string;
  price: string;
  status: string;
}

interface User {
  name: string;
  email: string;
  role: string;
}
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

  stats: StatCard[] = [
    {
      title: 'Total Users',
      value: '1,248',
      icon: 'bi-people',
      description: '+12% this month'
    },
    {
      title: 'Properties',
      value: '856',
      icon: 'bi-buildings',
      description: '+8% this month'
    },
    {
      title: 'Pending Reports',
      value: '24',
      icon: 'bi-flag',
      description: 'Requires attention'
    },
    {
      title: 'Active Listings',
      value: '692',
      icon: 'bi-check-circle',
      description: 'Currently active'
    }
  ];

  recentProperties: Property[] = [
    {
      title: 'Modern Family House',
      location: 'Addis Ababa',
      price: '$120,000',
      status: 'Active'
    },
    {
      title: 'Luxury Apartment',
      location: 'Bole',
      price: '$85,000',
      status: 'Pending'
    },
    {
      title: 'Commercial Building',
      location: 'Kazanchis',
      price: '$250,000',
      status: 'Active'
    }
  ];

  recentUsers: User[] = [
    {
      name: 'Abebe Kebede',
      email: 'abebe@example.com',
      role: 'Buyer'
    },
    {
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      role: 'Seller'
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Buyer'
    }
  ];
}
