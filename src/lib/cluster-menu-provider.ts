import {MenuLoaderProvider} from "@solenopsys/ui-templates";
import {MenuItem} from "@solenopsys/ui-navigate";

export class ClustersMenuProvider implements MenuLoaderProvider {


    load(dataKey: string): Promise<MenuItem[]> {
        return new Promise((resolve, reject) => {

            // todo HttpWebWorkerLoader
            // const menuLoader = new MenuResolver(new HttpLoader(this.httpClient), this.mapping$)
            //menuLoader.loadMenu().then(menu => {
            //   resolve(menu);
            // })

            const addItem: MenuItem = {
                name: "Add Cluster",
                icon: "flus",
                link: "/clusters/add",
                items: [],
                submenus: []
            };
            resolve([addItem])
        });
    }


}