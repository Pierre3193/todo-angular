import { Injectable } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private SERVER_URL: string = 'api/'

  constructor(private httpClient: HttpClient) {
   }

  public getTodos(): Observable<Todo[]>{
    return this.httpClient.get<Todo[]>(this.SERVER_URL + 'todos');
  }

  public getTodo(id):Observable<Todo>{
    return this.httpClient.get<Todo>(`${this.SERVER_URL + 'todos'}/${id}`);
  }

  public createTodo(todo: Todo){
    return this.httpClient.post(`${this.SERVER_URL + 'todos'}`,todo);
  }

  public deleteTodo(id){
    return this.httpClient.delete(`${this.SERVER_URL + 'todos'}/${id}`);
  }
  
  public updateTodo(todo: Todo){
    return this.httpClient.put(`${this.SERVER_URL + 'todos'}/${todo.id}`,todo);
  }

  compare(a,b) {
    if (a.completed && !b.completed){
      return 1;
    }else if (!a.completed && b.completed){
      return -1;
    }else{
      return b.id - a.id
    }
  }
}
