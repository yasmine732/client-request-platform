import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  contactInfo = [
    {
      title: 'Email',
      content: 'hello@angulartailwind.com',
      link: 'mailto:hello@angulartailwind.com',
    },
    {
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      title: 'Office',
      content: '123 Tech Street, San Francisco, CA 94102',
      link: '#',
    },
  ];

  handleSubmit() {
    console.log('Form submitted:', this.formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };
  }
}
