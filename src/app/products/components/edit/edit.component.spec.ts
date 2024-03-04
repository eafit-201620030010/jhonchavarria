import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductService } from 'src/app/_services/product.service';
import { EditComponent } from './edit.component';
import { of } from 'rxjs';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [FormBuilder, ProductService],
    }).compileComponents();

    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update product successfully', () => {
    const mockProduct = {
      id: '1',
      name: 'Product 1',
      description: 'Description for Product 1',
      logo: 'logo1.png',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2025-01-01'),
    };

    component.productForm.patchValue(mockProduct);

    spyOn(productService, 'updateProduct').and.returnValue(of(null));

    component.updateProduct();

    expect(productService.updateProduct).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: '1',
        name: 'Product 1',
        description: 'Description for Product 1',
        logo: 'logo1.png',
        date_revision: new Date('2025-01-01'),
      })
    );
  });
});
