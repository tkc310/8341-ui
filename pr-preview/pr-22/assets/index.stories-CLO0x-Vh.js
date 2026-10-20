import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t}from"./iframe-V6L0IpLp.js";import{n,r}from"./tv-DhvZ5eiV.js";import{n as i,t as a}from"./Stack-SwTLwGwj.js";import{n as o,t as s}from"./Spinner-BHNZ-bym.js";function c({width:e=`100%`,height:t=`1em`,radius:n,className:r,style:i,...a}){return(0,l.jsx)(`span`,{"aria-hidden":`true`,className:u({radius:n,className:r}),style:{width:e,height:t,...i},...a})}var l,u;function d(){return(d=e((()=>{n(),l=t(),u=r({base:[`block max-w-full animate-pulse bg-muted motion-reduce:animate-none`,`forced-colors:border forced-colors:border-[GrayText]`],variants:{radius:{none:`rounded-none`,xs:`rounded-xs`,md:`rounded-md`,xl:`rounded-xl`,full:`rounded-full`}},defaultVariants:{radius:`xs`}}),c.__docgenInfo={description:`読み込み中に、中身の形だけを先に見せる箱。読み上げには出さない（aria-hidden）ので、
読み込み中であることは Spinner や、待っている領域の aria-busy で別に伝える。`,methods:[],displayName:`Skeleton`,props:{width:{required:!1,tsType:{name:`CSSProperties['width']`,raw:`CSSProperties['width']`},description:`幅。既定は親の幅いっぱい`,defaultValue:{value:`'100%'`,computed:!1}},height:{required:!1,tsType:{name:`CSSProperties['height']`,raw:`CSSProperties['height']`},description:`高さ。既定は 1 文字分（1em）`,defaultValue:{value:`'1em'`,computed:!1}}},composes:[`Omit`,`VariantProps`]}})))()}var f,p,m,h,g,_;function v(){return(v=e((()=>{o(),i(),d(),f=t(),{expect:p}=__STORYBOOK_MODULE_TEST__,m={title:`Components/Skeleton`,component:c,args:{width:`40%`,height:`1.5em`},argTypes:{radius:{control:`inline-radio`,options:[`none`,`xs`,`md`,`xl`,`full`]}},parameters:{docs:{description:{component:`読み込み中に、中身の形だけを先に見せる。読み上げには出さないので、読み込み中であることは Spinner（文言は隠してよい）や aria-busy で別に伝える。動きを減らす設定では点滅しない。`}}}},h={render:e=>(0,f.jsxs)(a,{gap:`sm`,className:`max-w-prose`,children:[(0,f.jsx)(c,{...e}),(0,f.jsx)(c,{width:`90%`}),(0,f.jsx)(c,{width:`60%`})]}),play:async({canvasElement:e})=>{await p(e.querySelectorAll(`[aria-hidden="true"]`).length).toBe(3)}},g={render:()=>(0,f.jsxs)(`div`,{"aria-busy":`true`,className:`max-w-prose rounded-xl border border-border p-inset-xl`,children:[(0,f.jsx)(s,{label:`お知らせを読み込んでいます`,className:`sr-only`}),(0,f.jsxs)(a,{gap:`sm`,children:[(0,f.jsxs)(a,{direction:`horizontal`,gap:`sm`,children:[(0,f.jsx)(c,{width:`var(--8341-size-control-md)`,height:`var(--8341-size-control-md)`,radius:`full`,className:`shrink-0`}),(0,f.jsx)(c,{width:`30%`,height:`1.25em`})]}),(0,f.jsx)(c,{}),(0,f.jsx)(c,{width:`80%`}),(0,f.jsx)(c,{width:`33%`,height:`var(--8341-size-control-md)`,radius:`md`})]})]})},_=[`Text`,`Card`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Stack gap="sm" className="max-w-prose">
      <Skeleton {...args} />
      <Skeleton width="90%" />
      <Skeleton width="60%" />
    </Stack>,
  play: async ({
    canvasElement
  }) => {
    await expect(canvasElement.querySelectorAll('[aria-hidden="true"]').length).toBe(3);
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div aria-busy="true" className="max-w-prose rounded-xl border border-border p-inset-xl">
      <Spinner label="お知らせを読み込んでいます" className="sr-only" />
      <Stack gap="sm">
        <Stack direction="horizontal" gap="sm">
          <Skeleton width="var(--8341-size-control-md)" height="var(--8341-size-control-md)" radius="full" className="shrink-0" />
          <Skeleton width="30%" height="1.25em" />
        </Stack>
        <Skeleton />
        <Skeleton width="80%" />
        <Skeleton width="33%" height="var(--8341-size-control-md)" radius="md" />
      </Stack>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`カードの読み込み中。待っている領域に aria-busy を立て、状態は Spinner で読み上げに伝える`,...g.parameters?.docs?.description}}}})))()}v();export{g as Card,h as Text,_ as __namedExportsOrder,m as default};