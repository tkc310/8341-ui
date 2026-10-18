import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Text } from '@/components/ui/text';
import { Accordion, AccordionItem } from './accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Faq: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem summary="申請に必要なものは何ですか？">
        <Text>本人確認書類と、印鑑（署名の場合は不要）が必要です。</Text>
      </AccordionItem>
      <AccordionItem summary="代理人でも申請できますか？">
        <Text>委任状があれば可能です。</Text>
      </AccordionItem>
      <AccordionItem summary="手数料はかかりますか？">
        <Text>かかりません。</Text>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '代理人でも申請できますか？' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('委任状があれば可能です。')).toBeVisible();
  },
};
