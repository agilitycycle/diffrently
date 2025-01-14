import { fn } from '@storybook/test';
import {
  SecondaryActionButton
} from '../components/';

// https://storybook.js.org/docs/api/arg-types
// https://www.juango.dev/posts/dark-mode-tailwind-storybook
// https://storybook.js.org/docs/essentials/backgrounds
const Button = ({label, type, size, className}) => {
  if (type === 'SecondaryAction') {
    const css = (size === 'small') ? 'px-5 p-1.5' : 'px-5 p-2.5';
    return <SecondaryActionButton onClick={() => {}} css={css} label={label} />
  }

  return (<button onClick={() => {}} className={className}>
      <span>{label}</span>
    </button>)
}

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium']
    }
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export const PrimaryAction = {
  args: {
    label: 'Publish',
    className: 'text-white bg-[#f87341] rounded-full text-xl uppercase px-14 py-3.5'
  },
};

export const SecondaryAction = {
  args: {
    type: 'SecondaryAction',
    label: 'Generate',
    size: "small"
  },
};

export const LoadMore = {
  args: {
    label: 'Load More',
    className: 'text-white bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg font-medium text-sm px-5 py-2.5'
  },
};