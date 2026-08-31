import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropertyComponent } from './edit-property.component';

describe('EditPropertyComponent', () => {
  let component: EditPropertyComponent;
  let fixture: ComponentFixture<EditPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPropertyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPropertyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
