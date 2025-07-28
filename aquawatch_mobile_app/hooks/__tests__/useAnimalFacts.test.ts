import useAnimalFacts from '@/hooks/useAnimalFacts';

describe('useAnimalFacts', () => {
    let result: ReturnType<typeof useAnimalFacts>;

    beforeEach(() => {
        result = useAnimalFacts();
    });

    it('returns choateWildlifeBase with correct structure', () => {
        const { choateWildlifeBase } = result;

        expect(choateWildlifeBase).toBeDefined();
        expect(Array.isArray(choateWildlifeBase)).toBe(true);

        // Check the structure of the first animal
        for (const animal of choateWildlifeBase) {
            expect(animal).toHaveProperty('animalName');
            expect(animal).toHaveProperty('scientificName');
            expect(animal).toHaveProperty('defaultFact');
            expect(animal).toHaveProperty('imageUri');
            expect(animal).toHaveProperty('seasonalFacts');
        }
    });

    it('returns hudsonWildlifeBase with correct structure', () => {
        const { hudsonWildlifeBase } = result;

        expect(hudsonWildlifeBase).toBeDefined();
        expect(Array.isArray(hudsonWildlifeBase)).toBe(true);

        for (const animal of hudsonWildlifeBase) {
            expect(animal).toHaveProperty('animalName');
            expect(animal).toHaveProperty('scientificName');
            expect(animal).toHaveProperty('defaultFact');
            expect(animal).toHaveProperty('imageUri');
            expect(animal).toHaveProperty('seasonalFacts');
        }
    });

    it('checks seasonal facts for a specific animal', () => {
        const { choateWildlifeBase } = result;

        const largemouthBass = choateWildlifeBase.find(
            (animal) => animal.animalName === 'Largemouth bass'
        );
        expect(largemouthBass).toBeDefined();
        expect(largemouthBass?.seasonalFacts.winter).toBe(
            'Largemouth Bass are currently slowing down their activity levels, seeking deeper water while feeding less frequently due to the colder temperatures affecting their metabolism.'
        );
    });
});
