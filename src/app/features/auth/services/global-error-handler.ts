import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from './snack-bar.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private zone: NgZone, private snackBarService: SnackbarService) { }

    handleError(error: any): void {
        if(error.error.message) {
            this.snackBarService.error(error.error.message[0].split('.0.')[1] + '. ')
        }
        // this.zone.run(() => {
        //   console.log('Global Error Handler:', error.message[0]);
        //   alert(error.message);
        // });
    }
}

// not using this component for now