import {Injectable} from "@angular/core";
import {ModulesService} from "@solenopsys/fl-globals";
import {loadRemoteModule} from "@angular-architects/module-federation";

import {Select, Store} from "@ngxs/store";
import {Cluster, ClusterState} from "@solenopsys/fl-clusters";
import {Observable} from "rxjs";
import {LoadingComponent} from "./app.module";
import {NavigationStart, Router} from "@angular/router";
import {NewClusterComponent} from "./new-cluster/new-cluster";
import {PluginsComponent} from "./plugins/plugins.component";


const loadMod = (host, key, modUrl): any => { //  const remoteEntry = host + `remoteEntry.js`;

    console.log("RE", modUrl)
    return {

        path: key,
        loadChildren:
            () => loadRemoteModule({

                remoteEntry: modUrl + "/remoteEntry.js",
                type: "module",
                exposedModule: "./Module"
            })
                .then(m => {
                    return m.RemoteEntryModule;
                })

    };
};


@Injectable({
    providedIn: "root"
})
export class RouteLoaderService {

    @Select(ClusterState.getCurrent) current$!: Observable<Cluster>;
    loadedModules: { [key: string]: boolean } = {}


    constructor(
        private modulesService: ModulesService,
        private router: Router,
        private store: Store
    ) {
        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                const rs = [
                    {path: '', redirectTo: 'clusters', pathMatch: 'full'},
                    {path: "clusters", component: NewClusterComponent},
                    {path: "plugins", component: PluginsComponent},
                    {path: '**', component: LoadingComponent}
                ];

                const strings = event.url.split("/");
                const firstSegmentOfUrl = strings[1]
                if (firstSegmentOfUrl != "" && !this.loadedModules[firstSegmentOfUrl]) {
                    const path = firstSegmentOfUrl;
                    const currentCluster = this.store.selectSnapshot(ClusterState.getCurrent);


                    if (currentCluster) {
                        // load module
                        const hostUrl = "http://" + currentCluster.host;
                        rs.push(loadMod(hostUrl, firstSegmentOfUrl, path)); //todo убрать этот костыль

                        // this.router.resetConfig([...rs, {path: '**', component: LoadingComponent}]);
                        this.loadedModules[firstSegmentOfUrl] = true;
                        this.router.navigate([firstSegmentOfUrl])
                    }

                }

            }
        });

    }

    load() {

        this.current$?.subscribe(cluster => {
            const hostUrl = "http://" + cluster.host;
            this.modulesService.loadModules(hostUrl).then((names: string[]) => {
                console.log("LOAD MODULE START", names);

                // const rs = staticRoutes;
                // names.forEach(name => {
                //    rs.push(loadMod(hostUrl, name.replace("richteri/", ""), name)); //todo убрать этот костыль
                // });
                // this.router.resetConfig(rs);
                // console.log("ROUTE UPDATE",rs);
            });
        });


    }
}
