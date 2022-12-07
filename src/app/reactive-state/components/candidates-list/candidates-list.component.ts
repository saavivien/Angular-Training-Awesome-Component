import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { CandidateSearhType } from '../../enums/candidate-search-type.enum';
import { Candidate } from '../../models/candidate.model';
import { CandidatesService } from '../../services/candidates.service';

@Component({
  selector: 'app-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidatesListComponent implements OnInit {

  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: CandidateSearhType,
    label: string
  }[];

  constructor(
    private candidatesService: CandidatesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.candidatesService.getCandidatesFromServer();
    this.iniObservable();
  }

  initForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.searchTypeCtrl = this.formBuilder.control(CandidateSearhType.LASTNAME);
    this.searchTypeOptions = [
      { value: CandidateSearhType.LASTNAME, label: 'Nom' },
      { value: CandidateSearhType.FIRSTNAME, label: 'Prénom' },
      { value: CandidateSearhType.COMPANY, label: 'Entreprise' }
    ]
  }

  private iniObservable(): void {
    this.loading$ = this.candidatesService.loading$;

    const search$: Observable<string> = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map(search => search.trim().toLowerCase())
    );

    const searchType$: Observable<CandidateSearhType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    )

    this.candidates$ = combineLatest([
      search$,
      searchType$,
      this.candidatesService.candidates$
    ])
      .pipe(
        map(([searchInput, searchType, candidates]) => {
          return candidates.filter(candidate => candidate[searchType].toLowerCase().includes(searchInput))
        }
        )
      )
  }
}



