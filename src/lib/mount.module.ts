import {NgModule} from "@angular/core";
import {HStreamService, StreamsPool, WsPool} from "@solenopsys/fl-hyperstreams";

@NgModule({
  providers:[HStreamService,StreamsPool,WsPool]
})
export class MountModule {}
