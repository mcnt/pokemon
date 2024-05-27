import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { Router } from '@angular/router';
import { PokemonListResponse, PokemonDetail } from '../models/pokemon.model';
import { ModalController } from '@ionic/angular';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  pokemons: PokemonDetail[] = [];
  offset: number = 0;
  limit: number = 20;
  loading: boolean = false;
  favorites: Set<number> = new Set<number>();
  totalPokemons: number = 0
  pageSize: number = 7; // Número de páginas mostradas na paginação
  constructor(private pokemonService: PokemonService, private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe((data: PokemonListResponse) => {
      // Limpa a lista de pokémons antes de adicionar novos dados
      this.pokemons = [];
      this.totalPokemons = data.count
      data.results.forEach(pokemonData => {

        this.pokemonService.getPokemon(pokemonData.name).subscribe(pokemonDetail => {
          this.pokemons.push(pokemonDetail);
        });
      });
    });
  }
  async openDetailsModal(pokemon: PokemonDetail) {
    const modal = await this.modalController.create({
      component: PokemonDetailComponent,
      componentProps: { pokemon }
    });
    return await modal.present();
  }
  toggleFavorite(pokemon: PokemonDetail) {
    let favoritesStr = localStorage.getItem('favorites');
    const favorites = new Set<number>(favoritesStr ? JSON.parse(favoritesStr) : []);
    if (favorites.has(pokemon.id)) {
      favorites.delete(pokemon.id);
    } else {
      favorites.add(pokemon.id);
    }
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }
  
  isFavorite(pokemon: PokemonDetail): boolean {
    let favoritesStr = localStorage.getItem('favorites');
    const favorites = new Set<number>(favoritesStr ? JSON.parse(favoritesStr) : []);
    return favorites.has(pokemon.id);
  }
  
 
  previousPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.loadPokemons();
    }
  }
  nextPage() {
    if (this.offset + this.limit < this.totalPokemons) {
      this.offset += this.limit;
      this.loadPokemons();
    }
  }

  goToPage(pageNumber: number) {
    this.offset = (pageNumber - 1) * this.limit;
    this.loadPokemons();
  }

  getPageNumbers(): number[] {
    const currentPage = Math.floor(this.offset / this.limit) + 1;
    const totalPages = Math.ceil(this.totalPokemons / this.limit);

    let startPage = currentPage - Math.floor(this.pageSize / 2);
    if (startPage < 1) startPage = 1;

    let endPage = startPage + this.pageSize - 1;
    if (endPage > totalPages) endPage = totalPages;

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }

  isCurrentPage(pageNumber: number): boolean {
    return Math.floor(this.offset / this.limit) + 1 === pageNumber;
  }

  
}
