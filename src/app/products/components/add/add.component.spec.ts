import { of } from 'rxjs';
import { AddComponent } from './add.component';
import { ProductService } from 'src/app/_services/product.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder, ProductService],
    }).compileComponents();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);

    spyOn(productService, 'verifyProductExistence').and.returnValue(of(false));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create product successfully', () => {
    const mockProduct = {
      id: '1',
      name: 'Product 1',
      description: 'Description for Product 1',
      logo: 'logo1.png',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2025-01-01'),
    };

    spyOn(productService, 'createProduct').and.returnValue(of(null));

    component.productForm.patchValue(mockProduct);

    component.createProduct();

    expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
  });

  it('should verify product existence and create product', () => {
    const mockProductId = '1';

    component.productForm.get('id')?.setValue(mockProductId);

    component.verifyProduct();

    expect(productService.verifyProductExistence).toHaveBeenCalledWith(
      mockProductId
    );
  });
});
