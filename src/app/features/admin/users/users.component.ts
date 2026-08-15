import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  searchTerm = '';

  users: User[] = [
    {
      id: 1,
      name: 'Abebe Kebede',
      email: 'abebe@example.com',
      role: 'Buyer',
      status: 'Active',
      joinedDate: 'Aug 10, 2026'
    },
    {
      id: 2,
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      role: 'Seller',
      status: 'Active',
      joinedDate: 'Aug 8, 2026'
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Buyer',
      status: 'Inactive',
      joinedDate: 'Aug 5, 2026'
    }
  ];

  get filteredUsers(): User[] {
    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      return this.users;
    }

    return this.users.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  toggleStatus(user: User): void {
    user.status = user.status === 'Active'
      ? 'Inactive'
      : 'Active';
  }
}
