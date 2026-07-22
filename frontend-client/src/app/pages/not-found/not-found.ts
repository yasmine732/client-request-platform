import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Home, ArrowLeft } from 'lucide-angular';
import { ButtonComponent } from '../../components/ui/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonComponent, LucideAngularModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFoundComponent {
  readonly Home = Home;
  readonly ArrowLeft = ArrowLeft;

  goBack(): void {
    window.history.back();
  }
}
