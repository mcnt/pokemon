import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PokemonDetail } from '../models/pokemon.model';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
})
export class PokemonDetailComponent {
  @Input() pokemon!: PokemonDetail;

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }
}
