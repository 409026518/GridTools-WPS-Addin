# GridTools — WPS 表格自定义工具栏加载项

一个给 **WPS 表格（ET）** 用的自定义功能区工具栏，提供两个实用按钮：

| 按钮 | 作用 |
|------|------|
| **表达式转数值** | 选中单元格区域后点击，把 `(3150+1000)*1800` 这类尺寸表达式文本直接替换成计算结果；`/` 和空白单元格自动跳过。 |
| **表达式求和** | 选中区域后点击，弹窗显示区域内所有表达式的总和，**不修改**单元格内容。 |

纯 **JavaScript 宏（JSA）** 实现，**不依赖 VBA 环境**，WPS 个人版 / 专业版均可运行。选项卡名为「**格栅工具箱**」。

---

## 安装（任意一台装了 WPS 的电脑）

1. 下载本仓库（绿色 Code → Download ZIP）并解压。
2. 双击 `install.bat`，看到 `Install OK` 即完成。
3. **完全退出 WPS**（包括右下角托盘图标），重新打开 WPS 表格。
4. 菜单栏会出现「**格栅工具箱**」选项卡。

> 注：WPS 关闭窗口后 `wpsoffice.exe` 进程仍可能驻留，加载项只在进程启动时加载，所以务必彻底退出再重开。

卸载：双击 `uninstall.bat`，重启 WPS 即可。

## 工作原理

采用 WPS 官方 **jsaddons 加载项机制**（publish.xml 模式、离线插件）：

- 加载项文件放在 `%APPDATA%\kingsoft\wps\jsaddons\GridTools_1.0.0\`，包含 `index.html`、`main.js`、`ribbon.xml`、`js\ribbon.js`。
- `%APPDATA%\kingsoft\wps\jsaddons\publish.xml` 中注册一行 `<jsplugin name="GridTools" type="et" .../>`，WPS 启动时据此加载。
- `register.ps1` 负责安全地写入 / 移除这条注册项（兼容已存在的 publish.xml，不破坏其它加载项）。

## 目录结构

```
GridTools-WPS-Addin/
├── install.bat          # 一键安装
├── uninstall.bat        # 一键卸载
├── register.ps1         # 注册/反注册 publish.xml（被 install/uninstall 调用）
├── 安装说明.txt          # 中文说明
├── index.html           # 加载项入口
├── main.js
├── ribbon.xml           # 功能区（选项卡/按钮）布局
├── js/ribbon.js         # 按钮逻辑
├── images/              # 按钮图标
├── package.json         # wpsjs 工程元信息
└── files/               # 预编译产物（开发者可重新生成）
    ├── GridTools.7z
    └── GridTools_1.0.0/
```

## 二次开发

- 改功能：编辑 `js/ribbon.js`（核心逻辑在 `HandleExpr`），保存后重启 WPS 生效。
- 改按钮 / 选项卡：编辑 `ribbon.xml` 与 `register.ps1` 中的标签。
- 重新打包 7z（发布用）：用官方工具 `wpsjs`（`npm i -g wpsjs`）的 `wpsjs build` 离线模式，把 `GridTools_1.0.0` 目录重新打成 7z。

## 许可

[MIT](LICENSE)
