import {Injectable} from '@angular/core';
import {ListSource} from '../../shared/models/list-source.enum';
import {MonsterType} from '../../shared/models/creatures/monsters/monster-type.enum';
import {FilterOption} from '../components/filters/filter-option';
import {TranslateService} from '@ngx-translate/core';
import {ChallengeRating} from '../../shared/models/creatures/monsters/challenge-rating.enum';
import {ListObject} from '../../shared/models/list-object';
import {AlignmentService} from './attributes/alignment.service';

@Injectable({
  providedIn: 'root'
})
export class MonsterFilterService {
  defaultOption = 'ALL';
  monsterTypes: FilterOption[] = [];
  challengeRatings: FilterOption[] = [];
  alignments: FilterOption[] = [];

  constructor(
    private translate: TranslateService,
    private alignmentService: AlignmentService
  ) { }

  initializeFilterOptions(listSource: ListSource = ListSource.MY_STUFF): Promise<any> {
    this.initializeMonsterTypes();
    this.initializeChallengeRatings();

    const promises: Promise<any>[] = [];
    promises.push(this.initializeAlignments(listSource));
    return Promise.all(promises);
  }

  private initializeMonsterTypes(): void {
    const types: MonsterType[] = [];
    types.push(MonsterType.ABERRATION);
    types.push(MonsterType.BEAST);
    types.push(MonsterType.CELESTIAL);
    types.push(MonsterType.CONSTRUCT);
    types.push(MonsterType.DRAGON);
    types.push(MonsterType.ELEMENTAL);
    types.push(MonsterType.FEY);
    types.push(MonsterType.FIEND);
    types.push(MonsterType.GIANT);
    types.push(MonsterType.HUMANOID);
    types.push(MonsterType.MONSTROSITY);
    types.push(MonsterType.OOZE);
    types.push(MonsterType.PLANT);
    types.push(MonsterType.UNDEAD);

    this.monsterTypes = [];
    this.monsterTypes.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.monsterTypes = this.monsterTypes.concat(this.getMonsterTypeFilters(types));
  }

  private getMonsterTypeFilters(monsterTypes: MonsterType[]): FilterOption[] {
    const filters: FilterOption[] = [];
    monsterTypes.forEach((monsterType: MonsterType) => {
      filters.push(new FilterOption(monsterType, this.translate.instant('MonsterType.' + monsterType)));
    });
    return filters;
  }

  private initializeChallengeRatings(): void {
    const types: ChallengeRating[] = [];
    types.push(ChallengeRating.ZERO);
    types.push(ChallengeRating.EIGHTH);
    types.push(ChallengeRating.QUARTER);
    types.push(ChallengeRating.HALF);
    types.push(ChallengeRating.ONE);
    types.push(ChallengeRating.TWO);
    types.push(ChallengeRating.THREE);
    types.push(ChallengeRating.FOUR);
    types.push(ChallengeRating.FIVE);
    types.push(ChallengeRating.SIX);
    types.push(ChallengeRating.SEVEN);
    types.push(ChallengeRating.EIGHT);
    types.push(ChallengeRating.NINE);
    types.push(ChallengeRating.TEN);
    types.push(ChallengeRating.ELEVEN);
    types.push(ChallengeRating.TWELVE);
    types.push(ChallengeRating.THIRTEEN);
    types.push(ChallengeRating.FOURTEEN);
    types.push(ChallengeRating.FIFTEEN);
    types.push(ChallengeRating.SIXTEEN);
    types.push(ChallengeRating.SEVENTEEN);
    types.push(ChallengeRating.EIGHTEEN);
    types.push(ChallengeRating.NINETEEN);
    types.push(ChallengeRating.TWENTY);
    types.push(ChallengeRating.TWENTY_ONE);
    types.push(ChallengeRating.TWENTY_TWO);
    types.push(ChallengeRating.TWENTY_THREE);
    types.push(ChallengeRating.TWENTY_FOUR);
    types.push(ChallengeRating.TWENTY_FIVE);
    types.push(ChallengeRating.TWENTY_SIX);
    types.push(ChallengeRating.TWENTY_SEVEN);
    types.push(ChallengeRating.TWENTY_EIGHT);
    types.push(ChallengeRating.TWENTY_NINE);
    types.push(ChallengeRating.THIRTY);

    this.challengeRatings = [];
    this.challengeRatings.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.challengeRatings = this.challengeRatings.concat(this.getChallengeRatingFilters(types));
  }

  private getChallengeRatingFilters(challengeRatings: ChallengeRating[]): FilterOption[] {
    const filters: FilterOption[] = [];
    challengeRatings.forEach((challengeRating: ChallengeRating) => {
      filters.push(new FilterOption(challengeRating, this.translate.instant('ChallengeRating.' + challengeRating)));
    });
    return filters;
  }

  private initializeAlignments(listSource: ListSource): Promise<any> {
    this.alignments = [];
    this.alignments.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    return this.alignmentService.getAlignments(listSource).then((alignments: ListObject[]) => {
      alignments.forEach((alignment: ListObject) => {
        this.alignments.push(new FilterOption(alignment.id, alignment.name));
      });
    });
  }
}
