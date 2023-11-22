import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})

export class CameraComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement> | undefined;
  video: HTMLVideoElement | undefined;

  originalWidth = 490;
    originalHeight = 380;

    // Calculate the center for rotation
    centerX = this.originalWidth / 2;
    centerY = this.originalHeight / 2;
  constructor() { }

  ngOnInit(): void {
    this.initCamera();
  }

  initCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser API navigator.mediaDevices.getUserMedia not available');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (this.videoElement) {
          this.video = this.videoElement.nativeElement;
          this.video.srcObject = stream;
          this.video.play();
        }
      })
      .catch(err => console.error('Error accessing camera: ', err));
  }
}
