import NewTodo from "./components/NewTodo";
import Todos from "./components/Todos";
import TodosContextProvider from "./store/todo-context";

function App() {
  return (
    <TodosContextProvider>
      {/* When new todo is added, the new one should be added todos array as well */}
      <NewTodo />
      <Todos />
    </TodosContextProvider>
  );
}

export default App;
