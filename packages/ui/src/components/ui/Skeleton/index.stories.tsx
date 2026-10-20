import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Spinner } from '@/components/ui/Spinner/index';
import { Stack } from '@/components/ui/Stack/index';
import { Skeleton } from './index';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { width: '40%', height: '1.5em' },
  argTypes: {
    radius: { control: 'inline-radio', options: ['none', 'xs', 'md', 'xl', 'full'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '読み込み中に、中身の形だけを先に見せる。読み上げには出さないので、読み込み中であることは Spinner（文言は隠してよい）や aria-busy で別に伝える。動きを減らす設定では点滅しない。',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  render: (args) => (
    <Stack gap="sm" className="max-w-prose">
      <Skeleton {...args} />
      <Skeleton width="90%" />
      <Skeleton width="60%" />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[aria-hidden="true"]').length).toBe(3);
  },
};

/** カードの読み込み中。待っている領域に aria-busy を立て、状態は Spinner で読み上げに伝える */
export const Card: Story = {
  render: () => (
    <div aria-busy="true" className="max-w-prose rounded-xl border border-border p-inset-xl">
      <Spinner label="お知らせを読み込んでいます" className="sr-only" />
      <Stack gap="sm">
        <Stack direction="horizontal" gap="sm">
          <Skeleton
            width="var(--8341-size-control-md)"
            height="var(--8341-size-control-md)"
            radius="full"
            className="shrink-0"
          />
          <Skeleton width="30%" height="1.25em" />
        </Stack>
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="33%" height="var(--8341-size-control-md)" radius="md" />
      </Stack>
    </div>
  ),
};
