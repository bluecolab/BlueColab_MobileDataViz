import { render } from '@testing-library/react-native';
import HomeStackLayout from '@/app/(tabs)/home/_layout';
import { Stack } from 'expo-router';

jest.mock('expo-router', () => ({
    Stack: jest.fn(() => null),
}));

describe('<HomeStackLayout />', () => {
    it('renders the Stack component', () => {
        render(<HomeStackLayout />);
        expect(Stack).toHaveBeenCalled();
    });
});
