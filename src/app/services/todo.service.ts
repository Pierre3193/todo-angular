import { Injectable } from '@angular/core';
import { Todo } from 'src/app/interfaces/todo';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private SERVER_URL: string = 'api/'
  todos: Todo[];
  

  constructor(private httpClient: HttpClient) {
    this.getTodos().subscribe(todos => this.todos = todos.sort(this.compare));
   }

  public getTodos(): Observable<Todo[]>{
    return this.httpClient.get<Todo[]>(this.SERVER_URL + 'todos');
  }

  public getTodo(id){
    return this.httpClient.get(`${this.SERVER_URL + 'todos'}/${id}`);
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
      return 0;
    }
  }

  remaining(): number {
    if (this.todos){
      return this.todos.filter(todo => !todo.completed).length;
    }else{
      return 0;
    }
  }

  todoCompleted(todo: Todo): void {
    this.updateTodo(todo);
    if (todo.completed){
      var moved = false
      for(let i = 0; i < this.todos.length; i++){
        if (this.todos[i] === todo && i !== this.todos.length - 1){
          this.todos.splice(i,1);
          this.todos.splice(this.todos.length + 1,1,todo);
        }
      }
    }else{
      this.todos = this.todos.sort(this.compare);
    }
    
  }
  

}
