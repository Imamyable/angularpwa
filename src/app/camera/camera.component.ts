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
  cameraInitStartTime: number = 0;
  cameraInitElapsedTime: number = 0;
  capturedImagesize: number = 0;
  imageHeight: number = 0;
  imageWidth: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only initialize the camera when in the browser
      this.initCamera();
    }
  }

  initCamera() {
    this.cameraInitStartTime = performance.now();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Browser API navigator.mediaDevices.getUserMedia not available');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 3840 }, height: { ideal: 2160 } } })
      .then(stream => {
        if (this.videoElement) {
          this.video = this.videoElement.nativeElement;
          this.video.srcObject = stream;
          this.video.play();
          this.cameraInitElapsedTime = performance.now() - this.cameraInitStartTime;
      console.log(`Camera initialized in ${this.cameraInitElapsedTime} milliseconds.`);
      

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
      this.imageHeight = this.video.videoHeight;
      this.imageWidth = this.video.videoWidth;
      console.log("dimensions:",  canvas.width, canvas.height);

      // Draw the current frame from the video onto the canvas
      ctx?.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL
      this.capturedImage = canvas.toDataURL('image/png');
      this.dataURLToBlob(this.capturedImage).then(blob => {
        this.capturedImagesize = blob.size /1000;
        console.log(`Captured image size: ${blob.size} bytes`);
      });
    }
  }
  dataURLToBlob(dataURL: string): Promise<Blob> {
    return fetch(dataURL).then(res => res.blob());
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
