import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Service {
  title: string;
  description: string;
  features: string[];
  color: string;
}

@Component({
  selector: 'app-services',
  imports: [RouterLink, CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  services: Service[] = [
    {
      title: 'Web Development',
      description:
        'Build fast, responsive, and scalable web applications with modern technologies.',
      features: [
        'Angular & TypeScript',
        'Progressive Web Apps',
        'Responsive Design',
        'Performance Optimization',
      ],
      color: 'blue',
    },
    {
      title: 'UI/UX Design',
      description:
        'Create beautiful and intuitive user interfaces that delight your users.',
      features: [
        'User Research',
        'Wireframing & Prototyping',
        'Visual Design',
        'Usability Testing',
      ],
      color: 'purple',
    },
    {
      title: 'Mobile Development',
      description:
        'Develop cross-platform mobile applications with native performance.',
      features: [
        'Ionic Framework',
        'iOS & Android',
        'Offline Support',
        'Push Notifications',
      ],
      color: 'pink',
    },
    {
      title: 'API Development',
      description:
        'Build robust and scalable RESTful and GraphQL APIs for your applications.',
      features: [
        'RESTful APIs',
        'GraphQL',
        'Authentication & Security',
        'Documentation',
      ],
      color: 'green',
    },
    {
      title: 'Cloud Services',
      description:
        'Deploy and manage your applications on modern cloud infrastructure.',
      features: [
        'AWS & Azure',
        'Docker & Kubernetes',
        'CI/CD Pipelines',
        'Monitoring & Logging',
      ],
      color: 'indigo',
    },
    {
      title: 'Consulting',
      description:
        'Get expert advice on architecture, best practices, and technology choices.',
      features: [
        'Technical Architecture',
        'Code Review',
        'Performance Audit',
        'Technology Strategy',
      ],
      color: 'yellow',
    },
  ];

  getColorClasses(color: string): { bg: string; text: string; hover: string } {
    const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
      blue: {
        bg: 'bg-blue-600',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-700',
      },
      purple: {
        bg: 'bg-purple-600',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-700',
      },
      pink: {
        bg: 'bg-pink-600',
        text: 'text-pink-600',
        hover: 'hover:bg-pink-700',
      },
      green: {
        bg: 'bg-green-600',
        text: 'text-green-600',
        hover: 'hover:bg-green-700',
      },
      indigo: {
        bg: 'bg-indigo-600',
        text: 'text-indigo-600',
        hover: 'hover:bg-indigo-700',
      },
      yellow: {
        bg: 'bg-yellow-600',
        text: 'text-yellow-600',
        hover: 'hover:bg-yellow-700',
      },
    };
    return colorMap[color];
  }
}
