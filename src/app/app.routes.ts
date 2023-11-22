import { Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';

export const routes: Routes = [
    { path: 'camera', component: CameraComponent },
    { path: '', redirectTo: '/camera', pathMatch: 'full' }
];
