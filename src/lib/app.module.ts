import {APP_INITIALIZER, Component, NgModule, ViewEncapsulation} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";


import {APP_BASE_HREF, CommonModule} from "@angular/common";
import {UILayoutsModule} from "@solenopsys/ui-layouts";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ModulesService} from "@solenopsys/fl-globals";
import {RouteLoaderService} from "./route-loader.service";
import {
    BootstrapComponent,
    GridState,
    InterfaceState,
    MenuLoaderService,
    MenuState,
    UITemplatesModule
} from "@solenopsys/ui-templates";
import {ClusterState} from "@solenopsys/fl-clusters";
import {createNgxs, DataStorageModule} from "@solenopsys/fl-storage";
import {RowsState, UIListsModule} from "@solenopsys/ui-lists";
import {DataHstreamModule, HStreamService, HStreamsState, StreamsPool, WsPool} from "@solenopsys/fl-hyperstreams";
import {MountModule} from "./mount.module";
import {PluginsComponent} from "./plugins/plugins.component";
import {UIFormsModule} from "@solenopsys/ui-forms";
import {HelmRepositoriesState} from "@solenopsys/fl-helm";
import {InstallationsState} from "@solenopsys/fl-installer";
import {NGXS_PLUGINS, Store} from "@ngxs/store";
import {NgxsLoggerPlugin} from "@ngxs/logger-plugin";
import {RouterModule} from "@angular/router";
import {Subject} from "rxjs";
import {ColorSchemesService} from "@solenopsys/ui-themes";
import {ClustersMenuProvider} from "./cluster-menu-provider";
import {NewClusterComponent} from "./new-cluster/new-cluster";
import {UIControlsModule} from "@solenopsys/ui-controls";


export const STATES=[InterfaceState, MenuState, ClusterState, GridState, RowsState, HStreamsState, HelmRepositoriesState, InstallationsState]
const menu$ = new Subject()

export function ensureRoutesExist(
    http: ModulesService,
    routeLoader: RouteLoaderService
) {
    return () => routeLoader.load();
}

@Component({
    template: "Loading..",
    encapsulation: ViewEncapsulation.Emulated
})
export class LoadingComponent {


}


@NgModule({
    declarations: [LoadingComponent,
        NewClusterComponent,
        PluginsComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,


        RouterModule.forRoot(
            [
                {path: '', redirectTo: 'clusters', pathMatch: 'full'},
                {path: "clusters", component: NewClusterComponent},
                {path: "plugins", component: PluginsComponent},
                {path: '**', component: LoadingComponent}
            ]
        ),
        MountModule,
        DataStorageModule,

        HttpClientModule,
        DataHstreamModule,
        UILayoutsModule,

        UITemplatesModule,
        UIListsModule,
        UIFormsModule,
        UIControlsModule

    ],
    providers: [WsPool, HStreamService, StreamsPool,
        {
            provide: APP_INITIALIZER,
            useFactory: ensureRoutesExist,
            multi: true,
            deps: [ModulesService, RouteLoaderService],
        },
        {
            provide: NGXS_PLUGINS,
            useClass: NgxsLoggerPlugin,
            multi: true
        },
        {provide: 'logo', useValue: "converged"},
        {provide: 'menu', useValue: menu$.asObservable()},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: 'assets_dir', useValue: ''},
    ],
    bootstrap: [BootstrapComponent],
})
export class AppModule {
    constructor(
        private http: HttpClient,
        private store: Store, menuLoaderService: MenuLoaderService,
        private colorService: ColorSchemesService) {

        menuLoaderService.addProvider("clusterMenuProvider", new ClustersMenuProvider())
        menuLoaderService.addMapping("clusters", "clusterMenuProvider")
    }
}
