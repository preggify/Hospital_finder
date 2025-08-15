import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HospitalService } from '../../services/hospital.service';

@Component({
  selector: 'app-add-hospital',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-hospital.component.html',
  styleUrls: ['./add-hospital.component.css']
})
export class AddHospitalComponent implements OnInit {
  hospitalForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  // Available options for the form..
  //thica can also be stored in a db..
  statesList = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi',
    'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta',
    'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
    'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];

  hospitalTypes = ['Public', 'Private', 'Teaching', 'Mission', 'Specialist'];

  availableServices = [
    'General Checkup',
    'Maternity',
    'Pediatrics',
    'Emergency',
    'Surgery',
    'Oncology',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Ophthalmology',
    'Psychiatry',
    'Dental',
    'Physical Therapy',
    'Occupational Therapy'
  ];

  currencies = ['NGN']; // Only Nigerian Naira

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private router: Router
  ) {
    this.hospitalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', Validators.required],
      location: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$')]],
      type: ['', Validators.required],
      services: this.fb.array([]),
      delivery_cost: this.fb.group({
        normal: [null, [Validators.required, Validators.min(0)]],
        emergency: [null, [Validators.required, Validators.min(0)]],
        cs: [null, [Validators.required, Validators.min(0)]],
        currency: ['NGN', Validators.required]
      }),
      comments: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Add at least one service by default
    this.addService();
  }

  // Form array getters
  get servicesArray(): FormArray {
    return this.hospitalForm.get('services') as FormArray;
  }

  // Add and remove services
  addService(): void {
    this.servicesArray.push(this.fb.control('', Validators.required));
  }

  removeService(index: number): void {
    this.servicesArray.removeAt(index);
  }

  // Form submission
  onSubmit(): void {
    if (this.hospitalForm.valid) {
      this.isSubmitting = true;
      this.submitError = '';

      this.hospitalService.addHospital(this.hospitalForm.value).subscribe(
        (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;

          // Navigate to the home page after a short delay
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          // Handle the case where we received an error response but the hospital might have been created anyway
          this.isSubmitting = false;

          // Check if we still have response data despite the error
          if (error && error.data && error.data._id) {
            this.submitSuccess = true;
            // Navigate to home page after a short delay
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else {
            // Show error message only if we don't have valid data
            this.submitError = 'Error submitting hospital data. Please try again.';
          }
        }
      );
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.markFormGroupTouched(this.hospitalForm);
    }
  }

  // Helper to mark all controls in a form group as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Check for service duplicates
  isDuplicateService(index: number): boolean {
    const currentValue = this.servicesArray.at(index).value;

    if (!currentValue) {
      return false;
    }

    let count = 0;
    for (let i = 0; i < this.servicesArray.length; i++) {
      if (this.servicesArray.at(i).value === currentValue) {
        count++;
      }
    }

    return count > 1;
  }
}
