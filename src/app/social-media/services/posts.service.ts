import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Post } from "../models/post.model";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class PostsService {
    constructor(private http: HttpClient) { }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
    }
    addNewComment(postCommented: { comment: string, postId: number }) {
        console.log(postCommented);
    }
}
