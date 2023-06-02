import {Component} from "@angular/core";


@Component(
    {
        selector: "app-cluster",
        templateUrl: "./new-cluster.html",
    }
)
export class NewClusterComponent{
    address:string;

    addCluster() {
        console.log("ADD CLUSTER")
    }
}