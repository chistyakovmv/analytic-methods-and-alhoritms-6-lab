import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {delay} from "rxjs/operators";
import { isNgTemplate } from '@angular/compiler';

export interface Todo 
{
  id?: number;
  title: string;
  completed: boolean;
}

@Component
({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  
{
  posts: Todo[] = [];
  postBefore: Todo[] = [];
  flagLoad = false;
  namePost = '';
  constructor(public http: HttpClient) {}

  SortArray(x:Todo, y:Todo)
  {return x.title.localeCompare(y.title);}

  ngOnInit(): void 
  {
    this.loadPost();
    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5')
    .subscribe(response => 
    {
      console.log(response)
      this.postBefore = response;
      this.posts = this.postBefore.sort(this.SortArray);
    });
  }

  loadPost() 
  {
    this.flagLoad = true;
    this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .pipe(delay(1500))
      .subscribe(response => 
      {
        console.log(response)
        this.postBefore = response;
        this.posts = this.postBefore.sort(this.SortArray);
        this.flagLoad = false;
      });
  }

  removePost(id?: number) 
  {
    this.http.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .subscribe(() => 
    {
      console.log(id)
      this.posts = this.posts.filter(item => item.id != id)
      console.log(this.posts)
    });
  }

  completedPost(id?: number) 
  {
    return this.http.put(`https://jsonplaceholder.typicode.com/todos/${id}`,{completed:true})
    .subscribe(res => {this.posts.find(item => item.id===res.id)!.completed=true})
  }
  

addPost() 
{
  if (!this.namePost.trim()) 
  {return}
  const post: Todo = 
  {
    title: this.namePost,
    completed: false
  }
  this.http.post('https://jsonplaceholder.typicode.com/todos/', post)
    .subscribe(res => 
    {
      console.log(res)
      this.posts.unshift(post)
    });
}
}