import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  team = [
    {
      name: 'Sarah Johnson',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'UX Designer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    },
  ];

  values = [
    {
      title: 'Innovation',
      description: 'Pushing boundaries with cutting-edge technology',
      icon: '🚀',
    },
    {
      title: 'Quality',
      description: 'Delivering excellence in every line of code',
      icon: '⭐',
    },
    {
      title: 'Collaboration',
      description: 'Building better solutions together',
      icon: '🤝',
    },
  ];
}
