import { NgIf } from '@angular/common';
import { Component, effect, inject, input, numberAttribute } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';
import { validatePassengerStatus } from '../../util-validation';
import { httpResource } from '@angular/common/http';
import { initialPassenger } from '../../logic-passenger';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  private passengerService = inject(PassengerService);

  id = input(0, { transform: numberAttribute });
  passengerResource = httpResource(() => ({
      url: 'https://demo.angulararchitects.io/api/passenger',
      params: {
        id: this.id()
      }
    }), { defaultValue: initialPassenger }
  );

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: ['Initial'],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      validatePassengerStatus(['A', 'B', 'C'])
    ]]
  });

  constructor() {
    effect(() => {
      const passenger = this.passengerResource.value();

      if (passenger) {
        this.editForm.patchValue(passenger);
      }
    });
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
