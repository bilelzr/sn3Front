import { Injectable, signal } from '@angular/core';
import { Employee } from 'src/app/pages/apps/employee/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // @ts-ignore
  private employees = signal<Employee[]>(null);

  getEmployees() {
    return this.employees();
  }

  addEmployee(employee: Employee): void {
    employee.id = this.employees().length + 1;
    this.employees.update((employees) => [...employees, employee]);
  }

  updateEmployee(updatedEmployee: Employee): void {
    this.employees.update((employees) => {
      const index = employees.findIndex((e) => e.id === updatedEmployee.id);
      if (index !== -1) {
        employees[index] = updatedEmployee;
      }
      return [...employees];
    });
  }

  deleteEmployee(employeeId: number): void {
    this.employees.update((employees) =>
      employees.filter((e) => e.id !== employeeId)
    );
  }
}
