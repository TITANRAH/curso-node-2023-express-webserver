import { Request, Response } from "express";

const todos = [
  { id: 1, text: "buy milk", completedAt: new Date() },
  { id: 2, text: "buy bread", completedAt: null },
  { id: 3, text: "buy butter", completedAt: new Date() },
];

export class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    // paso el string a int
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });
    const todo = todos.find((todo) => todo.id === id);
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text)
      return res.status(404).json({ error: "Text property is required" });
    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: null,
    };

    todos.push(newTodo);
    res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = todos.find((todo) => todo.id === id);
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    const { text, completedAt } = req.body;
    if (!text)
      return res.status(404).json({ error: "Text property is required" });

    // actualizar
    // si viene el valor actualiza si no deja el valor actual
    todo.text = text || todo.text;
    completedAt === "null"
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    res.json(todo);
  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = todos.find((todo) => todo.id === id);

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    //  todos.find((tod) => tod.id !== todo.id)

    todos.splice(todos.indexOf(todo), 1);

    res.json(todo);
  };
}
