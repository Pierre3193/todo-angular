import { Action, createReducer, on} from '@ngrx/store';
import * as todoAction from './todo-action.service';
import { TodoStateService, initializeState} from './todo-state.service';

export const initialState = initializeState();

const reducer = createReducer(
  initialState,
  on(todoAction.getTodosAction, state => {return {...state, loading: true}}),
  on(todoAction.successgetTodosAction, (state:TodoStateService, {payload})=> {
    return {...state, todos: payload, loading: false}
  }),
  on(todoAction.errorTodoAction,(state:TodoStateService, error:Error)=> {
    console.log(error);
    return {...state, todoError: error, loading:false};
  }),
  on(todoAction.UpdateTodoAction, state => {return {...state, loading: true}}),
  on(todoAction.getTodoAction,  state => {return {...state, loading: true}}),
  on(todoAction.successgetTodoAction, (state:TodoStateService, {payload})=> {
    return {...state, editingTodo: payload, loading: false}
  })
)

export function todoReducer(state: TodoStateService | undefined, action: Action) {
  return reducer(state, action);
}