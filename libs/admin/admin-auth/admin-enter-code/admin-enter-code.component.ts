import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-enter-code',
  templateUrl: './admin-enter-code.component.html',
  styleUrls: ['./admin-enter-code.component.scss']
})
export class AdminEnterCodeComponent {

  moveToNext(event: any, nextInputId: string) {
    const input = event.target;

    if (input.value.length === 1) {
      if (nextInputId) {
        const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  onKeyDown(event: KeyboardEvent, currentInputId: string) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && input.value.length === 0) {
      const previousInputId = this.getPreviousInputId(currentInputId);
      if (previousInputId) {
        const previousInput = document.getElementById(previousInputId) as HTMLInputElement;
        if (previousInput) {
          previousInput.focus();
        }
      }
    }
  }

  getPreviousInputId(currentInputId: string): string | null {
    const inputNumber = parseInt(currentInputId.replace('input', ''), 10);
    if (inputNumber > 1) {
      return `input${inputNumber - 1}`;
    }
    return null;
  }
}