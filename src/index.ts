export * from './lib/app.module';

import {AppModule} from "./lib/app.module";
import {XsModule, XsModuleType} from "@solenopsys/fl-globals";

export const ENTRY:XsModule<AppModule> ={
    module: AppModule,
    type: XsModuleType.CLUSTER,
};
