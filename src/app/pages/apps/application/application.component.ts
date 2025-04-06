import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild,} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {AppAddApplicationComponent} from './add/add.component';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material.module';
import {TablerIconsModule} from 'angular-tabler-icons';
import {EmployeeService} from 'src/app/services/apps/employee/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from "../../../services/models/user";
import {Observable} from "rxjs";
import {Application} from "../../../services/models/application";
import {ApplicationService} from "../../../services/apps/application/application.service";

@Component({
  selector: 'app-user',
  templateUrl: './application.component.html',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
  ],
})
export class AppApplicationComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable, {static: true}) table: MatTable<any> =
    Object.create(null);

  searchText: any;

  displayedColumns: string[] = [
    'name',
    'Description',
    'action',
    'CreationDate'
  ];

  dataSource = new MatTableDataSource<User>([]);
  applications: Application[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private applicationService: ApplicationService,
  ) {
  }

  ngOnInit(): void {
    this.loadAllApplication();
  }

  loadAllApplication(): void {
    this.applicationService.findAllApp().subscribe(
      (response: Application[]) => {
        this.applications = response;
        this.dataSource.data = this.applications; // ✅ Correct way to update MatTableDataSource
        this.dataSource = new MatTableDataSource(this.applications); // ✅ Ensuring table update
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }


  /*  async getUserByEmail(userEmail: string): Promise<void> {

      this.userService.getUserByEmail(userEmail).subscribe(
        (response: User) => {
          this.user = response;
          sessionStorage.setItem('userRole', response.role?.toString() ?? '');
          sessionStorage.setItem('userEmail', userEmail);
        },
        (error) => {
          console.error('restoring module error', error);
        }
      );
    }*/

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, user: User | any): void {
    const dialogRef = this.dialog.open(AppApplicationDialogContentComponent, {
      data: {action, user}, autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadAllApplication()
      this.dataSource.data = this.applications;
      if (result && result.event === 'Refresh') {
        this.loadAllApplication(); // Refresh the employee list if necessary
      }
    });
  }
}

interface DialogData {
  action: string;
  application: Application;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: 'application-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppApplicationDialogContentComponent {
  action: string | any;
  // tslint:disable-next-line - Disables all
  application: Application;
  selectedImage: any = '';
  groupes: string[] = ['RDP', 'INGENIEUR', 'ADMIN'];
  joiningDate = new FormControl();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppApplicationDialogContentComponent>,
    private snackBar: MatSnackBar,
    private applicationService: ApplicationService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.action = data.action;
    this.application = {...data.application};

    /*    this.joiningDate = new FormControl();

        if (this.user.DateOfJoining) {
          this.joiningDate.setValue(
            new Date(this.user.DateOfJoining).toISOString().split('T')[0]
          ); //  existing date
        } else {
          // Set to today's date if no existing date is available
          this.joiningDate.setValue(new Date().toISOString().split('T')[0]);
        }*/

    // Set default image path if not already set
    /*    if (!this.local_data.imagePath) {
          this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
        }*/
  }

  doAction(): void {

    if (this.action === 'Add') {
      console.log(this.application)
      this.saveApplication(this.application).subscribe(
        (createdApp: Application) => {
          console.log("Application created successfully:", createdApp);
          // Close the dialog only after user creation
          this.dialogRef.close();
          // Open success dialog
          const successDialogRef = this.dialog.open(AppAddApplicationComponent);
          successDialogRef.afterClosed().subscribe(() => {
            this.dialogRef.close({event: 'Refresh'});
            this.openSnackBar('Application Added successfully!', 'Close');
          });
        },
        (error: any) => {
          console.error("Error creating user:", error);
          this.openSnackBar('Failed to add application!', 'Close');
        }
      );

    }//TODO : finish the update low priority
    /* else if (this.action === 'Update') {
      this.employeeService.updateEmployee(this.user);
      this.dialogRef.close({ event: 'Update' });
      this.openSnackBar('Employee Updated successfully!', 'Close');
    }*/ /*else if (this.action === 'Delete' && this.application.uuid) {
      this.userService.deleteUser(this.user.uuid).subscribe(
        () => {
          // Only close the dialog and show the snackbar after deletion succeeds
          this.dialogRef.close({event: 'Delete'});
          this.openSnackBar('User Deleted successfully!', 'Close');
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.openSnackBar('Failed to delete user!', 'Close');
        }
      );
    }*/
  }

  saveApplication(application: Application): Observable<Application> {
    return this.applicationService.addApplication(application);
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

}
