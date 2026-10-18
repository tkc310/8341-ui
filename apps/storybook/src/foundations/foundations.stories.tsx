import type { Meta, StoryObj } from '@storybook/react-vite';
import data from 'tkc310-ui-tokens/tokens.json';

interface TokenEntry {
  name: string;
  cssVar: string;
  tailwind: string | null;
  type: string;
  layer: 'primitive' | 'semantic';
  themed: boolean;
  value: unknown;
  ref?: string;
  description?: string;
}

const light = data.tokens.light as TokenEntry[];
const dark = new Map((data.tokens.dark as TokenEntry[]).map((t) => [t.name, t]));
const pick = (prefix: string) => light.filter((t) => t.name.startsWith(prefix));
const hex = (v: unknown) => (v as { hex?: string })?.hex ?? '';
const dim = (v: unknown) => {
  const d = v as { value?: number; unit?: string };
  return d?.unit ? `${d.value}${d.unit}` : String(v);
};

const meta = {
  title: 'Foundations',
  parameters: { layout: 'fullscreen', a11y: { test: 'todo' } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Page = ({ lead, children }: { lead: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-stack-md bg-canvas p-inset-xl text-fg">
    <p className="m-0 max-w-prose text-fg-subtle">{lead}</p>
    {children}
  </div>
);

export const PrimitiveColors: Story = {
  name: 'Color / Primitive',
  render: () => {
    const families = [...new Set(pick('color.primitive.').map((t) => t.name.split('.')[2] as string))].filter(
      (f) => f !== 'white' && f !== 'black',
    );
    return (
      <Page lead="OKLCH の明度カーブを全色相で共有しているため、同じ段階番号ならどの色相でも白背景とのコントラストがほぼ同じになる。コンポーネントからは参照しない。">
        {families.map((family) => (
          <section key={family}>
            <h2 className="m-0 mb-stack-sm text-heading-xxs">{family}</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-gap-sm">
              {pick(`color.primitive.${family}.`).map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-gap-xs text-body-sm leading-(--tkc-text-dense-sm-line-height)"
                >
                  <div
                    className="h-12 rounded-md border border-border-subtle"
                    style={{ background: `var(${t.cssVar})` }}
                  />
                  <code>{t.name.split('.').at(-1)}</code>
                  <code>{hex(t.value)}</code>
                  <span className="text-fg-subtle">{t.description}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </Page>
    );
  },
};

export const SemanticColors: Story = {
  name: 'Color / Semantic',
  render: () => (
    <Page lead="コンポーネントが参照するのはこの層だけ。ライト / ダークで値が切り替わる。Tailwind のクラス名は bg-*（面）・text-fg-*（文字）・border-border-*（線）。">
      <table className="w-full border-collapse text-dense-sm">
        <thead>
          <tr>
            {['見本', 'トークン', 'Tailwind', 'Light', 'Dark', '用途'].map((h) => (
              <th key={h} scope="col" className="border-b border-border-subtle p-inset-sm text-start">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pick('color.')
            .filter((t) => t.layer === 'semantic')
            .map((t) => (
              <tr key={t.name}>
                <td className="border-b border-border-subtle p-inset-sm">
                  <span
                    className="inline-block size-8 rounded-md border border-border"
                    style={{ background: `var(${t.cssVar})` }}
                  />
                </td>
                <td className="border-b border-border-subtle p-inset-sm">
                  <code>{t.name}</code>
                </td>
                <td className="border-b border-border-subtle p-inset-sm">
                  <code>{t.tailwind}</code>
                </td>
                <td className="border-b border-border-subtle p-inset-sm">
                  <code>{t.ref?.replace('color.primitive.', '') ?? hex(t.value)}</code>
                </td>
                <td className="border-b border-border-subtle p-inset-sm">
                  <code>{dark.get(t.name)?.ref?.replace('color.primitive.', '') ?? hex(dark.get(t.name)?.value)}</code>
                </td>
                <td className="border-b border-border-subtle p-inset-sm">{t.description}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Page>
  ),
};

export const Typography: Story = {
  render: () => {
    const styles = [...new Set(pick('text.').map((t) => t.name.split('.')[1] as string))];
    return (
      <Page lead="最小 14px。本文は 16px・行間 1.7。字間は大きい文字ほど詰める。Tailwind では text-{スタイル名}。">
        {styles.map((s) => (
          <div key={s} className="flex flex-col gap-gap-xs border-b border-border-subtle pb-stack-sm">
            <code className="text-mono-sm text-fg-subtle">
              text-{s} — {dim(light.find((t) => t.name === `text.${s}.font-size`)?.value)} /{' '}
              {String(light.find((t) => t.name === `text.${s}.line-height`)?.value)}
            </code>
            {/* クラス名を動的に組み立てると Tailwind が検出できないため、トークンの CSS 変数で直接指定する */}
            <p
              className="m-0"
              style={{
                fontFamily: `var(--tkc-text-${s}-font-family)`,
                fontSize: `var(--tkc-text-${s}-font-size)`,
                fontWeight: `var(--tkc-text-${s}-font-weight)`,
                lineHeight: `var(--tkc-text-${s}-line-height)`,
                letterSpacing: `var(--tkc-text-${s}-letter-spacing)`,
              }}
            >
              すべての人に、やさしいデジタルを。Design System 0123
            </p>
          </div>
        ))}
      </Page>
    );
  },
};

export const SpaceRadiusSize: Story = {
  name: 'Space / Radius / Size',
  render: () => (
    <Page lead="レイアウトの余白は stack-sm / md / lg の 3 段階。部品内の余白は inset-* と gap-*。">
      {(['space.', 'size.', 'radius.'] as const).map((p) => (
        <table key={p} className="w-full border-collapse text-dense-sm">
          <tbody>
            {pick(p).map((t) => (
              <tr key={t.name}>
                <td className="w-60 border-b border-border-subtle p-inset-sm">
                  <code>{t.tailwind ?? t.name}</code>
                </td>
                <td className="w-20 border-b border-border-subtle p-inset-sm">
                  <code>{dim(t.value)}</code>
                </td>
                <td className="border-b border-border-subtle p-inset-sm">
                  {p === 'radius.' ? (
                    <span
                      className="block h-12 w-24 border-2 border-border-key bg-key-subtle"
                      style={{ borderRadius: `var(${t.cssVar})` }}
                    />
                  ) : (
                    <span className="block h-3 rounded-xs bg-key" style={{ width: `min(var(${t.cssVar}), 100%)` }} />
                  )}
                </td>
                <td className="border-b border-border-subtle p-inset-sm">{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </Page>
  ),
};

export const Elevation: Story = {
  render: () => (
    <Page lead="影は浮いている物（メニュー・モーダル）にだけ使う。ボタンや入力欄には使わない。">
      <div className="flex flex-wrap gap-gutter">
        {pick('shadow.').map((t) => (
          <div
            key={t.name}
            className="flex w-60 flex-col gap-gap-sm rounded-xl bg-surface p-inset-xl"
            style={{ boxShadow: `var(${t.cssVar})` }}
          >
            <code>{t.tailwind}</code>
            <span>{t.description}</span>
          </div>
        ))}
      </div>
    </Page>
  ),
};
