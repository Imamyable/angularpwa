import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { CarLeftSvgMaskComponent } from './car-left-svg-mask/car-left-svg-mask.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CameraComponent, CarLeftSvgMaskComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  cameraInitStartTime: number = 0;
  title = 'camera-pwa';
  ngOnInit() {
    const currentTime = performance.now();
    this.cameraInitStartTime = currentTime;
  }
}
