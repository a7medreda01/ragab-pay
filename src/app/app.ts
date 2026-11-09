import { Component } from '@angular/core';
import { DeviceShellComponent } from './components/device-shell/device-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DeviceShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
