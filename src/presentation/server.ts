import express, { Router } from "express";
import path from "path";

// creo una interface para poder recibir y usar las opciones del archivo env
interface Options {
  port: number;
  // creo el campo para recibir las rutas de express
  routes: Router;
  // el public path es para la SPA
  public_path?: string;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options){
    const {port, public_path = 'public', routes} = options;

    this.port = port;
    this.publicPath=public_path;
    this.routes = routes;
  }

  async start() {
    //* middlewares
    this.app.use(express.json()) // raw
    this.app.use(express.urlencoded({extended: true})) //x-www-form-urlenconde

    //* public folders
    this.app.use(express.static(this.publicPath));

    //* Routes
    this.app.use(this.routes);

    //* SPA
    this.app.get("*", (req, res) => {
      const indexPath = path.join(__dirname, `../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });

    this.app.listen(this.port, () => {
      console.log(`SERVER run in port ${this.port}`);
    });
  }
}

// instnacio server lo llamo en app le paso argumentos que se inician aca en el constructor
// que luego debo llamar en el app esos argumentos
