import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './index';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: { items: [{ label: 'ホーム', href: '#' }, { label: '手続き', href: '#' }, { label: '引っ越しの手続き' }] },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
