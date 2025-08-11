export interface SeasonalFacts {
    [season: string]: string;
}

export interface AnimalFact {
    animalName: string;
    scientificName: string;
    defaultFact: string;
    imageUri: string;
    seasonalFacts: SeasonalFacts;
}
