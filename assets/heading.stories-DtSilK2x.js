import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t}from"./iframe-fp-5nti8.js";import{n,r}from"./tv-DhvZ5eiV.js";import{n as i,t as a}from"./stack-DEOPUzTE.js";function o({level:e,size:t,decoration:n,shoulder:r,className:i,children:a,...o}){let u=`h${e}`,d=c({size:t??l[e],decoration:n});return(0,s.jsxs)(u,{className:d.root({className:i}),...o,children:[r&&(0,s.jsx)(`span`,{className:d.shoulder(),children:r}),(0,s.jsx)(`span`,{className:d.text(),children:a})]})}var s,c,l;function u(){return(u=e((()=>{n(),s=t(),c=r({slots:{root:`m-0 text-fg [font-feature-settings:"palt"] text-balance`,shoulder:`mb-gap-xs block text-body-md font-bold text-fg-subtle [font-feature-settings:normal]`,text:`block`},variants:{size:{"display-lg":{root:`text-display-lg`},"display-md":{root:`text-display-md`},xl:{root:`text-heading-xl`},lg:{root:`text-heading-lg`},md:{root:`text-heading-md`},sm:{root:`text-heading-sm`},xs:{root:`text-heading-xs`},xxs:{root:`text-heading-xxs`}},decoration:{none:{},bar:{root:`border-s-4 border-border-key ps-inset-md forced-colors:border-[CanvasText]`},rule:{root:`border-b-2 border-border-key pb-inset-sm forced-colors:border-[CanvasText]`}}},defaultVariants:{decoration:`none`}}),l={1:`xl`,2:`lg`,3:`md`,4:`sm`,5:`xs`,6:`xxs`},o.__docgenInfo={description:`見出し。文書構造（level）と見た目（size）を分けて指定でき、レベルは飛ばさない。`,methods:[],displayName:`Heading`,props:{level:{required:!0,tsType:{name:`union`,raw:`1 | 2 | 3 | 4 | 5 | 6`,elements:[{name:`literal`,value:`1`},{name:`literal`,value:`2`},{name:`literal`,value:`3`},{name:`literal`,value:`4`},{name:`literal`,value:`5`},{name:`literal`,value:`6`}]},description:`文書構造上のレベル。見出しレベルを飛ばさないこと`},shoulder:{required:!1,tsType:{name:`ReactNode`},description:`見出しの前置き（セクション番号など）。見出しの一部として読み上げられる`}},composes:[`HTMLAttributes`,`VariantProps`]}})))()}var d,f,p,m,h,g;function _(){return(_=e((()=>{i(),u(),d=t(),f={title:`Components/Heading`,component:o,args:{level:2,children:`申請の手順`},parameters:{docs:{description:{component:`文書構造（level）と見た目（size）を分けて指定できる。h1 はページに 1 つ、レベルは飛ばさない。大きい見出しほど字間を詰め、約物は palt で詰める。`}}}},p={},m={render:()=>(0,d.jsxs)(a,{gap:`sm`,children:[(0,d.jsx)(o,{level:1,size:`display-lg`,children:`Display L 56px`}),(0,d.jsx)(o,{level:2,size:`display-md`,children:`Display M 44px`}),(0,d.jsx)(o,{level:2,size:`xl`,children:`Heading XL 36px「見出し」`}),(0,d.jsx)(o,{level:2,size:`lg`,children:`Heading L 32px`}),(0,d.jsx)(o,{level:3,size:`md`,children:`Heading M 28px`}),(0,d.jsx)(o,{level:4,size:`sm`,children:`Heading S 24px`}),(0,d.jsx)(o,{level:5,size:`xs`,children:`Heading XS 20px`}),(0,d.jsx)(o,{level:6,size:`xxs`,children:`Heading XXS 18px`})]})},h={render:()=>(0,d.jsxs)(a,{children:[(0,d.jsx)(o,{level:2,decoration:`bar`,children:`左に縦線（bar）`}),(0,d.jsx)(o,{level:2,decoration:`rule`,children:`下線で区切る（rule）`}),(0,d.jsx)(o,{level:2,shoulder:`ステップ 2`,children:`必要書類をアップロードする`})]})},g=[`Default`,`Scale`,`Decorations`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Stack gap="sm">
      <Heading level={1} size="display-lg">
        Display L 56px
      </Heading>
      <Heading level={2} size="display-md">
        Display M 44px
      </Heading>
      <Heading level={2} size="xl">
        Heading XL 36px「見出し」
      </Heading>
      <Heading level={2} size="lg">
        Heading L 32px
      </Heading>
      <Heading level={3} size="md">
        Heading M 28px
      </Heading>
      <Heading level={4} size="sm">
        Heading S 24px
      </Heading>
      <Heading level={5} size="xs">
        Heading XS 20px
      </Heading>
      <Heading level={6} size="xxs">
        Heading XXS 18px
      </Heading>
    </Stack>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Stack>
      <Heading level={2} decoration="bar">
        左に縦線（bar）
      </Heading>
      <Heading level={2} decoration="rule">
        下線で区切る（rule）
      </Heading>
      <Heading level={2} shoulder="ステップ 2">
        必要書類をアップロードする
      </Heading>
    </Stack>
}`,...h.parameters?.docs?.source}}}})))()}_();export{h as Decorations,p as Default,m as Scale,g as __namedExportsOrder,f as default};