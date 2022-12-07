import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Candidate } from '../../models/candidate.model';
import { CandidatesService } from '../../services/candidates.service';

@Component({
  selector: 'app-single-candidate',
  templateUrl: './single-candidate.component.html',
  styleUrls: ['./single-candidate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleCandidateComponent implements OnInit {

  candidate$!: Observable<Candidate>;
  loading$!: Observable<boolean>;

  constructor(
    private candidateService: CandidatesService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.initObservable();
    this.candidate$ = this.route.params
      .pipe(
        switchMap(params => this.candidateService.getCandidateById(+params['id']))
      )
  }
  initObservable() {
    this.loading$ = this.candidateService.loading$;
  }

  onHire() {
    this.candidate$.pipe(
      take(1),
      tap(candidate => {
        this.candidateService.hireCandidate(candidate.id);
        this.router.navigateByUrl('reactive-state/candidates');
      })
    ).subscribe();
  }
  onRefuse() {
    this.candidate$
      .pipe(
        take(1),
        tap(candidate => {
          this.candidateService.refuseCandidate(candidate.id);
          this.router.navigateByUrl('reactive-state/candidates');
        }
        )
      )
      .subscribe();
  }
  onGoBack() {
    this.router.navigateByUrl('reactive-state/candidates');
  }


}
