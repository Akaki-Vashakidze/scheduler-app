import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invitation-dialog',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './invitation-dialog.component.html',
  styleUrl: './invitation-dialog.component.scss'
})
export class InvitationDIalogComponent {
  constructor(
    public dialogRef: MatDialogRef<InvitationDIalogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({ confirmed: true });
  }
}
