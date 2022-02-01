import { CharacterListInterface, LAYERS } from "_Enum/PlayerTextures";
import { WokaServiceInterface } from "./WokaServiceInterface";

class LocalWokaService implements WokaServiceInterface {
    /**
     * Returns the list of all available Wokas for the current user.
     */
    async getWokaList(): Promise<CharacterListInterface> {
        return LAYERS;
    }

    /**
     * Returns the URL of all the images for the given layer names.
     *
     * Key: layer name
     * Value: URL
     *
     * If one of the layers cannot be found, undefined is returned (and the user should be redirected to Woka choice page!)
     */
    async fetchWokaDetails(layerNames: string[]): Promise<Map<string, string> | undefined> {
        const layers = new Map<string, string>();
        for (const layerName of layerNames) {
            let found = false;
            for (const bodyResources of LAYERS.prefab) {
                const url = bodyResources.items[layerName];
                if (url !== undefined) {
                    layers.set(layerName, url);
                    found = true;
                    break;
                }
            }
            for (const bodyResources of LAYERS.custom) {
                const url = bodyResources.items[layerName];
                if (url !== undefined) {
                    layers.set(layerName, url);
                    found = true;
                    break;
                }
            }
            if (!found) {
                return undefined;
            }
        }
        return layers;
    }
}

export const localWokaService = new LocalWokaService();
