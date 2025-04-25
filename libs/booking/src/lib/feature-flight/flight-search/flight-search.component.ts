import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../api-boarding';
import { Flight, FlightFilter } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';
import { SIGNAL } from '@angular/core/primitives/signals';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);
  // private cdRef = inject(ChangeDetectorRef);

  protected filter = signal({
    from: 'London',
    to: 'New York',
    urgent: false
  });
  protected route = computed(
    () => 'From ' + this.filter().from + ' to ' + this.filter().to + '.'
  );
  protected basket: Record<number, boolean> = {
    3: true,
    5: true
  };
  protected flights: Flight[] = [];

  constructor() {
    effect(() => this.logRoute());

    effect(() => {
      this.filter();
      untracked(() => this.search());
    });

    console.log(this.filter().from);
    this.filter.update(curr => ({ ...curr, from: 'Barcelona' }));
    console.log(this.filter().from);
    // this.cdRef.detectChanges();
    this.filter.update(curr => ({ ...curr, from: 'Athens' }));
    console.log(this.filter().from);
    this.filter.update(curr => ({ ...curr, from: 'Madrid' }));
    console.log(this.filter().from);
    this.filter.update(curr => ({ ...curr, from: 'Oslo' }));
    console.log(this.filter().from);

    const counter = signal(0);
    const isEven = computed(() => counter() % 2 === 0);
    effect(() => console.log({
      counter: counter(),
      isEven: isEven()
    }));

    counter.update(curr => curr++);
  }

  logRoute(): void {
    console.log(this.route());
  }

  protected search(): void {
    if (!this.filter().from || !this.filter().to) {
      return;
    }

    this.flightService.find(
      this.filter().from, this.filter().to, this.filter().urgent
    ).subscribe(
      flights => this.flights = flights
    );
  }

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.flights = this.flights.map(
      flight => flight.id === newFlight.id ? newFlight : flight
    );
  }

  protected reset(): void {
    this.flights = [];
  }
}
