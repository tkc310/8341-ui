import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vite-plus/test';
import { Accordion, AccordionItem } from './index';

describe('Accordion', () => {
  it('見出しの中のボタンで開閉し、aria-expanded を切り替える', async () => {
    render(
      <Accordion>
        <AccordionItem summary="質問" headingLevel={2}>
          回答
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole('button', { name: '質問' });
    expect(screen.getByRole('heading', { level: 2, name: '質問' })).toContainElement(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});
