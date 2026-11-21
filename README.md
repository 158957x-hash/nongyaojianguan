# 农药数字监督管理原型

第 4 包农药数字监督管理分系统演示原型，覆盖监管端、零售端、生产填报端，以及皖政通 / 皖企通移动端入口。

## 在线预览

[https://158957x-hash.github.io/nongyaojianguan/](https://158957x-hash.github.io/nongyaojianguan/)

演示登录可用任意账号、密码和验证码。建议从监管登录页开始：[#/pes/login](https://158957x-hash.github.io/nongyaojianguan/#/pes/login)。

## 本地预览

本地开发仍使用 `/anhuiliangshi/`，请不要改 `vite.config.js` 里的 `base`。GitHub Pages 构建会单独使用 `/nongyaojianguan/`。

```bash
npm ci
npm run dev
```

打开 [http://localhost:5274/anhuiliangshi/](http://localhost:5274/anhuiliangshi/)。

## 说明

- 仓库不含现网观察截图、观察记录和个人信息。
- 如需在线底图，可在仓库 Settings → Secrets 中配置 `VITE_TDT_KEY`；未配置时使用政务灰底底图。
