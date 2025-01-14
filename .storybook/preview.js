import { withThemeByDataAttribute } from '@storybook/addon-styling';
/** @type { import('@storybook/react').Preview } */
import './global.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
	withThemeByDataAttribute({
		themes: {
			light: '',
			dark: 'dark',
		},
		defaultTheme: 'dark',
		attributeName: 'class',
	}),
];

export default preview;
