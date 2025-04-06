import {AfterViewInit, Component, Inject, OnInit, Optional, ViewChild,} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {AppAddGroupComponent} from './add/add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material.module';
import {TablerIconsModule} from 'angular-tabler-icons';
import {EmployeeService} from 'src/app/services/apps/employee/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from "rxjs";
import {Group} from "../../../services/models/group";
import {GroupService} from "../../../services/apps/Group/group.service";

@Component({
  selector: 'app-user',
  templateUrl: './group.component.html',
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
  ],
})
export class AppGroupComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable, {static: true}) table: MatTable<any> =
    Object.create(null);

  searchText: any;

  displayedColumns: string[] = [
    'name',
    'CreationDate',
    'action'
  ];

  dataSource = new MatTableDataSource<Group>([]);
  groups: Group[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator =
    Object.create(null);

  constructor(
    public dialog: MatDialog,
    private employeeService: EmployeeService,
    private groupService: GroupService,
  ) {
  }

  ngOnInit(): void {
    this.loadAllGroups();
  }

  loadAllGroups(): void {
    this.groupService.findAllGroups().subscribe(
      (response: Group[]) => {
        this.groups = response;
        this.dataSource.data = this.groups; // ✅ Correct way to update MatTableDataSource
        this.dataSource = new MatTableDataSource(this.groups); // ✅ Ensuring table update
      },
      (error) => {
        console.error("Error fetching Group:", error);
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

  openDialog(action: string, group: Group | any): void {
    const dialogRef = this.dialog.open(AppGroupDialogContentComponent, {
      data: {action, group}, autoFocus: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadAllGroups()
      this.dataSource.data = this.groups;
      if (result && result.event === 'Refresh') {
        this.loadAllGroups(); // Refresh the employee list if necessary
      }
    });
  }
}

interface DialogData {
  action: string;
  group: Group;
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
  templateUrl: 'group-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppGroupDialogContentComponent {
  action: string | any;
  // tslint:disable-next-line - Disables all
  group: Group;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppGroupDialogContentComponent>,
    private snackBar: MatSnackBar,
    private groupService: GroupService,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.action = data.action;
    this.group = {...data.group};

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
      this.saveGroup(this.group).subscribe(
        (createdGroup: Group) => {
          console.log("Group created successfully:", createdGroup);
          // Close the dialog only after user creation
          this.dialogRef.close();
          // Open success dialog
          const successDialogRef = this.dialog.open(AppAddGroupComponent);
          successDialogRef.afterClosed().subscribe(() => {
            this.dialogRef.close({event: 'Refresh'});
            this.openSnackBar('Group Added successfully!', 'Close');
          });
        },
        (error: any) => {
          console.error("Error creating user:", error);
          this.openSnackBar('Failed to add Group!', 'Close');
        }
      );

    }//TODO : finish the update low priority
    /* else if (this.action === 'Update') {
      this.employeeService.updateEmployee(this.user);
      this.dialogRef.close({ event: 'Update' });
      this.openSnackBar('Employee Updated successfully!', 'Close');
    }*/ else if (this.action === 'Delete' && this.group.groupName) {
      this.groupService.deleteGroup(this.group.groupName).subscribe(
        () => {
          // Only close the dialog and show the snackbar after deletion succeeds
          this.dialogRef.close({event: 'Delete'});
          this.openSnackBar('group Deleted successfully!', 'Close');
        },
        (error) => {
          console.error('Error deleting group:', error);
          this.openSnackBar('Failed to delete group!', 'Close');
        }
      );
    }
  }

  saveGroup(group: Group): Observable<Group> {
    return this.groupService.addGroup(group);
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
