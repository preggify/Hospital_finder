import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HospitalService } from '../../services/hospital.service';
import { Hospital, Comment } from '../../models/hospital.model';

@Component({
  selector: 'app-hospital-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hospital-detail.component.html',
  styleUrls: ['./hospital-detail.component.css']
})
export class HospitalDetailComponent implements OnInit {
  hospital: Hospital | null = null;
  isLoading = true;
  errorMessage = '';
  commentForm: FormGroup;
  commentSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      text: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadHospital(id);
      } else {
        this.errorMessage = 'Hospital ID not found.';
        this.isLoading = false;
      }
    });
  }

  loadHospital(id: string): void {
    this.isLoading = true;
    this.hospitalService.getHospital(id).subscribe(
      (hospital) => {
        this.hospital = hospital;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading hospital details. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  submitComment(): void {
    if (this.commentForm.valid && this.hospital?._id) {
      this.commentSubmitted = true;

      const newComment: Omit<Comment, 'createdAt'> = {
        author: this.commentForm.value.author,
        text: this.commentForm.value.text
      };

      this.hospitalService.addComment(this.hospital._id, newComment).subscribe(
        (comment) => {
          // Add comment to the local array with the server-generated createdAt date
          if (this.hospital?.comments) {
            this.hospital.comments.unshift({...newComment, createdAt: comment.createdAt});
          }

          // Reset form
          this.commentForm.reset();
          this.commentSubmitted = false;
        },
        (error) => {
          this.commentSubmitted = false;
        }
      );
    }
  }
}
