import { CharacterListInterface } from "_Enum/PlayerTextures";
import { WokaServiceInterface } from "./WokaServiceInterface";

class AdminWokaService implements WokaServiceInterface {
    /**
     * Returns the list of all available Wokas for the current user.
     */
    async getWokaList(): Promise<CharacterListInterface> {
        // TODO
        throw new Error("Not implemented yet");
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
        // TODO
        throw new Error("Not implemented yet");
    }
}

export const adminWokaService = new AdminWokaService();
