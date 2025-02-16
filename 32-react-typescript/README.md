## Working with TypeScript

### Props with TypeScript

- we need to explictly specify what type the prop is
- Otherwise, TypeScript will throw a warning, helping developers catch potential bugs early

```tsx
function Todos(props: { items: string[]; children: any }) {
  return <ul></ul>;
}

export default Todos;
```

- Adding props like the code above becomes cumbersome as the number of props grows
- To make the code cleaner and more maintainable, we can use `FC` (Function Component) type.

#### `FC` (Function Component)

- `FC` is a built-in generic type in React's type definitions that stands for "Function Component."
- It automatically includes base props like `children`, `key`

```tsx
import React, { FC } from "react";

const Todos: FC<{ items: string[] }> = (props) => {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

export default Todos;
```

- Adding <> after FC, we can define own props
- Inside <>, we set the concrete type that should be used in the component

- We should hand over the items prop where it the component is used, otherwise it gets an error

```tsx
import Todos from "./components/Todos";

function App() {
  return (
    <div className="App">
      <Todos items={["Learn React", "Learn Typescript"]} />
    </div>
  );
}

export default App;
```

### Adding a Data Model

- We can use the class as a type

#### `Todo.ts`

```tsx
class Todo {
  id: string;
  text: string;

  constructor(todoText: string) {
    this.text = todoText;
    this.id = new Date().toISOString();
  }
}

export default Todo;
```

#### `Todos.tsx`

```tsx
import React, { FC } from "react";
import Todo from "../models/todo";

const Todos: FC<{ items: Todo[] }> = (props) => {
  return (
    <ul>
      {props.items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};

export default Todos;
```

- It lowers the possibility of misusing the compoents
- Errors can be discovered during devlopment, not runtime

### Form submission with TypeScript

- When handling form submission, we need to prevent the defualt behavior
- React will passes an `event` object when the handler function is connected to the event listener
- We need to specify the type of `event` (In this case, `FormEvent`)
- If we defined the type as `MouseEvent`, TypeScript will inform the error

```tsx
const NewTodo = () => {
  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="text">Todo text</label>
      <input type="text" id="text" />
      <button>Add Todo</button>
    </form>
  );
};

export default NewTodo;
```

### Working with refs & `useRef`

- We need to specify which HTML element we want to connect to
- Put `HTMLInputElement` into angle brackets, as we want to connect `input` element. (All DOM elements has built-in types: `HTMLButtonElement`, `HTMLParagraphElement`...)

```tsx
import { useRef } from "react";

const NewTodo = () => {
  const todoTextInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    // ! means the value could NOT be null
    const enteredText = todoTextInputRef.current!.value;

    if (enteredText.trim().length === 0) {
      return;
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="text">Todo text</label>
      <input type="text" id="text" ref={todoTextInputRef} />
      <button>Add Todo</button>
    </form>
  );
};

export default NewTodo;
```

- We have to set a default value, as `ref` could be other element
- At the beginning, there is no connection, so the initial value is `null`
- `ref` has `current` property which holds the actual value
- `submitHandler` can only be connected when the form is submitted, so the `ref` value inside that function will 100% be connected

### Working with Function Props

```tsx
import { FC, useRef } from "react";

const NewTodo: FC<{ onAddTodo: (text: string) => void }> = (props) => {
  const todoTextInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    // ! means the value could NOT be null
    const enteredText = todoTextInputRef.current!.value;

    if (enteredText.trim().length === 0) {
      return;
    }

    props.onAddTodo(enteredText);
  };

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="text">Todo text</label>
      <input type="text" id="text" ref={todoTextInputRef} />
      <button>Add Todo</button>
    </form>
  );
};

export default NewTodo;
```

### Managing State with TypeScript

- `useState` is a generic function, so it can accept a type parameter to specify the state type

```tsx
import { useState } from "react";
import NewTodo from "./components/NewTodo";
import Todos from "./components/Todos";
import Todo from "./models/todo";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodoHandler = (todoText: string) => {
    const newTodo = new Todo(todoText);

    setTodos((prevTodos) => {
      return prevTodos.concat(newTodo); // concat creates a new array
    });
  };

  return (
    <div className="App">
      {/* When new todo is added, the new one should be added todos array as well */}
      <NewTodo onAddTodo={addTodoHandler} />
      <Todos items={todos} />
    </div>
  );
}

export default App;
```

- In the code above, if we didn't specify the type, it will be `never` array type (It means it always be an empty array)
- TypeScript doesn't know what type of value should be stored in the array