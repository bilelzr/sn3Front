import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit, OnInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddApplicationComponent } from './add/add.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Employee } from 'src/app/pages/apps/employee/employee';
import { EmployeeService } from 'src/app/services/apps/employee/employee.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserService} from "../../../services/apps/user/user.service";
import {User} from "../../../services/models/user";
import {Observable} from "rxjs";
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
export class AppApplicationComponent implements AfterViewInit,OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);

  searchText: any;

  displayedColumns: string[] = [
    '#',
    'name',
    'email',
    'mobile',
    'date of joining',
    'salary',
    'projects',
    'action',
  ];

  dataSource = new MatTableDataSource<User>([]);
  users: User[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.userService.findAllUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        this.dataSource.data = this.users; // ✅ Correct way to update MatTableDataSource
        this.dataSource = new MatTableDataSource(this.users); // ✅ Ensuring table update
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
      data: { action, user }, autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadAllUsers()
      this.dataSource.data = this.users;
      if (result && result.event === 'Refresh') {
        this.loadAllUsers(); // Refresh the employee list if necessary
      }
    });
  }
}

interface DialogData {
  action: string;
  user: User;
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
  user: User;
  selectedImage: any = '';
  roles: string[] = ['RDP', 'INGENIEUR', 'ADMIN'];
  joiningDate = new FormControl();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppApplicationDialogContentComponent>,
    private userService : UserService,
    private snackBar: MatSnackBar,

    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.action = data.action;
    this.user = { ...data.user };

    this.joiningDate = new FormControl();

    if (this.user.DateOfJoining) {
      this.joiningDate.setValue(
        new Date(this.user.DateOfJoining).toISOString().split('T')[0]
      ); //  existing date
    } else {
      // Set to today's date if no existing date is available
      this.joiningDate.setValue(new Date().toISOString().split('T')[0]);
    }

    // Set default image path if not already set
/*    if (!this.local_data.imagePath) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }*/
  }

  doAction(): void {
    this.user.DateOfJoining = this.joiningDate.value;

    if (this.action === 'Add') {
      console.log(this.user)
      this.saveUser(this.user).subscribe(
        (createdUser: User) => {
          console.log("User created successfully:", createdUser);
          // Close the dialog only after user creation
          this.dialogRef.close();
          // Open success dialog
          const successDialogRef = this.dialog.open(AppAddApplicationComponent);
          successDialogRef.afterClosed().subscribe(() => {
            this.dialogRef.close({ event: 'Refresh' });
            this.openSnackBar('User Added successfully!', 'Close');
          });
        },
        (error: any) => {
          console.error("Error creating user:", error);
          this.openSnackBar('Failed to add user!', 'Close');
        }
      );

    }//TODO : finish the update low priority
    /* else if (this.action === 'Update') {
      this.employeeService.updateEmployee(this.user);
      this.dialogRef.close({ event: 'Update' });
      this.openSnackBar('Employee Updated successfully!', 'Close');
    }*/ else if (this.action === 'Delete' && this.user.uuid) {
      this.userService.deleteUser(this.user.uuid).subscribe(
        () => {
          // Only close the dialog and show the snackbar after deletion succeeds
          this.dialogRef.close({ event: 'Delete' });
          this.openSnackBar('User Deleted successfully!', 'Close');
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.openSnackBar('Failed to delete user!', 'Close');
        }
      );
    }
  }

  saveUser(user: User): Observable<User> {
    return this.userService.createUser(user);
  }





  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return; // No file selected
    }

    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return; // Not an image file
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      if (typeof reader.result === 'string') {
        this.user.imagePath = reader.result; // Set selected image path
      }
    };
  }
}
