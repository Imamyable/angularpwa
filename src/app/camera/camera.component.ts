import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarLeftSvgMaskComponent } from '../car-left-svg-mask/car-left-svg-mask.component';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, CarLeftSvgMaskComponent],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent implements OnInit {
  @ViewChild('videoElement') videoElement:
    | ElementRef<HTMLVideoElement>
    | undefined;
  video!: HTMLVideoElement | undefined;
  capturedImage: string | null = null;
  cameraInitStartTime: number = 0;
  cameraInitElapsedTime: number = 0;
  cameraReloadStartTime: number = 0;
  cameraReloadElapsedTime: number = 0;
  cameraCaptureStartTime: number = 0;
  cameraCaptureElapsedTime: number = 0;
  capturedImagesize: number = 0;
  imageHeight: number = 0;
  imageWidth: number = 0;
  isFirstInitialization: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only initialize the camera when in the browser
      this.initCamera();
    }
  }

  async initCamera() {
    const currentTime = performance.now();
    if (this.isFirstInitialization) {
      this.cameraInitStartTime = currentTime;
      this.isFirstInitialization = false;
    } else {
      this.cameraReloadStartTime = currentTime;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      );
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'environment',
          height: { exact: 1920 }, 
          width: { ideal: 1080 },   
          aspectRatio:  0.5625

        },
      })
      .then((stream) => {
        const settings = stream.getVideoTracks()[0].getSettings();
        console.log('Camera settings:', settings);
        if (this.videoElement) {
          this.video = this.videoElement.nativeElement;
          this.video.srcObject = stream;
          this.video.play();
          const elapsedTime = performance.now() - currentTime;
          if (this.cameraInitStartTime === currentTime) {
            this.cameraInitElapsedTime = elapsedTime;
            console.log(
              `First camera initialization in ${this.cameraInitElapsedTime} milliseconds.`
            );
          } else {
            this.cameraReloadElapsedTime = elapsedTime;
            console.log(`Camera reinitialized in ${this.cameraReloadElapsedTime} milliseconds.`);

          }
        }
      })
      .catch((err) => console.error('Error accessing camera: ', err));
  }
  capture() {
    this.cameraCaptureStartTime = performance.now();
    console.log('Image captured');
    const canvas = document.createElement('canvas');
    if (this.video) {
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      const ctx = canvas.getContext('2d');
      this.imageHeight = this.video.videoHeight;
      this.imageWidth = this.video.videoWidth;
      console.log('dimensions:', canvas.width, canvas.height);

      // Draw the current frame from the video onto the canvas
      ctx?.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL
      this.capturedImage = canvas.toDataURL('image/png');
      this.dataURLToBlob(this.capturedImage).then((blob) => {
        this.capturedImagesize = blob.size / 1000;
        console.log(`Captured image size: ${blob.size} bytes`);
      });

      this.cameraCaptureElapsedTime =
        performance.now() - this.cameraCaptureStartTime;
    }
  }
  dataURLToBlob(dataURL: string): Promise<Blob> {
    return fetch(dataURL).then((res) => res.blob());
  }

  acceptPhoto() {
    console.log('Photo accepted');
    // Additional logic for what happens when the photo is accepted
    // For example, navigating to another page or saving the image
  }

  retakePhoto() {
    console.log('Retaking photo');
    this.capturedImage = null; // Clear the captured image
    this.initCamera(); // Reinitialize the camera
  }
}
