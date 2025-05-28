// university.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class ApplicationDataService {
    private applicationData = new BehaviorSubject<any>({});
    currentData = this.applicationData.asObservable();

    setApplicationData(data: any) {
        // Get current value
        const currentValue = this.applicationData.getValue();
        // Merge new data with existing data
        const newValue = {...currentValue, ...data};
        this.applicationData.next(newValue);
    }
}