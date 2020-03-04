import { createAction, props } from '@ngrx/store';
import { Todo } from 'src/app/interfaces/todo';

export const getTodosAction = createAction('Get Todos');

export const successgetTodosAction = createAction('Success Get Todos',
props<{payload: Todo[] }>()
);

export const errorTodoAction = createAction('Error',
props<Error>()
);

export const UpdateTodoAction = createAction('Update Todo',
props<{payload: Todo }>()
);

export const getTodoAction = createAction('Get Todo',
props<{payload: number }>()
);

export const successgetTodoAction = createAction('Success Get Todo',
props<{payload: Todo }>()
);

export const CreateTodoAction = createAction('Create Todo',
props<{payload: Partial<Todo> | Todo }>()
);

export const PrepareCreateTodoAction = createAction('Prepare create Todo',
props<{payload: Partial<Todo> | Todo }>()
);

export const DeleteTodo = createAction('Delete Todo',
props<{payload: number }>()
);
