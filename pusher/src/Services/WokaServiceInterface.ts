import { CharacterListInterface } from "_Enum/PlayerTextures";

export interface WokaServiceInterface {
    /**
     * Returns the list of all available Wokas for the current user.
     */
    getWokaList(): Promise<CharacterListInterface>;

    /**
     * Returns the URL of all the images for the given layer names.
     *
     * Key: layer name
     * Value: URL
     *
     * If one of the layers cannot be found, undefined is returned (and the user should be redirected to Woka choice page!)
     */
    fetchWokaDetails(layerNames: string[]): Promise<Map<string, string> | undefined>;
}
