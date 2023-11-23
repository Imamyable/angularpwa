import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarLeftSvgMaskComponent } from '../car-left-svg-mask/car-left-svg-mask.component';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, CarLeftSvgMaskComponent],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})

export class CameraComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement> | undefined;
  video!: HTMLVideoElement | undefined;
  capturedImage: string | null = null; 

  originalWidth = 490;
    originalHeight = 380;

    // Calculate the center for rotation
    centerX = this.originalWidth / 2;
    centerY = this.originalHeight / 2;
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only initialize the camera when in the browser
      this.initCamera();
    }
  }

  initCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser API navigator.mediaDevices.getUserMedia not available');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (this.videoElement) {
          this.video = this.videoElement.nativeElement;
          this.video.srcObject = stream;
          this.video.play();
        }
      })
      .catch(err => console.error('Error accessing camera: ', err));
  }
  capture() {
    console.log("Image captured");
    const canvas = document.createElement('canvas'); 
    if(this.video){
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      const ctx = canvas.getContext('2d');

      // Draw the current frame from the video onto the canvas
      ctx?.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL
      this.capturedImage = canvas.toDataURL('image/png');
      
      // Optional: Display the captured image
      // You can also download or send this image to a server
    }
  }

  acceptPhoto() {
    console.log("Photo accepted");
    // Additional logic for what happens when the photo is accepted
    // For example, navigating to another page or saving the image
  }

  retakePhoto() {
    console.log("Retaking photo");
    this.capturedImage = null; // Clear the captured image
    this.initCamera(); // Reinitialize the camera
  }
}
