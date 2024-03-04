import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/_models/product';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products?: Product[];

  filteredProducts: Product[] = [];
  filterText = '';

  paginatedProducts: Product[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;

  showDeleteConfirmationModal = false;
  productIdToDelete: string = '';
  productNameDelete: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.products = this.filteredProducts = data;
        this.filterProducts();
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  deleteProduct(id: string): void {
    this.closeDeleteConfirmationModal();
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.getProducts();
      },
      error: (error) => {
        console.error('Error delete products:', error);
        this.getProducts();
      },
    });
  }

  editProduct(product: Product): void {
    this.router.navigate(['/edit', product.id], {
      state: { productData: product },
    });
  }

  openDeleteConfirmationModal(productId: string, productName: string): void {
    this.productIdToDelete = productId;
    this.productNameDelete = productName;
    this.showDeleteConfirmationModal = true;
  }

  closeDeleteConfirmationModal(): void {
    this.showDeleteConfirmationModal = false;
  }

  filterProducts(): void {
    this.filteredProducts = this.products!.filter((product) => {
      return (
        product.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(this.filterText.toLowerCase())
      );
    });

    this.totalPages = Math.ceil(
      this.filteredProducts.length / this.itemsPerPage
    );

    this.updatePaginatedProducts();
  }

  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }
}
