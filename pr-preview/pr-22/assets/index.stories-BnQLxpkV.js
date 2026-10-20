import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t}from"./iframe-V6L0IpLp.js";import{n,t as r}from"./Link-DflyNBgW.js";import{n as i,t as a}from"./Stack-SwTLwGwj.js";import{n as o,t as s}from"./Button-Czoq00kL.js";import{n as c,t as l}from"./NotificationBanner-2Q28ZqJT.js";var u,d,f,p;function m(){return(m=e((()=>{o(),n(),i(),c(),u=t(),d={title:`Components/NotificationBanner`,component:l,args:{title:`システムメンテナンスのお知らせ`},parameters:{docs:{description:{component:`状態を伝えるバナー。色だけで意味を伝えず、アイコンと文言（読み上げ用の種別名を含む）を必ず併用する。`}}}},f={render:()=>(0,u.jsxs)(a,{children:[(0,u.jsx)(l,{tone:`info`,title:`システムメンテナンスのお知らせ`,children:(0,u.jsxs)(`p`,{children:[`10 月 25 日（日）2:00〜6:00 はご利用いただけません。`,(0,u.jsx)(r,{href:`#`,children:`メンテナンスの詳細を見る`})]})}),(0,u.jsx)(l,{tone:`success`,title:`申請を受け付けました`,onClose:()=>{},children:(0,u.jsx)(`p`,{children:`受付番号: 2026-001234`})}),(0,u.jsx)(l,{tone:`warning`,title:`提出期限が近づいています`,actions:(0,u.jsx)(s,{size:`sm`,variant:`secondary`,children:`今すぐ提出する`}),children:(0,u.jsx)(`p`,{children:`あと 3 日で期限です。`})}),(0,u.jsx)(l,{tone:`danger`,title:`2 件の入力内容に誤りがあります`,children:(0,u.jsxs)(`ul`,{className:`m-0 ps-stack-md`,children:[(0,u.jsx)(`li`,{children:(0,u.jsx)(r,{href:`#email`,children:`メールアドレス`})}),(0,u.jsx)(`li`,{children:(0,u.jsx)(r,{href:`#tel`,children:`電話番号`})})]})})]})},p=[`Tones`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Stack>
      <NotificationBanner tone="info" title="システムメンテナンスのお知らせ">
        <p>
          10 月 25 日（日）2:00〜6:00 はご利用いただけません。<Link href="#">メンテナンスの詳細を見る</Link>
        </p>
      </NotificationBanner>
      <NotificationBanner tone="success" title="申請を受け付けました" onClose={() => {}}>
        <p>受付番号: 2026-001234</p>
      </NotificationBanner>
      <NotificationBanner tone="warning" title="提出期限が近づいています" actions={<Button size="sm" variant="secondary">
            今すぐ提出する
          </Button>}>
        <p>あと 3 日で期限です。</p>
      </NotificationBanner>
      <NotificationBanner tone="danger" title="2 件の入力内容に誤りがあります">
        <ul className="m-0 ps-stack-md">
          <li>
            <Link href="#email">メールアドレス</Link>
          </li>
          <li>
            <Link href="#tel">電話番号</Link>
          </li>
        </ul>
      </NotificationBanner>
    </Stack>
}`,...f.parameters?.docs?.source}}}})))()}m();export{f as Tones,p as __namedExportsOrder,d as default};