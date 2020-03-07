import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  const dialogMock = {
    close: () => { }
   };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock},
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.get(MatDialogRef);
    spyOn(dialogRef,'close').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with true return', () => {
    component.onYesClick();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false return', () => {
    component.onNoClick();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
