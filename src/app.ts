import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(()=>{
    main();
})();

function main() {

    const server = new Server({
        port: envs.PORT,
        public_path: envs.PUBLIC_PATH,
        // llamo a mi archivo de rutas que a su vez llama a los endpoinbts
        routes: AppRoutes.routes,
    });

    server.start();

}