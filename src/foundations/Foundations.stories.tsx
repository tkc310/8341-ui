import type { Meta, StoryObj } from '@storybook/react-vite';
import data from '../tokens/tokens.json';
import './foundations.css';

interface TokenEntry {
  name: string;
  cssVar: string;
  type: string;
  layer: 'primitive' | 'semantic';
  themed: boolean;
  value: unknown;
  ref?: unknown;
  description?: string;
}

const all = data.tokens as TokenEntry[];
const byPrefix = (prefix: string) => all.filter((t) => t.name.startsWith(prefix));

const meta = {
  title: 'Foundations',
  parameters: { layout: 'fullscreen', a11y: { test: 'todo' } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function hexOf(v: unknown) {
  return typeof v === 'string' ? v : '';
}

export const PrimitiveColors: Story = {
  name: 'Color / Primitive',
  render: () => {
    const families = [...new Set(byPrefix('color.primitive.').map((t) => t.name.split('.')[2]))].filter(
      (f) => f !== 'white' && f !== 'black',
    );
    return (
      <div className="fd-page">
        <p className="fd-lead">
          OKLCH で明度カーブを全色相で共有しているため、同じ段階番号ならどの色相でも白背景とのコントラストがほぼ同じになる。
          コンポーネントからは参照しない。
        </p>
        {families.map((family) => (
          <section key={family} className="fd-ramp">
            <h2 className="fd-ramp__title">{family}</h2>
            <div className="fd-ramp__row">
              {byPrefix(`color.primitive.${family}.`).map((t) => (
                <div key={t.name} className="fd-chip">
                  <div className="fd-chip__swatch" style={{ background: `var(${t.cssVar})` }} />
                  <code>{t.name.split('.').at(-1)}</code>
                  <code>{hexOf(t.value)}</code>
                  <span className="fd-chip__note">{t.description}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
};

export const SemanticColors: Story = {
  name: 'Color / Semantic',
  render: () => {
    const groups = ['bg', 'text', 'icon', 'border', 'focus'];
    return (
      <div className="fd-page">
        <p className="fd-lead">
          コンポーネントが参照するのはこの層だけ。ライト / ダークで値が切り替わる。ツールバーの Theme で確認できる。
        </p>
        {groups.map((g) => (
          <section key={g}>
            <h2 className="fd-ramp__title">color.{g}</h2>
            <table className="fd-table">
              <thead>
                <tr>
                  <th scope="col">見本</th>
                  <th scope="col">トークン</th>
                  <th scope="col">Light</th>
                  <th scope="col">Dark</th>
                  <th scope="col">用途</th>
                </tr>
              </thead>
              <tbody>
                {byPrefix(`color.${g}.`).map((t) => {
                  const v = t.value as { light: string; dark: string };
                  const r = t.ref as { light?: string; dark?: string };
                  return (
                    <tr key={t.name}>
                      <td>
                        <span className="fd-dot" style={{ background: `var(${t.cssVar})` }} />
                      </td>
                      <td>
                        <code>{t.name}</code>
                      </td>
                      <td>
                        <code>{r.light?.replace('color.primitive.', '') ?? v.light}</code>
                      </td>
                      <td>
                        <code>{r.dark?.replace('color.primitive.', '') ?? v.dark}</code>
                      </td>
                      <td>{t.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    );
  },
};

export const Typography: Story = {
  render: () => (
    <div className="fd-page">
      <p className="fd-lead">最小 14px。本文は 16px / 行間 1.7。字間は大きい文字ほど詰める。</p>
      {byPrefix('text.')
        .filter((t) => t.type === 'typography')
        .map((t) => {
          const v = t.value as Record<string, string | number>;
          const style = t.name.replace('text.', '');
          return (
            <div key={t.name} className="fd-type">
              <code className="fd-type__meta">
                .dsm-text-{style} — {String(v.fontSize)} / {String(v.lineHeight)} / {String(v.fontWeight)} /{' '}
                {String(v.letterSpacing)}
              </code>
              <p className={`dsm-text-${style}`} style={{ margin: 0 }}>
                すべての人に、やさしいデジタルを。Design System 0123
              </p>
            </div>
          );
        })}
    </div>
  ),
};

export const SpaceRadiusSize: Story = {
  name: 'Space / Radius / Size',
  render: () => (
    <div className="fd-page">
      {(['space.', 'radius.', 'size.'] as const).map((p) => (
        <section key={p}>
          <h2 className="fd-ramp__title">{p.slice(0, -1)}</h2>
          <table className="fd-table">
            <tbody>
              {byPrefix(p).map((t) => (
                <tr key={t.name}>
                  <td style={{ width: 240 }}>
                    <code>{t.name}</code>
                  </td>
                  <td style={{ width: 80 }}>
                    <code>{String(t.value)}</code>
                  </td>
                  <td>
                    {p === 'radius.' ? (
                      <span className="fd-radius" style={{ borderRadius: `var(${t.cssVar})` }} />
                    ) : (
                      <span className="fd-bar" style={{ width: `min(var(${t.cssVar}), 100%)` }} />
                    )}
                  </td>
                  <td>{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  ),
};

export const Elevation: Story = {
  render: () => (
    <div className="fd-page fd-row">
      {byPrefix('shadow.').map((t) => (
        <div key={t.name} className="fd-elevation" style={{ boxShadow: `var(${t.cssVar})` }}>
          <code>{t.name}</code>
          <span>{t.description}</span>
        </div>
      ))}
    </div>
  ),
};
