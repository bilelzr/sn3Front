export const RIPPLES_HTML_SNIPPET = `  <mat-checkbox [(ngModel)]="centered" class="example-ripple-checkbox" color="primary">Centered</mat-checkbox>
    <mat-checkbox [(ngModel)]="disabled" class="example-ripple-checkbox" color="primary">Disabled</mat-checkbox>
    <mat-checkbox [(ngModel)]="unbounded" class="example-ripple-checkbox" color="primary">Unbounded</mat-checkbox>
    <div>
      <mat-form-field class="example-ripple-form-field" appearance="outline">
        <mat-label>Radius</mat-label>
        <input matInput [(ngModel)]="radius" type="number" />
      </mat-form-field>
      <mat-form-field class="example-ripple-form-field" appearance="outline">
        <mat-label>Color</mat-label>
        <input matInput [(ngModel)]="color" type="text" />
      </mat-form-field>
    </div>
    <div class="example-ripple-container cardWithShadow" matRipple [matRippleCentered]="centered"
      [matRippleDisabled]="disabled" [matRippleUnbounded]="unbounded" [matRippleRadius]="radius"
      [matRippleColor]="color">
      Click me
    </div>
`;