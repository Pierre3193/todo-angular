import { Component, OnInit } from '@angular/core';
import { Todo } from '../../interfaces/todo'

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[];
  ifForTodo : number;

  constructor() { }

  ngOnInit(): void {
    this.todos = [
      {
        'id' : 1,
        'title' : 'Finir la première user storie',
        'completed' : true,
        'editing' : false
      },
      {
        'id' : 2,
        'title' : 'Finir la seconde user storie',
        'completed' : false,
        'editing' : false
      },
      {
        'id' : 3,
        'title' : 'Finir la troisème user storie',
        'completed' : false,
        'editing' : false
      },
      {
        'id' : 4,
        'title' : 'Finir la quatrième user storie',
        'completed' : false,
        'editing' : false
      }
    ]
  this.ifForTodo = this.todos.length + 1;
  }

  remaining(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

}
