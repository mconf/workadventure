import "jasmine";
import { MapStore } from "../../../src/Stores/Utils/MapStore";
import type { Readable, Writable } from "svelte/store";
import { get, writable } from "svelte/store";

describe("Main store", () => {
    it("Set / delete / clear triggers main store updates", () => {
        const mapStore = new MapStore<string, string>();

        let triggered = false;

        mapStore.subscribe((map) => {
            triggered = true;
            expect(map).toBe(mapStore);
        });

        expect(triggered).toBeTrue();
        triggered = false;
        mapStore.set("foo", "bar");
        expect(triggered).toBeTrue();

        triggered = false;
        mapStore.delete("baz");
        expect(triggered).toBe(false);
        mapStore.delete("foo");
        expect(triggered).toBe(true);

        triggered = false;
        mapStore.clear();
        expect(triggered).toBe(true);
    });

    it("generates stores for keys with getStore", () => {
        const mapStore = new MapStore<string, string>();

        let valueReceivedInStoreForFoo: string | undefined;
        let valueReceivedInStoreForBar: string | undefined;

        mapStore.set("foo", "someValue");

        mapStore.getStore("foo").subscribe((value) => {
            valueReceivedInStoreForFoo = value;
        });
        const unsubscribeBar = mapStore.getStore("bar").subscribe((value) => {
            valueReceivedInStoreForBar = value;
        });

        expect(valueReceivedInStoreForFoo).toBe("someValue");
        expect(valueReceivedInStoreForBar).toBe(undefined);
        mapStore.set("foo", "someOtherValue");
        expect(valueReceivedInStoreForFoo).toBe("someOtherValue");
        mapStore.delete("foo");
        expect(valueReceivedInStoreForFoo).toBe(undefined);
        mapStore.set("bar", "baz");
        expect(valueReceivedInStoreForBar).toBe("baz");
        mapStore.clear();
        expect(valueReceivedInStoreForBar).toBe(undefined);
        unsubscribeBar();
        mapStore.set("bar", "fiz");
        expect(valueReceivedInStoreForBar).toBe(undefined);
    });

    it("generates stores with getStoreByAccessor", () => {
        const mapStore = new MapStore<
            string,
            {
                foo: string;
                store: Writable<string | undefined>;
            }
        >();

        const fooStore = mapStore.getNestedStore("foo", (value) => {
            return value.store;
        });

        mapStore.set("foo", {
            foo: "bar",
            store: writable("init"),
        });

        expect(get(fooStore)).toBe("init");

        mapStore.get("foo")?.store.set("newVal");

        expect(get(fooStore)).toBe("newVal");

        mapStore.get("foo")?.store.set("newVal2");

        expect(get(fooStore)).toBe("newVal2");

        const anotherFooStore = mapStore.getNestedStore("foo", (value) => {
            return value.store;
        });

        expect(get(anotherFooStore)).toBe("newVal2");

        const anotherValue: string | undefined = undefined;
        const anotherUnsubscribe = anotherFooStore.subscribe((val) => anotherValue);

        mapStore.get("foo")?.store.set(undefined);
        expect(get(fooStore)).toBeUndefined();
        expect(anotherValue).toBeUndefined();
        mapStore.get("foo")?.store.set(undefined);
        expect(get(fooStore)).toBeUndefined();

        mapStore.delete("foo");
        mapStore.delete("foo");

        anotherUnsubscribe();

        // Try calling unsusbscribe twice in a row. This should not cause issues.
        //anotherUnsubscribe();

        /*expect(get(anotherFooStore)).toBe("anotherVal");*/

        mapStore.set("foo", {
            foo: "bar",
            store: writable("anotherVal"),
        });

        expect(get(fooStore)).toBe("anotherVal");

        mapStore.get("foo")?.store.set(undefined);
        mapStore.delete("foo");

        expect(get(fooStore)).toBeUndefined();

        mapStore.delete("foo");
        expect(get(fooStore)).toBeUndefined();
    });
});
