import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePropertyComponent } from './create-property';

describe('CreatePropertyComponent', () => {
  let component: CreatePropertyComponent;
  let fixture: ComponentFixture<CreatePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePropertyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePropertyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
