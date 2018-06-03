import { Component, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HttpServiceService } from "../http-service.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent  {

  @Input() confirmLogOut: boolean = false;

  constructor(private httpService: HttpServiceService, public dialog: MatDialog) {}

  openDialog(): void {
  }

  toggleLog() {
    this.confirmLogOut = !this.confirmLogOut;
  }

  logout() {
    this.toggleLog(); 
    this.httpService.logout();
  }

}

