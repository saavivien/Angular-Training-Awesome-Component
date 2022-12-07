import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { delay, filter, map, switchMap, take, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Candidate } from "../models/candidate.model";

@Injectable()
export class CandidatesService {
    constructor(private http: HttpClient) { }

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private _candidates$ = new BehaviorSubject<Candidate[]>([]);
    get candidates$(): Observable<Candidate[]> {
        return this._candidates$.asObservable();
    }

    private lastCandidateLoadtime = 0;

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getCandidatesFromServer(): void {
        //on ne recharge que 5 minutes après le dernier chargement
        if (Date.now() - this.lastCandidateLoadtime < 1000 * 60 * 5) {
            return;
        }

        this.setLoadingStatus(true);
        this.http.get<Candidate[]>(`${environment.apiUrl}/candidates`).pipe(
            delay(1000),
            tap(candidates => {
                this.lastCandidateLoadtime = Date.now();
                this._candidates$.next(candidates);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getCandidateById(id: number): Observable<Candidate> {
        if (this.lastCandidateLoadtime === 0) {
            this.getCandidatesFromServer();
        }
        return this.candidates$.pipe(
            map(candidates => candidates.filter(candidate => candidate.id === id)[0])
        )
    }

    refuseCandidate(id: number): void {
        this.setLoadingStatus(true);
        this.http.delete(`${environment.apiUrl}/candidates/${id}`).pipe(
            delay(1000),
            switchMap(() => this.candidates$),
            take(1),
            map(candidates => candidates.filter(candidate => candidate.id !== id)),
            tap(candidates => {
                this._candidates$.next(candidates);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    hireCandidate(id: number): void {
        this.setLoadingStatus(true);
        this.candidates$
            .pipe(
                take(1),
                map(candidates =>
                    candidates.map(
                        candidate => candidate.id === id
                            ? { ...candidate, company: 'SnapFace Company LTD' }
                            : candidate)
                ),
                tap(candidates => this._candidates$.next(candidates)),
                switchMap(candidates =>
                    this.http.patch(`${environment.apiUrl}/candidates/${id}`, candidates.find(candidate => candidate.id === id))
                ),
                tap(() => this.setLoadingStatus(false))
            )
            .subscribe();
    }
}