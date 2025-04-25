import { inject } from "@angular/core"
import { Store } from "@ngrx/store"
import { ticketActions } from "./actions";
import { ticketFeature } from "./reducer";
import { FlightFilter } from "../model/flight-filter";
import { Flight } from "../model/flight";
import { BookingStore } from "./booking.store";


export function injectTicketsFacade() {
  const store = inject(Store);
  const bookingStore = inject(BookingStore);

  return {
    flights: store.selectSignal(ticketFeature.selectFlights),
    flights$: store.select(ticketFeature.selectFlights),
    search: (filter: FlightFilter) =>
      store.dispatch(ticketActions.flightsLoad(filter)),
    update: (flight: Flight) =>
      store.dispatch(ticketActions.flightUpdate({ flight })),
    reset: () =>
      store.dispatch(ticketActions.flightsClear())
  };
}
