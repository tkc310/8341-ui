import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Stack } from '@/components/ui/Stack/index';
import { Truncate } from './index';

const long = 'AWS (EC2 / ECS(Fargate) / RDS / DynamoDB / ElastiCache / S3 / CloudFront / Lambda)';

const meta = {
  title: 'Components/Truncate',
  component: Truncate,
  args: { children: long },
  decorators: [
    (Story) => (
      <div className="w-1/2 max-w-prose min-w-0 border border-border p-inset-sm">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '1 行に収まらない文字を … で省略し、マウスを乗せるかフォーカスすると全文をツールチップで出す。省略されたときだけフォーカスできる。読み上げでは常に全文が読まれる。本文には使わず、表の列や一覧の項目名など幅が限られる場所に使う。',
      },
    },
  },
} satisfies Meta<typeof Truncate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByText(long);
    await expect(el).toHaveAttribute('tabindex', '0');
    // キーボードでも全文を確かめられる
    await userEvent.tab();
    await expect(el).toHaveFocus();
    await expect(await within(document.body).findAllByText(long)).toHaveLength(2);
  },
};

export const Fits: Story = {
  args: { children: 'TypeScript' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('TypeScript')).not.toHaveAttribute('tabindex');
  },
};

export const InList: Story = {
  render: () => (
    <Stack as="ul" gap="sm">
      {['React / TypeScript', long, 'Go (Echo / gRPC / sqlc / Testcontainers / OpenTelemetry / Cloud Run)'].map((t) => (
        <li key={t} className="min-w-0">
          <Truncate>{t}</Truncate>
        </li>
      ))}
    </Stack>
  ),
};
