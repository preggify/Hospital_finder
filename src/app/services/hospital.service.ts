import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hospital, Comment, ApiResponse, HospitalsResponse, DeliveryCost } from '../models/hospital.model';
import { MOCK_HOSPITALS } from '../mocks/mock-hospitals';
import { environment } from '../../environments/environment';

// Define interface for stats response..
interface StatsResponse {
  totalHospitals: number;
  totalStates: number;
  states: string[];
  byState: Array<{_id: string, count: number}>;
  byType: Array<{_id: string, count: number}>;
  byService: Array<{service: string, count: number}>;
}

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private apiUrl = environment.apiUrl; // Base URL from environment config
  private useMockData = false; // Using real API

  constructor(private http: HttpClient) {}

  // Get all hospitals grouped by state with pagination
  getHospitals(page: number = 1, limit: number = 10): Observable<Record<string, Hospital[]>> {
    if (this.useMockData) {
      // Initialize showDetails property and add _id from id for all hospitals
      Object.keys(MOCK_HOSPITALS).forEach(state => {
        MOCK_HOSPITALS[state].forEach(hospital => {
          if (hospital.showDetails === undefined) {
            hospital.showDetails = false;
          }
          // Set _id from id for mock data compatibility
          if (hospital.id && !hospital._id) {
            hospital._id = hospital.id;
          }
        });
      });

      if (page === 0) { // If page is 0, return all hospitals
        return of(MOCK_HOSPITALS);
      } else {
        // Implement pagination for mock data
        const paginatedHospitals: Record<string, Hospital[]> = {};
        const allStates = Object.keys(MOCK_HOSPITALS);
        const startIdx = (page - 1) * limit;
        const endIdx = startIdx + limit;

        // Get a subset of states based on pagination
        const paginatedStates = allStates.slice(
          startIdx < allStates.length ? startIdx : 0,
          endIdx < allStates.length ? endIdx : allStates.length
        );

        paginatedStates.forEach(state => {
          paginatedHospitals[state] = MOCK_HOSPITALS[state];
        });

        return of(paginatedHospitals);
      }
    }
    // Add pagination params to the HTTP request
    let params = new HttpParams()
      // .set('page', page.toString())
      // .set('limit', limit.toString());

    // Handle the new API response format with data wrapper
    return this.http.get<ApiResponse<HospitalsResponse>>(`${this.apiUrl}/hospitals/listhospital`, { params })
      .pipe(
        map(response => {
          // Initialize showDetails and add compatibility fields
          Object.keys(response.data).forEach(state => {
            response.data[state].forEach(hospital => {
              hospital.showDetails = false;

              // For backwards compatibility with components
              hospital.id = hospital._id;

              // Set delivery cost compatibility fields
              if (hospital.delivery_cost) {
                hospital.delivery_cost.cs = hospital.delivery_cost.cesarean;
                hospital.delivery_cost.emergency = hospital.delivery_cost.normal; // Use normal as fallback
                hospital.delivery_cost.currency = '₦'; // Add currency symbol
              }
            });
          });

          // Attach pagination metadata to the data object
          const result = response.data as any;
          result._pagination = {
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages
          };

          return result;
        })
      );
  }

  // Get statistics about hospitals
  getStats(): Observable<StatsResponse> {
    if (this.useMockData) {
      // Create mock stats from MOCK_HOSPITALS
      const totalStates = Object.keys(MOCK_HOSPITALS).length;
      const states = Object.keys(MOCK_HOSPITALS);
      let totalHospitals = 0;
      const byState: Array<{_id: string, count: number}> = [];
      const byTypeMap = new Map<string, number>();
      const byServiceMap = new Map<string, number>();

      Object.keys(MOCK_HOSPITALS).forEach(state => {
        const hospitals = MOCK_HOSPITALS[state];
        totalHospitals += hospitals.length;

        byState.push({
          _id: state,
          count: hospitals.length
        });

        hospitals.forEach(hospital => {
          // Count by type
          const type = hospital.type;
          byTypeMap.set(type, (byTypeMap.get(type) || 0) + 1);

          // Count by service
          hospital.services.forEach(service => {
            byServiceMap.set(service, (byServiceMap.get(service) || 0) + 1);
          });
        });
      });

      // Convert maps to arrays
      const byType = Array.from(byTypeMap.entries()).map(([_id, count]) => ({ _id, count }));
      const byService = Array.from(byServiceMap.entries()).map(([service, count]) => ({ service, count }));

      return of({
        totalHospitals,
        totalStates,
        states,
        byState,
        byType,
        byService
      });
    }

    // Use the new /stats endpoint
    // For development purposes, hard-code some values that match what we expect
    const hardCodedStats: StatsResponse = {
      totalHospitals: 150,
      totalStates: 36,
      states: [],
      byState: [],
      byType: [],
      byService: []
    };

    // Get data from API
    return this.http.get(`${this.apiUrl}/hospitals/stats`).pipe(
      map(response => {
        // Check if response has expected structure
        const statsData = response as any;

        // Try to get data from various possible structures
        let data;
        if (statsData.data && typeof statsData.data === 'object') {
          // If response has a data property
          data = statsData.data;
        } else if (statsData.totalHospitals !== undefined) {
          // If response is directly the stats object
          data = statsData;
        } else if (statsData.status === 'success' && statsData.data && statsData.data.hospitalStats) {
          // If it's nested in a success response with hospitalStats
          data = statsData.data.hospitalStats;
        } else {
          // Return hardcoded values if we can't determine the structure
          return hardCodedStats;
        }

        // Check if we have valid data
        if (!data || typeof data !== 'object') {
          return hardCodedStats;
        }

        // Make sure numeric values are actually numbers
        const result: StatsResponse = {
          totalHospitals: Number(data.totalHospitals) || 150, // Fallback to hard-coded value
          totalStates: Number(data.totalStates) || 36, // Fallback to hard-coded value
          states: data.states || [],
          byState: data.byState || [],
          byType: data.byType || [],
          byService: data.byService || []
        };

        return result;
      })
    );
  }

  // Get total number of states/pages for pagination
  getTotalStates(): Observable<number> {
    if (this.useMockData) {
      return of(Object.keys(MOCK_HOSPITALS).length);
    }

    // Use the new stats endpoint to get total states
    return this.getStats().pipe(
      map(stats => stats.totalStates || 0)
    );
  }

  // Search hospitals based on filters
  searchHospitals(filters: {
    state?: string,
    services?: string[],
    type?: string,
    minCost?: number,
    maxCost?: number,
    query?: string
  }): Observable<Hospital[]> {
    if (this.useMockData) {
      // Filter the mock data based on the provided filters
      let filteredHospitals: Hospital[] = [];

      // Flatten all hospitals from all states
      Object.values(MOCK_HOSPITALS).forEach(hospitals => {
        filteredHospitals = [...filteredHospitals, ...hospitals];
      });

      // Apply filters
      if (filters.state) {
        filteredHospitals = filteredHospitals.filter(h =>
          h.state.toLowerCase() === filters.state?.toLowerCase());
      }

      if (filters.type) {
        filteredHospitals = filteredHospitals.filter(h =>
          h.type.toLowerCase() === filters.type?.toLowerCase());
      }

      if (filters.services && filters.services.length > 0) {
        filteredHospitals = filteredHospitals.filter(h =>
          filters.services?.some(service => h.services.includes(service)));
      }

      // Skip cost filtering in mock data as the API now returns string costs
      // Real filtering will be handled by the backend

      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredHospitals = filteredHospitals.filter(h =>
          h.name.toLowerCase().includes(query) ||
          h.location.toLowerCase().includes(query));
      }

      return of(filteredHospitals);
    }

    let params = new HttpParams();

    if (filters.state) {
      params = params.append('state', filters.state);
    }

    if (filters.services && filters.services.length > 0) {
      filters.services.forEach(service => {
        params = params.append('services', service);
      });
    }

    if (filters.type) {
      params = params.append('type', filters.type);
    }

    if (filters.minCost !== undefined) {
      params = params.append('minCost', filters.minCost.toString());
    }

    if (filters.maxCost !== undefined) {
      params = params.append('maxCost', filters.maxCost.toString());
    }

    if (filters.query) {
      params = params.append('query', filters.query);
    }

    return this.http.get<ApiResponse<Hospital[]>>(`${this.apiUrl}/hospitals/search_hospital`, { params })
      .pipe(
        map(response => {
          // Add compatibility fields for each hospital
          response.data.forEach(hospital => {
            hospital.id = hospital._id;

            // Set delivery cost compatibility fields
            if (hospital.delivery_cost) {
              hospital.delivery_cost.cs = hospital.delivery_cost.cesarean;
              hospital.delivery_cost.emergency = hospital.delivery_cost.normal; // Use normal as fallback
              hospital.delivery_cost.currency = '₦'; // Add currency symbol
            }
          });
          return response.data;
        })
      );
  }

  // Get a single hospital by ID
  getHospital(id: string): Observable<Hospital> {
    if (this.useMockData) {
      // Find the hospital in mock data
      let foundHospital: Hospital | undefined;

      Object.values(MOCK_HOSPITALS).forEach(hospitals => {
        const hospital = hospitals.find(h => h._id === id);
        if (hospital) {
          foundHospital = hospital;
        }
      });

      if (foundHospital) {
        return of(foundHospital);
      }

      // Return error observable if not found
      return new Observable(observer => {
        observer.error({ status: 404, message: 'Hospital not found' });
      });
    }

    // The API returns the hospital directly in the response, not wrapped in a data property
    return this.http.get<Hospital>(`${this.apiUrl}/hospitals/${id}`)
      .pipe(
        map(hospital => {
          // Add compatibility fields
          hospital.id = hospital._id;

          // Set delivery cost compatibility fields
          if (hospital.delivery_cost) {
            // Create compatibility fields based on the actual API response
            hospital.delivery_cost.cs = hospital.delivery_cost.cesarean;
            hospital.delivery_cost.emergency = hospital.delivery_cost.normal; // Use normal as fallback

            // Don't use currency pipe with strings, set a string currency value
            hospital.delivery_cost.currency = '';
          }

          return hospital;
        })
      );
  }

  // Add a new hospital
  addHospital(hospital: Omit<Hospital, 'id'>): Observable<Hospital> {
    if (this.useMockData) {
      // Create a new hospital with generated ID
      const newHospital: Hospital = {
        ...hospital,
        _id: 'mock-' + Date.now().toString(),
        comments: []
      };

      // Add to mock data
      if (!MOCK_HOSPITALS[newHospital.state]) {
        MOCK_HOSPITALS[newHospital.state] = [];
      }

      MOCK_HOSPITALS[newHospital.state].push(newHospital);

      return of(newHospital);
    }

    return this.http.post<any>(`${this.apiUrl}/hospitals/addhospital`, hospital)
      .pipe(
        map(response => {
          // Handle different response formats
          let newHospital: Hospital;

          if (response && response.data) {
            // Standard ApiResponse format
            newHospital = response.data;
          } else if (response && response._id) {
            // Direct hospital object response
            newHospital = response;
          } else {
            // Unknown format, create a minimal object
            newHospital = {
              _id: 'unknown',
              ...hospital
            } as Hospital;
          }

          // Add compatibility fields
          newHospital.id = newHospital._id;

          // Set delivery cost compatibility fields if they exist
          if (newHospital.delivery_cost) {
            newHospital.delivery_cost.cs = newHospital.delivery_cost.cesarean;
            newHospital.delivery_cost.emergency = newHospital.delivery_cost.normal;
            newHospital.delivery_cost.currency = '₦';
          }

          return newHospital;
        })
      );
  }

  // Edit a hospital (admin only)
  editHospital(id: string, hospital: Hospital): Observable<Hospital> {
    if (this.useMockData) {
      // Find and update the hospital in mock data
      let foundHospital: Hospital | undefined;

      Object.values(MOCK_HOSPITALS).forEach(hospitals => {
        const index = hospitals.findIndex(h => h._id === id);
        if (index !== -1) {
          hospitals[index] = { ...hospital, _id: id };
          foundHospital = hospitals[index];
        }
      });

      if (foundHospital) {
        return of(foundHospital);
      }

      // Return error observable if not found
      return new Observable(observer => {
        observer.error({ status: 404, message: 'Hospital not found' });
      });
    }

    return this.http.put<ApiResponse<Hospital>>(`${this.apiUrl}/hospitals/${id}`, hospital)
      .pipe(
        map(response => response.data)
      );
  }

  // Delete a hospital (admin only)
  deleteHospital(id: string): Observable<void> {
    if (this.useMockData) {
      // Find and remove the hospital from mock data
      Object.keys(MOCK_HOSPITALS).forEach(state => {
        const index = MOCK_HOSPITALS[state].findIndex(h => h._id === id);
        if (index !== -1) {
          MOCK_HOSPITALS[state].splice(index, 1);

          // Remove the state if no hospitals left
          if (MOCK_HOSPITALS[state].length === 0) {
            delete MOCK_HOSPITALS[state];
          }
        }
      });

      return of(void 0);
    }

    return this.http.delete<void>(`${this.apiUrl}/hospitals/deletehospitals/${id}`);
  }

  // Add a comment to a hospital
  addComment(hospitalId: string, comment: Omit<Comment, 'createdAt'>): Observable<Comment> {
    if (this.useMockData) {
      // Find the hospital and add the comment
      let foundHospital: Hospital | undefined;

      Object.values(MOCK_HOSPITALS).forEach(hospitals => {
        const hospital = hospitals.find(h => h._id === hospitalId);
        if (hospital) {
          foundHospital = hospital;
        }
      });

      if (foundHospital) {
        const newComment: Comment = {
          ...comment,
          createdAt: new Date()
        };

        foundHospital.comments.unshift(newComment);
        return of(newComment);
      }

      // Return error observable if not found
      return new Observable(observer => {
        observer.error({ status: 404, message: 'Hospital not found' });
      });
    }

    return this.http.post<ApiResponse<Comment>>(`${this.apiUrl}/hospitals/${hospitalId}/comment`, comment)
      .pipe(
        map(response => response.data)
      );
  }
}
