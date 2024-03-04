import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    const product: Product | null = history.state?.productData || null;

    if (!product) {
      this.router.navigate(['/']);
      return;
    }

    this.createForm();
  }

  createForm(): void {
    const product: Product | null = history.state?.productData || null;

    this.productForm = this.fb.group({
      id: [
        product?.id || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        product?.name || '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        product?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [product?.logo || '', Validators.required],
      date_release: [
        this.formatDate(new Date(product?.date_release || '')),
        [Validators.required, this.minDateValidator()],
      ],
      date_revision: [product?.date_revision || '', [Validators.required]],
    });

    this.productForm
      .get('date_release')
      ?.valueChanges.subscribe((dateRelease) => {
        const dateRevision = this.calculateDateRevision(dateRelease);
        this.productForm.get('date_revision')?.setValue(dateRevision);
      });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  updateProduct(): void {
    this.productService.updateProduct(this.productForm.value).subscribe({
      next: () => {
        this.resetForm();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error update product:', error);
      },
    });
  }

  resetForm(): void {
    this.productForm.reset();
  }

  submitForm(): void {
    if (this.productForm.valid) {
      this.updateProduct();
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
