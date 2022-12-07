import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveStateRoutingModule } from './reactive-state-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CandidatesListComponent } from './components/candidates-list/candidates-list.component';
import { SingleCandidateComponent } from './components/single-candidate/single-candidate.component';
import { CandidatesService } from './services/candidates.service';


@NgModule({
  declarations: [
    CandidatesListComponent,
    SingleCandidateComponent
  ],
  imports: [
    CommonModule,
    ReactiveStateRoutingModule,
    SharedModule
  ],
  providers: [
    CandidatesService
  ]
})
export class ReactiveStateModule { }
