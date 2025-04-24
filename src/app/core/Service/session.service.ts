import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, interval, merge, fromEvent, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private sessionSeconds = 0;
  private activeSeconds = 0;

  private idleTimer: any;
  private idleThreshold = 120000; 

  private sessionInterval?: Subscription;
  private activeInterval?: Subscription;
  private activitySub?: Subscription;

  sessionTime$ = new BehaviorSubject('00:00:00');
  activeTime$ = new BehaviorSubject('00:00:00');
  isIdle$ = new BehaviorSubject(false);

  constructor(private zone: NgZone) {}

  startSession() {
    this.startSessionTimer();
    this.startTrackingActivity();
    this.startActiveTimer();
  }

  private startSessionTimer() {
    this.zone.runOutsideAngular(() => {
      this.sessionInterval = interval(1000).subscribe(() => {
        this.sessionSeconds++;
        this.sessionTime$.next(this.format(this.sessionSeconds));
      });
    });
  }

  private startActiveTimer() {
    this.stopActiveTimer(); 
    this.activeInterval = interval(1000).subscribe(() => {
      this.activeSeconds++;
      this.activeTime$.next(this.format(this.activeSeconds));
    });
  }

  private stopActiveTimer() {
    this.activeInterval?.unsubscribe();
  }

  private startTrackingActivity() {
    const activity$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll')
    );

    this.activitySub = activity$.subscribe(() => {
      if (this.isIdle$.value) this.resume(); 
      this.resetIdleTimer();
    });

    this.resetIdleTimer(); 
  }

  private resetIdleTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.isIdle$.next(true);
      this.stopActiveTimer();
    }, this.idleThreshold);
  }

  resume() {
    this.isIdle$.next(false);
    this.activeSeconds = 0;
    this.activeTime$.next('00:00:00');
    this.startActiveTimer();
    this.resetIdleTimer();
  }

  stop() {
    this.sessionInterval?.unsubscribe();
    this.activeInterval?.unsubscribe();
    this.activitySub?.unsubscribe();
    clearTimeout(this.idleTimer);
  
    this.sessionSeconds = 0;
    this.activeSeconds = 0;
  
    this.sessionTime$.next('00:00:00');
    this.activeTime$.next('00:00:00');
    this.isIdle$.next(false);
  }
  

  private format(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}


