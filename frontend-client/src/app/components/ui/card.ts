import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() hover = false;

  get cardClasses(): string {
    const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden';
    const hoverStyles = this.hover
      ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1'
      : '';
    return `${baseStyles} ${hoverStyles}`;
  }
}

@Component({
  selector: 'app-card-header',
  imports: [CommonModule],
  template: `
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <ng-content />
    </div>
  `,
})
export class CardHeaderComponent {}

@Component({
  selector: 'app-card-content',
  imports: [CommonModule],
  template: `
    <div class="px-6 py-4">
      <ng-content />
    </div>
  `,
})
export class CardContentComponent {}

@Component({
  selector: 'app-card-footer',
  imports: [CommonModule],
  template: `
    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <ng-content />
    </div>
  `,
})
export class CardFooterComponent {}
