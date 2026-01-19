import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
    addons: ['@storybook/addon-essentials', '@storybook/blocks'],
    framework: {
        name: '@storybook/sveltekit',
        options: {}
    }
};
export default config;
