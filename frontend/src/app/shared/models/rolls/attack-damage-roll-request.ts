import {RollRequest} from './roll-request';

export class AttackDamageRollRequest {
  attack: RollRequest;
  damage: RollRequest;

  constructor(attack: RollRequest, damage: RollRequest) {
    this.attack = attack;
    this.damage = damage;
  }
}
