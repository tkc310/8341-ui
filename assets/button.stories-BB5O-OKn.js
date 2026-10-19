import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t}from"./iframe-CPcQd4I8.js";import{r as n,t as r}from"./icon-C-QjMQG1.js";import{n as i,t as a}from"./stack-B05q43OT.js";import{n as o,t as s}from"./button-Bo2gBQis.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x;function S(){return(S=e((()=>{n(),i(),o(),c=t(),{expect:l,fn:u,userEvent:d,within:f}=__STORYBOOK_MODULE_TEST__,p={title:`Components/Button`,component:s,args:{children:`申請する`,onClick:u()},argTypes:{variant:{control:`inline-radio`,options:[`primary`,`secondary`,`tertiary`,`danger`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},parameters:{docs:{description:{component:`操作を実行するボタン（Base UI の Button）。画面遷移だけなら Link を使う。primary は 1 画面に 1 つが目安で、ラベルは「〜する」と動詞で書く。`}}}},m={},h={render:e=>(0,c.jsxs)(a,{direction:`horizontal`,wrap:!0,children:[(0,c.jsx)(s,{...e,variant:`primary`,children:`保存する`}),(0,c.jsx)(s,{...e,variant:`secondary`,children:`下書きに戻す`}),(0,c.jsx)(s,{...e,variant:`tertiary`,children:`キャンセル`}),(0,c.jsx)(s,{...e,variant:`danger`,children:`削除する`})]})},g={render:e=>(0,c.jsxs)(a,{direction:`horizontal`,wrap:!0,children:[(0,c.jsx)(s,{...e,size:`sm`,children:`小（見た目 36px / タップ 44px）`}),(0,c.jsx)(s,{...e,size:`md`,children:`標準 44px`}),(0,c.jsx)(s,{...e,size:`lg`,children:`大 52px`})]})},_={render:e=>(0,c.jsxs)(a,{direction:`horizontal`,wrap:!0,children:[(0,c.jsx)(s,{...e,iconStart:(0,c.jsx)(r,{name:`search`}),children:`検索する`}),(0,c.jsx)(s,{...e,variant:`secondary`,iconEnd:(0,c.jsx)(r,{name:`arrow-right`}),children:`次へ進む`})]})},v={args:{disabled:!0},parameters:{docs:{description:{story:`無効化は理由が伝わらないため最小限に。入力の不足は、ボタンを押せる状態のまま、押したときにエラーで示す（design-principles「誤りと撤回」）。`}}}},y={args:{loading:!0,children:`送信しています`},play:async({canvasElement:e,args:t})=>{let n=f(e).getByRole(`button`);await l(n).toHaveAttribute(`aria-busy`,`true`),await l(n).toHaveAccessibleName(`送信しています`),await l(n).toBeEnabled(),await d.click(n),await l(t.onClick).not.toHaveBeenCalled()}},b={play:async({canvasElement:e,args:t})=>{await d.tab();let n=f(e).getByRole(`button`);await l(n).toHaveFocus(),await d.keyboard(`{Enter}`),await l(t.onClick).toHaveBeenCalled()}},x=[`Primary`,`Variants`,`Sizes`,`WithIcons`,`Disabled`,`Loading`,`Keyboard`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="horizontal" wrap>
      <Button {...args} variant="primary">
        保存する
      </Button>
      <Button {...args} variant="secondary">
        下書きに戻す
      </Button>
      <Button {...args} variant="tertiary">
        キャンセル
      </Button>
      <Button {...args} variant="danger">
        削除する
      </Button>
    </Stack>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="horizontal" wrap>
      <Button {...args} size="sm">
        小（見た目 36px / タップ 44px）
      </Button>
      <Button {...args} size="md">
        標準 44px
      </Button>
      <Button {...args} size="lg">
        大 52px
      </Button>
    </Stack>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="horizontal" wrap>
      <Button {...args} iconStart={<Icon name="search" />}>
        検索する
      </Button>
      <Button {...args} variant="secondary" iconEnd={<Icon name="arrow-right" />}>
        次へ進む
      </Button>
    </Stack>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  },
  parameters: {
    docs: {
      description: {
        story: '無効化は理由が伝わらないため最小限に。入力の不足は、ボタンを押せる状態のまま、押したときにエラーで示す（design-principles「誤りと撤回」）。'
      }
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    children: '送信しています'
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    // 文字を見えなくしても、ボタンの名前は残す
    await expect(button).toHaveAccessibleName('送信しています');
    await expect(button).toBeEnabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    await userEvent.tab();
    const button = within(canvasElement).getByRole('button');
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  }
}`,...b.parameters?.docs?.source}}}})))()}S();export{v as Disabled,b as Keyboard,y as Loading,m as Primary,g as Sizes,h as Variants,_ as WithIcons,x as __namedExportsOrder,p as default};