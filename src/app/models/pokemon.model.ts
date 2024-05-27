export interface PokemonListResponse {
    count: number;
    next: string;
    previous: string;
    results: PokemonListItem[];
  }
  
export interface PokemonListItem {
    name: string;
    url: string;
}
  
  
export interface PokemonDetail {
    id: number;
    name: string;
    sprites: { front_default: string };
    height: number;
    weight: number;
    abilities: { ability: { name: string } }[];
    types: { type: { name: string } }[];
}