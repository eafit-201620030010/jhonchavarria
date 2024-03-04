import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.productForm = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.minDateValidator()]],
      date_revision: ['', [Validators.required]],
    });

    this.productForm
      .get('date_release')
      ?.valueChanges.subscribe((dateRelease) => {
        const dateRevision = this.calculateDateRevision(dateRelease);

        this.productForm.get('date_revision')?.setValue(dateRevision);
      });
  }

  calculateDateRevision(dateRelease: string): string {
    const releaseDate = new Date(dateRelease);

    const oneYearLater = new Date(
      releaseDate.getUTCFullYear() + 1,
      releaseDate.getUTCMonth(),
      releaseDate.getUTCDate()
    );

    const formattedDateRevision = oneYearLater.toISOString().split('T')[0];

    return formattedDateRevision;
  }

  minDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      return selectedDate >= currentDate ? null : { minDate: true };
    };
  }

  createProduct(): void {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        this.resetForm();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error create product:', error);
      },
    });
  }

  verifyProduct(): void {
    const productId = this.productForm.get('id')?.value;

    this.productService.verifyProductExistence(productId).subscribe({
      next: (data: any) => {
        if (!data) {
          this.createProduct();
        } else {
          window.alert('El ID ya existe');
        }
      },
      error: (error) => {
        console.error('Error verify product:', error);
      },
    });
  }

  resetForm(): void {
    this.productForm.reset();
  }

  submitForm(): void {
    if (this.productForm.valid) {
      this.verifyProduct();
    } else {
      this.markFormTouched(this.productForm);
    }
  }

  markFormTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormTouched(control);
      }
    });
  }
}
