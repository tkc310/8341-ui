import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t}from"./iframe-DVSJUVTY.js";import{n,r}from"./tv-DhvZ5eiV.js";import{r as i,t as a}from"./Icon-D0AqaYhD.js";import{n as o,t as s}from"./Stack-BQzXcP6j.js";function c({tone:e,icon:t,className:n,children:r,...i}){return(0,l.jsxs)(`span`,{className:u({tone:e,className:n}),...i,children:[t,r]})}var l,u;function d(){return(d=e((()=>{n(),l=t(),u=r({base:`inline-flex items-center gap-gap-xs whitespace-nowrap rounded-xs border px-inset-sm py-inset-xs text-label-sm [&_svg]:size-icon-sm`,variants:{tone:{neutral:`border-border bg-subtle text-fg`,key:`border-border-key bg-info-subtle text-fg-key`,success:`border-border-success bg-success-subtle text-fg-success`,warning:`border-border-warning bg-warning-subtle text-fg-warning`,danger:`border-border-danger bg-danger-subtle text-fg-danger`}},defaultVariants:{tone:`neutral`}}),c.__docgenInfo={description:`状態やカテゴリを示すラベル。操作はできない（操作できるなら Button を使う）`,methods:[],displayName:`Tag`,props:{icon:{required:!1,tsType:{name:`ReactNode`},description:`先頭アイコン。状態を表すタグには、色だけで意味を伝えないよう付けることを推奨`}},composes:[`HTMLAttributes`,`VariantProps`]}})))()}var f,p,m,h;function g(){return(g=e((()=>{i(),o(),d(),f=t(),p={title:`Components/Tag`,component:c,args:{children:`下書き`}},m={render:()=>(0,f.jsxs)(s,{direction:`horizontal`,wrap:!0,children:[(0,f.jsx)(c,{children:`下書き`}),(0,f.jsx)(c,{tone:`key`,children:`新着`}),(0,f.jsx)(c,{tone:`success`,icon:(0,f.jsx)(a,{name:`check`}),children:`承認済み`}),(0,f.jsx)(c,{tone:`warning`,icon:(0,f.jsx)(a,{name:`warning`}),children:`要確認`}),(0,f.jsx)(c,{tone:`danger`,icon:(0,f.jsx)(a,{name:`close`}),children:`差し戻し`})]})},h=[`Tones`],m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Stack direction="horizontal" wrap>
      <Tag>下書き</Tag>
      <Tag tone="key">新着</Tag>
      <Tag tone="success" icon={<Icon name="check" />}>
        承認済み
      </Tag>
      <Tag tone="warning" icon={<Icon name="warning" />}>
        要確認
      </Tag>
      <Tag tone="danger" icon={<Icon name="close" />}>
        差し戻し
      </Tag>
    </Stack>
}`,...m.parameters?.docs?.source}}}})))()}g();export{m as Tones,h as __namedExportsOrder,p as default};