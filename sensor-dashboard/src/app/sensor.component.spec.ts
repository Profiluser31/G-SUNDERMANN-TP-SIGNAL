import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SensorComponent } from './sensor.component';

describe('SensorComponent', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('emits five valid readings and completes the cycle', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const component = TestBed.createComponent(SensorComponent).componentInstance;
    const readings: number[] = [];
    const errors: unknown[] = [];
    let completed = false;

    component.sensor$.subscribe({
      next: (temperature) => readings.push(temperature),
      error: (error: unknown) => errors.push(error),
      complete: () => (completed = true),
    });

    vi.advanceTimersByTime(5000);

    expect(readings).toEqual([30, 30, 30, 30, 30]);
    expect(errors).toEqual([]);
    expect(completed).toBe(true);
  });

  it('reports overheating and stops the interval', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const component = TestBed.createComponent(SensorComponent).componentInstance;
    const errorHandler = vi.fn();

    component.sensor$.subscribe({ error: errorHandler });
    vi.advanceTimersByTime(1000);
    vi.advanceTimersByTime(5000);

    expect(errorHandler).toHaveBeenCalledOnce();
    expect(errorHandler.mock.calls[0][0].message).toBe('Sonde en surchauffe');
  });

  it('shows the overheating error in the view', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const fixture = TestBed.createComponent(SensorComponent);
    fixture.componentInstance.startSensor();
    fixture.detectChanges();

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(fixture.componentInstance.status).toBe('Erreur');
    expect(fixture.nativeElement.textContent).toContain('Sonde en surchauffe');
    fixture.destroy();
  });

  it('uses the AsyncPipe to stop the sensor when the user cancels', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const fixture = TestBed.createComponent(SensorComponent);
    fixture.componentInstance.startSensor();
    const stream = fixture.componentInstance.sensorData$!;
    const subscribeSpy = vi.spyOn(stream, 'subscribe');
    fixture.detectChanges();

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toMatch(/30[.,]0/);
    const subscription = subscribeSpy.mock.results[0].value;

    fixture.nativeElement.querySelector('.stop-button').click();
    fixture.detectChanges();

    expect(subscription.closed).toBe(true);
    expect(fixture.componentInstance.status).toBe('Arrêté');
    expect(fixture.nativeElement.textContent).toContain('Écoute interrompue manuellement');
    fixture.destroy();
  });
});
