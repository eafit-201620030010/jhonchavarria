import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from 'src/app/_services/product.service';
import { of } from 'rxjs';

import { ListComponent } from './list.component';
import { Product } from 'src/app/_models/product';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [FormsModule],
      providers: [ProductService],
    }).compileComponents();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products successfully', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description for Product 1',
        logo: 'logo1.png',
        date_release: new Date('2024-01-01'),
        date_revision: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description for Product 2',
        logo: 'logo2.png',
        date_release: new Date('2024-02-01'),
        date_revision: new Date('2024-02-01'),
      },
    ];
    spyOn(productService, 'getProducts').and.returnValue(of(mockProducts));

    component.getProducts();

    expect(component.products).toEqual(mockProducts);
  });

  it('should delete product successfully', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description for Product 1',
      logo: 'logo1.png',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2024-01-01'),
    };

    spyOn(productService, 'deleteProduct').and.returnValue(of(null));
    spyOn(component, 'getProducts');

    component.deleteProduct(mockProduct.id);

    expect(productService.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    expect(component.getProducts).toHaveBeenCalled();
  });

  it('should go to the next page correctly', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should go to the previous page correctly', () => {
    component.currentPage = 3;
    component.prevPage();
    expect(component.currentPage).toBe(2);
  });
});
