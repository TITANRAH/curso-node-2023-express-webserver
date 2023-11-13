import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

// const todos = [
//   { id: 1, text: "buy milk", completedAt: new Date() },
//   { id: 2, text: "buy bread", completedAt: null },
//   { id: 3, text: "buy butter", completedAt: new Date() },
// ];

export class TodosController {
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();

    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    // paso el string a int
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });
    // const todo = todos.find((todo) => todo.id === id);
    const todo = await prisma.todo.findFirst({
      where: { id: id },
    });
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  // CREAR
  public createTodo = async (req: Request, res: Response) => {
    // const { text } = req.body;

    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) return res.status(400).json({ error: error });

    const todo = await prisma.todo.create({
      // aqui evalua el dto solo el texto es como si le enviara solo el texto
      data: createTodoDto!,
    });

    res.json(todo);
  };

  // ACTUALIZAR
  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body, id
    });

    if(error) return res.status(400).json({ error: error });

   
    // const todo = todos.find((todo) => todo.id === id);

    const todo = await prisma.todo.findFirst({
      where: { id: id },
    });
    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });



    // if (!text)
    //   return res.status(404).json({ error: "Text property is required" });

    // actualizar
    // si viene el valor actualiza si no deja el valor actual
    // todo.text = text || todo.text;
    // completedAt === null
    //   ? (todo.completedAt = null)
    //   : (todo.completedAt = new Date(completedAt || todo.completedAt));

    const updateTodo = await prisma.todo.update({
      where: { id: id },
      data: updateTodoDto!.values,
    });
    res.json(updateTodo);
  };

  // ELIMINAR
  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    // verifico si existe
    // const todo = todos.find((todo) => todo.id === id);
    const todo = await prisma.todo.findFirst({
      where: { id: id },
    });

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    //  todos.find((tod) => tod.id !== todo.id)

    // corta el todo encontrado
    // todos.splice(todos.indexOf(todo), 1);

    const deleteTodo = await prisma.todo.delete({
      where: { id: id },
    });

    deleteTodo
      ? res.json(deleteTodo)
      : res.status(400).json({ error: `Todo with id ${id} not found` });
  };
}
