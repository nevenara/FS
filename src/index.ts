import { FansafeServer } from "./http/fansafe-server";
import { Bootstrapper } from "./bootstrapper";
const express = require("express");


(async () => {
    await Bootstrapper.init();
    
    const app = express();
    const server = new FansafeServer(app);
    await server.start();
})()