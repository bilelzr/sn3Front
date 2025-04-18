export const DYNAMIC_TABLE_TS_SNIPPET = `  import { Component, OnInit } from '@angular/core';
    import { MatTableModule } from '@angular/material/table';
    import { CommonModule } from '@angular/common';
    import { MatButtonModule } from '@angular/material/button';
    import { MatDividerModule } from '@angular/material/divider';

    export interface PeriodicElement {
      name: string;
      position: number;
      weight: number;
      symbol: string;
    }

    const ELEMENT_DATA: PeriodicElement[] = [
      { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
      { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
      { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
      { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
      { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
      { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
      { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
      { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
      { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
      { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    ];

    /**
     * @title dynamic table */
     */
    @Component({
        selector: 'app-dynamic-table',
        imports: [MatTableModule, MatCardModule, CommonModule, MatButtonModule],
        templateUrl: './dynamic-table.component.html'
    })
    export class AppDynamicTableComponent {

      displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
        columnsToDisplay: string[] = this.displayedColumns.slice();
        data: PeriodicElement[] = ELEMENT_DATA;
      
        addColumn(): void {
          const randomColumn = Math.floor(
            Math.random() * this.displayedColumns.length
          );
          this.columnsToDisplay.push(this.displayedColumns[randomColumn]);
        }
      
        removeColumn(): void {
          if (this.columnsToDisplay.length) {
            this.columnsToDisplay.pop();
          }
        }
      
        shuffle(): void {
          let currentIndex = this.columnsToDisplay.length;
          while (0 !== currentIndex) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
      
            // Swap
            const temp = this.columnsToDisplay[currentIndex];
            this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
            this.columnsToDisplay[randomIndex] = temp;
          }
        }

    }
`;