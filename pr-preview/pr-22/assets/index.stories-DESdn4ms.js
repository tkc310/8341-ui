import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t}from"./iframe-V6L0IpLp.js";import{n,t as r}from"./Stack-SwTLwGwj.js";import{n as i,t as a}from"./Spinner-BHNZ-bym.js";var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),i(),o=t(),{expect:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Components/Spinner`,component:a,args:{label:`読み込んでいます`},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}},parameters:{docs:{description:{component:`読み込みや保存の最中であることを示す。role="status" の中に文言（label）を持つので、表示しない場合も読み上げには伝わる。ボタンの処理中は Button の loading を使う。`}}}},u={play:async({canvasElement:e})=>{let t=c(e);await s(t.getByRole(`status`)).toHaveTextContent(`読み込んでいます`)}},d={args:{label:`保存しています`,showLabel:!0,size:`sm`}},f={render:e=>(0,o.jsxs)(r,{direction:`horizontal`,wrap:!0,children:[(0,o.jsx)(a,{...e,size:`sm`,showLabel:!0,label:`小（16px）`}),(0,o.jsx)(a,{...e,size:`md`,showLabel:!0,label:`標準（20px）`}),(0,o.jsx)(a,{...e,size:`lg`,showLabel:!0,label:`大（24px）`})]})},p={args:{delay:!0,showLabel:!0}},m=[`IconOnly`,`WithLabel`,`Sizes`,`Delayed`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('読み込んでいます');
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: '保存しています',
    showLabel: true,
    size: 'sm'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <Stack direction="horizontal" wrap>
      <Spinner {...args} size="sm" showLabel label="小（16px）" />
      <Spinner {...args} size="md" showLabel label="標準（20px）" />
      <Spinner {...args} size="lg" showLabel label="大（24px）" />
    </Stack>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    delay: true,
    showLabel: true
  }
}`,...p.parameters?.docs?.source},description:{story:`待ち時間が短いときにちらつかないよう、300ms 遅れて表示する`,...p.parameters?.docs?.description}}}})))()}h();export{p as Delayed,u as IconOnly,f as Sizes,d as WithLabel,m as __namedExportsOrder,l as default};