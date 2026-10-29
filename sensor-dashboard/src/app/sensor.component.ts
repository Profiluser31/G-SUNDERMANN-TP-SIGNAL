import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, catchError, finalize, of } from 'rxjs';

type SensorStatus = 'En attente' | 'Connecté' | 'Erreur' | 'Terminé' | 'Arrêté';

@Component({
  selector: 'app-sensor',
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.css',
})
export class SensorComponent {
  readonly sensor$ = new Observable<number>((observer) => {
    let readings = 0;
    const intervalId = setInterval(() => {
      const temperature = Math.random() * 60;

      if (temperature > 50) {
        clearInterval(intervalId);
        observer.error(new Error('Sonde en surchauffe'));
        return;
      }

      observer.next(temperature);
      readings += 1;

      if (readings === 5) {
        clearInterval(intervalId);
        observer.complete();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  });

  sensorData$: Observable<number | null> | null = null;
  status: SensorStatus = 'En attente';
  errorMessage: string | null = null;

  private stopRequested = false;

  startSensor(): void {
    if (this.status === 'Connecté') {
      return;
    }

    this.stopRequested = false;
    this.errorMessage = null;
    this.status = 'Connecté';
    this.sensorData$ = this.sensor$.pipe(
      catchError((error: unknown) => {
        this.status = 'Erreur';
        this.errorMessage = error instanceof Error ? error.message : String(error);
        return of(null);
      }),
      finalize(() => {
        if (this.status !== 'Erreur') {
          this.status = this.stopRequested ? 'Arrêté' : 'Terminé';
        }
      }),
    );
  }

  stopSensor(): void {
    if (this.sensorData$ === null) {
      return;
    }

    this.stopRequested = true;
    this.status = 'Arrêté';
    this.sensorData$ = null;
  }
}
