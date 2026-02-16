import { url } from "node:inspector";
import { Cache } from "./pokecache.js";
import { ExecOptionsWithStringEncoding } from "node:child_process";

export class PokeAPI {
    private static readonly baseURL = "https://pokeapi.co/api/v2"
    private cache: Cache;

    constructor(cacheInterval: number) {
        this.cache = new Cache(cacheInterval);
    }

    closeCache() {
        this.cache.stopReapLoop();
    }

    async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
        const fullURL = pageURL || `${PokeAPI.baseURL}/location-area`;
        const cached = this.cache.get<ShallowLocations>(fullURL);
        if (cached) {
            return cached;
        }

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`Response status: ${resp.status}`);
            }
            const locations: ShallowLocations = await resp.json();
            this.cache.add(fullURL, locations);
            return locations;
        } catch (e) {
            throw new Error(`Error fetching locations: ${(e as Error).message}`);
        }
    }

    async fetchLocation(locationName: string): Promise<Location> {
        const fullURL = `${PokeAPI.baseURL}/location-area/${locationName}`;
        const cached = this.cache.get<Location>(fullURL);
        if (cached) {
            return cached;
        }

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`Response status: ${resp.status}`);
            }
            const location: Location = await resp.json();
            this.cache.add(fullURL, location);
            return location;
        } catch (e) {
            throw new Error(`Error fetching location '${locationName}': ${(e as Error).message}`);
        }
    }

    async fetchPokemon(pokemonName: string): Promise<Pokemon> {
        const fullURL = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;
        const cached = this.cache.get<Pokemon>(fullURL);
        if (cached) {
            return cached
        }

        try {
            const resp = await fetch(fullURL);
            if (!resp.ok) {
                throw new Error(`Response status: ${resp.status}`);
            }
            const pokemon: Pokemon = await resp.json();
            this.cache.add(fullURL, pokemon);
            return pokemon;
        } catch (e) {
            throw new Error(`Error fetching pokemon '${pokemonName}': ${(e as Error).message}`);
        }
    }
}

export type ShallowLocations = {
    count: number;
    next: string;
    previous: string;
    results: { name: string, url: string }[];
};

export type Location = {
    encounter_method_rates: {
        encounter_method: {
            name: string;
            url: string;
        };
        version_details: {
            rate: number;
            version: {
                name: string;
                url: string;
            }
        };
    }[];
    game_index: number;
    id: number;
    location: {
        name: string;
        url: string;
    };
    name: string;
    names: {
        language: {
            name: string;
            url: string;
        };
        name: string;
    }[];
    pokemon_encounters: {
        pokemon: {
            name: string;
            url: string;
        };
        version_details: {
            encounter_details: {
                chance: number;
                condition_values: any[];
                max_level: number;
                method: {
                    name: string;
                    url: string;
                };
                min_level: number;
            }[];
            max_chance: number;
            version: {
                name: string;
                url: string
            };
        }[];
    }[];
};

export interface Pokemon {
  abilities: Ability[]
  base_experience: number
  cries: Cries
  forms: Form[]
  game_indices: Index[]
  height: number
  held_items: HeldItem[]
  id: number
  is_default: boolean
  location_area_encounters: string
  moves: Mfe[]
  name: string
  order: number
  past_abilities: PastAbility[]
  past_stats: PastStat[]
  past_types: any[]
  species: Species
  sprites: Sprites
  stats: Stat3[]
  types: Type[]
  weight: number
}

export interface Ability {
  ability: Ability2
  is_hidden: boolean
  slot: number
}

export interface Ability2 {
  name: string
  url: string
}

export interface Cries {
  latest: string
  legacy: string
}

export interface Form {
  name: string
  url: string
}

export interface Index {
  game_index: number
  version: Version
}

export interface Version {
  name: string
  url: string
}

export interface HeldItem {
  item: Item
  version_details: VersionDetail[]
}

export interface Item {
  name: string
  url: string
}

export interface VersionDetail {
  rarity: number
  version: Version2
}

export interface Version2 {
  name: string
  url: string
}

export interface Mfe {
  move: Move
  version_group_details: VersionGroupDetail[]
}

export interface Move {
  name: string
  url: string
}

export interface VersionGroupDetail {
  level_learned_at: number
  move_learn_method: MoveLearnMethod
  order?: number
  version_group: VersionGroup
}

export interface MoveLearnMethod {
  name: string
  url: string
}

export interface VersionGroup {
  name: string
  url: string
}

export interface PastAbility {
  abilities: Ability3[]
  generation: Generation
}

export interface Ability3 {
  ability: any
  is_hidden: boolean
  slot: number
}

export interface Generation {
  name: string
  url: string
}

export interface PastStat {
  generation: Generation2
  stats: Stat[]
}

export interface Generation2 {
  name: string
  url: string
}

export interface Stat {
  base_stat: number
  effort: number
  stat: Stat2
}

export interface Stat2 {
  name: string
  url: string
}

export interface Species {
  name: string
  url: string
}

export interface Sprites {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
  other: Other
  versions: Versions
}

export interface Other {
  dream_world: DreamWorld
  home: Home
  "official-artwork": OfficialArtwork
  showdown: Showdown
}

export interface DreamWorld {
  front_default: string
  front_female: any
}

export interface Home {
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface OfficialArtwork {
  front_default: string
  front_shiny: string
}

export interface Showdown {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: any
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface Versions {
  "generation-i": GenerationI
  "generation-ii": GenerationIi
  "generation-iii": GenerationIii
  "generation-iv": GenerationIv
  "generation-ix": GenerationIx
  "generation-v": GenerationV
  "generation-vi": GenerationVi
  "generation-vii": GenerationVii
  "generation-viii": GenerationViii
}

export interface GenerationI {
  "red-blue": RedBlue
  yellow: Yellow
}

export interface RedBlue {
  back_default: string
  back_gray: string
  back_transparent: string
  front_default: string
  front_gray: string
  front_transparent: string
}

export interface Yellow {
  back_default: string
  back_gray: string
  back_transparent: string
  front_default: string
  front_gray: string
  front_transparent: string
}

export interface GenerationIi {
  crystal: Crystal
  gold: Gold
  silver: Silver
}

export interface Crystal {
  back_default: string
  back_shiny: string
  back_shiny_transparent: string
  back_transparent: string
  front_default: string
  front_shiny: string
  front_shiny_transparent: string
  front_transparent: string
}

export interface Gold {
  back_default: string
  back_shiny: string
  front_default: string
  front_shiny: string
  front_transparent: string
}

export interface Silver {
  back_default: string
  back_shiny: string
  front_default: string
  front_shiny: string
  front_transparent: string
}

export interface GenerationIii {
  emerald: Emerald
  "firered-leafgreen": FireredLeafgreen
  "ruby-sapphire": RubySapphire
}

export interface Emerald {
  front_default: string
  front_shiny: string
}

export interface FireredLeafgreen {
  back_default: string
  back_shiny: string
  front_default: string
  front_shiny: string
}

export interface RubySapphire {
  back_default: string
  back_shiny: string
  front_default: string
  front_shiny: string
}

export interface GenerationIv {
  "diamond-pearl": DiamondPearl
  "heartgold-soulsilver": HeartgoldSoulsilver
  platinum: Platinum
}

export interface DiamondPearl {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface HeartgoldSoulsilver {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface Platinum {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface GenerationIx {
  "scarlet-violet": ScarletViolet
}

export interface ScarletViolet {
  front_default: string
  front_female: any
}

export interface GenerationV {
  "black-white": BlackWhite
}

export interface BlackWhite {
  animated: Animated
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface Animated {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface GenerationVi {
  "omegaruby-alphasapphire": OmegarubyAlphasapphire
  "x-y": XY
}

export interface OmegarubyAlphasapphire {
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface XY {
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface GenerationVii {
  icons: Icons
  "ultra-sun-ultra-moon": UltraSunUltraMoon
}

export interface Icons {
  front_default: string
  front_female: any
}

export interface UltraSunUltraMoon {
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
}

export interface GenerationViii {
  "brilliant-diamond-shining-pearl": BrilliantDiamondShiningPearl
  icons: Icons2
}

export interface BrilliantDiamondShiningPearl {
  front_default: string
  front_female: any
}

export interface Icons2 {
  front_default: string
  front_female: string
}

export interface Stat3 {
  base_stat: number
  effort: number
  stat: Stat4
}

export interface Stat4 {
  name: string
  url: string
}

export interface Type {
  slot: number
  type: Type2
}

export interface Type2 {
  name: string
  url: string
}
