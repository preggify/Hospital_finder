import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HospitalService } from '../../services/hospital.service';
import { Hospital } from '../../models/hospital.model';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class HospitalListComponent implements OnInit {
  hospitals: Record<string, Hospital[]> = {};
  statesList: string[] = [];
  isLoading = true;
  errorMessage = '';
  showAdvancedFilters = false;

  // Helper method for template
  isNaN = Number.isNaN;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10; // Number of hospitals per page
  totalStates: number = 0;
  totalHospitals: number = 0;
  totalPages: number = 0;

  // Filter properties
  filterState: string = '';
  filterType: string = '';
  filterServices: string[] = [];
  filterMinCost: number | null = null;
  filterMaxCost: number | null = null;
  searchQuery: string = '';

  // Available filter options
  availableTypes: string[] = ['Public', 'Private', 'Teaching'];
  availableServices: string[] = [
    'General Checkup',
    'Maternity',
    'Pediatrics',
    'Emergency',
    'Surgery',
    'Oncology',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology'
  ];

  // Search debouncing
  private searchSubject = new Subject<string>();

  constructor(private hospitalService: HospitalService) {
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.quickSearch();
    });
  }

    ngOnInit(): void {
    // Set default values that will be shown until we get actual data
    this.totalStates = 36;
    this.totalHospitals = 150;

    // Get stats including total hospitals and states
    this.hospitalService.getStats().subscribe(
      (stats) => {
        if (stats) {
          // Force numeric conversion with Number and provide fallbacks
          const numHospitals = Number(stats.totalHospitals);
          const numStates = Number(stats.totalStates);

          // Only update if we got valid numbers
          if (!isNaN(numHospitals) && numHospitals > 0) {
            this.totalHospitals = numHospitals;
          }

          if (!isNaN(numStates) && numStates > 0) {
            this.totalStates = numStates;
            // Update pagination based on states
            this.totalPages = Math.ceil(this.totalStates / this.itemsPerPage);
          }
        }

        this.loadHospitals();
      },
      (error) => {
        // Still try to load hospitals even if stats fails
        this.loadHospitals();
      }
    );
  }

  loadHospitals(): void {
    this.isLoading = true;
    this.hospitalService.getHospitals(this.currentPage, this.itemsPerPage).subscribe(
      (result: any) => {
        this.hospitals = result;
        this.statesList = Object.keys(result).filter(key => key !== '_pagination').sort();

        // Get pagination metadata if available
        if (result._pagination) {
          this.currentPage = result._pagination.page;
          this.totalPages = result._pagination.totalPages;
          this.itemsPerPage = result._pagination.limit;
        }

        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading hospitals. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  applyFilters(): void {
    const filters: any = {};

    if (this.filterState) {
      filters.state = this.filterState;
    }

    if (this.filterType) {
      filters.type = this.filterType;
    }

    if (this.filterServices && this.filterServices.length > 0) {
      filters.services = this.filterServices;
    }

    if (this.filterMinCost !== null) {
      filters.minCost = this.filterMinCost;
    }

    if (this.filterMaxCost !== null) {
      filters.maxCost = this.filterMaxCost;
    }

    if (this.searchQuery.trim()) {
      filters.query = this.searchQuery.trim();
    }

    // Only make API call if we have at least one filter
    if (Object.keys(filters).length > 0) {
      this.performSearch(filters);
    } else {
      // If no filters, load all hospitals
      this.loadHospitals();
    }
  }

  resetFilters(): void {
    this.filterState = '';
    this.filterType = '';
    this.filterServices = [];
    this.filterMinCost = null;
    this.filterMaxCost = null;
    this.searchQuery = '';
    this.currentPage = 1; // Reset to first page when filters are cleared
    this.loadHospitals();
  }

  // Toggle advanced filters visibility
  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Check if any filter is active
  hasActiveFilters(): boolean {
    return (
      this.searchQuery.trim() !== '' ||
      this.filterState !== '' ||
      this.filterType !== '' ||
      this.filterServices.length > 0 ||
      this.filterMinCost !== null ||
      this.filterMaxCost !== null
    );
  }

  // Get count of active filters for badge display
  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim() !== '') count++;
    if (this.filterState !== '') count++;
    if (this.filterType !== '') count++;
    if (this.filterServices.length > 0) count++;
    if (this.filterMinCost !== null || this.filterMaxCost !== null) count++;
    return count;
  }

  // Handle individual filter removals
  removeStateFilter(): void {
    this.filterState = '';
    this.applyFilters();
  }

  removeTypeFilter(): void {
    this.filterType = '';
    this.applyFilters();
  }

  removeServiceFilters(): void {
    this.filterServices = [];
    this.applyFilters();
  }

  removeCostFilters(): void {
    this.filterMinCost = null;
    this.filterMaxCost = null;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  // Toggle service selection with one-click
  toggleServiceFilter(service: string): void {
    const index = this.filterServices.indexOf(service);
    if (index > -1) {
      this.filterServices.splice(index, 1);
    } else {
      this.filterServices.push(service);
    }
    this.onFilterChange();
  }

  // Handle search input changes with debouncing
  onSearchInputChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  // Auto-apply filters when they change
  onFilterChange(): void {
    // Add a small delay to avoid too many API calls while typing
    setTimeout(() => this.applyFilters(), 300);
  }

  // Quick search without opening advanced filters
  quickSearch(): void {
    if (this.searchQuery.trim()) {
      const filters: any = {
        query: this.searchQuery.trim()
      };
      this.performSearch(filters);
    } else {
      this.loadHospitals();
    }
  }

  // Helper method for searching to avoid code duplication
  private performSearch(filters: any): void {
    this.isLoading = true;
    this.hospitalService.searchHospitals(filters).subscribe(
      (results) => {
        // Group results by state
        const groupedResults: Record<string, Hospital[]> = {};

        results.forEach(hospital => {
          if (!groupedResults[hospital.state]) {
            groupedResults[hospital.state] = [];
          }
          groupedResults[hospital.state].push(hospital);
        });

        this.hospitals = groupedResults;
        this.statesList = Object.keys(groupedResults).sort();
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error applying filters. Please try again.';
        this.isLoading = false;
      }
    );
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadHospitals();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadHospitals();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadHospitals();
    }
  }

  // Generate an array of page numbers for pagination UI
  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onServiceFilterChange(event: Event, service: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.filterServices.push(service);
    } else {
      this.filterServices = this.filterServices.filter(s => s !== service);
    }
  }

  // Count the total number of hospitals across all states
  getTotalHospitalsCount(): number {
    let total = 0;
    for (const state in this.hospitals) {
      if (this.hospitals.hasOwnProperty(state)) {
        total += this.hospitals[state].length;
      }
    }
    return total;
  }
}
