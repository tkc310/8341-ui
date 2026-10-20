import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vite-plus/test';
import { expectNoA11yViolations } from '@/test/a11y';
import { Truncate } from './index';

const text = 'AWS (EC2 / ECS / RDS / DynamoDB / ElastiCache / S3 / CloudFront / Lambda)';

/** happy-dom はレイアウトを計算しないので、はみ出しの有無を差し替える */
function mockOverflow(overflowing: boolean) {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get: () => (overflowing ? 400 : 100),
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => 100 });
}

describe('Truncate', () => {
  afterEach(() => {
    // 差し替えを外し、Element.prototype の本来の定義に戻す
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollWidth');
    Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
  });

  it('収まっているときはフォーカスできず、ツールチップも出さない', async () => {
    mockOverflow(false);
    const user = userEvent.setup();
    const { container } = render(<Truncate>{text}</Truncate>);
    const el = screen.getByText(text);
    expect(el).not.toHaveAttribute('tabindex');
    await user.hover(el);
    expect(screen.getAllByText(text)).toHaveLength(1);
    await expectNoA11yViolations(container);
  });

  it('省略されたときはフォーカスでき、フォーカスすると全文を出す', async () => {
    mockOverflow(true);
    const user = userEvent.setup();
    render(<Truncate>{text}</Truncate>);
    const el = screen.getByText(text);
    expect(el).toHaveAttribute('tabindex', '0');
    await user.tab();
    expect(el).toHaveFocus();
    // ツールチップは見た目の補助なので読み上げには出さない（全文は元の文字で読まれる）
    expect(await screen.findByText(text, { ignore: '[tabindex]' })).toBeInTheDocument();
  });
});
