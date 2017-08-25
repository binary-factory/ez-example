import 'reflect-metadata';

import {
    controller,
    Controller,
    EzContext,
    EzPluginManager,
    EzRouter,
    EzRouterPlugin,
    EzServer,
    get,
    Type
} from '@binary-factory/ez-http';
import * as inversify from 'inversify';

const routerPlugin = new EzRouterPlugin();
EzPluginManager.registerPlugin(routerPlugin).then(() => {
    console.log(EzPluginManager.plugins);
});


const router = new EzRouter();
router.get('/', () => {
    console.log('root');
});

const server = new EzServer();
server.use(router);
server.listen(8080);


@controller('/test')
class Test implements Controller {
    constructor() {
        console.log('test created.');
    }

    @get()
    test(context: EzContext) {
        context.json({ status: 'ok' });
    }
}

// set up container
let container = new inversify.Container();
// note that you *must* bind your controllers to Controller
container.bind<Controller>(Type.Controller).to(Test).whenTargetNamed('TestController');

server.registerContainer(container);