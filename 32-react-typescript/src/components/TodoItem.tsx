import { FC } from "react";
import classes from "./TodoItem.module.css";

const TodoItem: FC<{ text: string; onDeleteTodo: () => void }> = (props) => {
  return (
    <li className={classes.item} onClick={props.onDeleteTodo}>
      {props.text}
    </li>
  );
};

export default TodoItem;
