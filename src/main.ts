import 'reflect-metadata';

import {
    context,
    controller,
    EzContext,
    EzController,
    EzPluginManager,
    EzRouter,
    EzRouterPlugin,
    EzServer,
    get,
    MiddlewareAction,
    param,
    query,
} from '@binary-factory/ez-http';
import { Container, injectable } from 'inversify';

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
server.listen(8080).then(() => console.log(`server on da line: ${server.server.address().port}`));

@injectable()
@controller('/test')
class Test {
    constructor() {
        console.log('test created.');
    }

    @get('/:id')
    test(@context() context: EzContext,
         @param('id') id: string,
         @query('test') test: string) {

        context.json({
            id,
            test
        });

        return MiddlewareAction.SkipHolder;
    }
}

const Type = {
    Controller: Symbol('ezController')
};

// set up container
let container = new Container();
container
    .bind<EzController>(Type.Controller)
    .to(Test)
    .whenTargetNamed('TestController');

const controllers: EzController[] = container.getAll<EzController>(Type.Controller);
server.registerControllers(controllers);