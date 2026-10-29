import { Component } from '@angular/core';
import { SensorComponent } from './sensor.component';

@Component({
  imports: [SensorComponent],
  selector: 'app-root',
  template: '<app-sensor />',
})
export class App {}
