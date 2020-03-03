import { Todo } from 'src/app/interfaces/todo';


export class TodoStateService {
  todos : Array<Todo>;
  todoError : Error;
  loading : boolean;
  editingTodo: Todo;

  constructor() { }
}

export const initializeState = () : TodoStateService => {
  return { 
    todos : Array<Todo>(), 
    todoError: null, 
    loading: false, 
    editingTodo: null
  };
}
