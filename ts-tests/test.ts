import { Module } from "../src/ts/base/Module";

const mod = new Module({
});

mod.changeProp({
    height: 5,
});

mod.callbacks.add({
    target: "changeProp",
    do: () => {

    },
});
