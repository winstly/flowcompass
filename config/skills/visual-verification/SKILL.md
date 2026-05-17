---
name: visual-verification
description: >
  当需要视觉验证交付物时使用。涉及浏览器截图、页面源码分析、
  视觉回归对比等场景。即使用户没有说"视觉验证"，只要项目有 Web 产出物、
  需要验证页面效果、需要截图对比设计稿、需要分析页面源码，就应触发。
argument-hint: "[--mode SNAPSHOT|COMPARE|FULL] [--urls <url-list>] <deliverables reference>"
level: 3
pipeline: [internal-self-check, visual-verification, dual-qa-review]
handoff-policy: auto
handoff: wiki/summaries/quality/visual-report.md
---

# 视觉验证

<Purpose>
用浏览器实际访问页面，截图留证，分析源码质量。视觉验证填补了代码审查和功能测试之间的空白——代码没错不代表页面没问题。布局偏移、样式错误、SEO 缺陷、可访问性遗漏，这些只有"看到"才能发现。
</Purpose>

<Use_When>
- Web 项目开发中或完成后需要看实际效果
- 需要截图对比设计稿或上次版本
- 需要分析页面源码（SEO、可访问性、性能）
- "帮我看看页面效果"
- "截图对比一下"
- "检查一下页面的 SEO"
</Use_When>

<Do_Not_Use_When>
- 非 Web 项目（无页面可访问）
- 只需要代码逻辑检查（用 internal-self-check）
- 交付物尚未部署或无法访问（先解决部署问题）
</Do_Not_Use_When>

<Why_This_Exists>
代码审查发现不了布局偏移，功能测试发现不了 SEO 缺陷。视觉验证是唯一能确认"用户看到的"与"预期一致的"手段。不做视觉验证 = 假设页面没问题，而假设是 bug 的温床。
</Why_This_Exists>

<Execution_Policy>
- 实际访问：必须用真实浏览器访问，不能只读源码猜测效果
- 多视口覆盖：至少 desktop + mobile，tablet 可选
- 截图为证：每个结论必须有截图支撑，不能凭记忆描述
- 源码分析：截图只看表面，源码分析才能发现结构性问题
- 基线管理：COMPARE/FULL 模式下必须有基线截图作为对比基准
</Execution_Policy>

<Mode_Selection>

| Mode | When | What to Check |
|------|------|---------------|
| SNAPSHOT | 开发中，快速看效果 | 访问 URL → 截图 → 保存 |
| COMPARE | QA 阶段，对比基线或设计稿 | 截图 + 对比基线 → 输出差异 |
| FULL | 正式验收前 | 截图 + 源码分析 + 回归对比 |

Intent parsing:
```
SNAPSHOT: "看看效果", "截个图", "快速验证"
COMPARE:  "对比一下", "和上次比", "回归测试"
FULL:     "全面验证", "正式验收前检查", "视觉+源码"
```
</Mode_Selection>

<Steps>
1. **确定验证范围**
   - 读取交付物中的 URL 列表或页面路由
   - 确定需要验证的页面和视口尺寸
   - 如无明确 URL，从项目配置或开发服务器推断

2. **浏览器截图**
   - 启动浏览器（Playwright/Puppeteer 或 Claude Code 内置浏览器工具）
   - 逐页面访问，按视口尺寸截图
   - 视口配置：
     - Desktop: 1440×900
     - Tablet: 768×1024（可选）
     - Mobile: 375×812
   - 截图保存到 `.knowledge/wiki/summaries/quality/screenshots/`
   - 命名规则：`{page}-{viewport}.png`

3. **源码分析**
   - 抓取每个页面的 HTML 源码
   - 检查维度：
     - **SEO**：title/meta description/og 标签/h1 唯一性/结构化数据
     - **可访问性**：img alt/aria 标签/颜色对比度/语义化标签/焦点顺序
     - **性能**：资源大小/懒加载/预加载提示/渲染阻塞资源
   - 每个维度按 Critical/Major/Minor 分级

4. **回归对比**（COMPARE/FULL 模式）
   - 读取基线截图：`.knowledge/wiki/summaries/quality/screenshots/baseline/`
   - 逐页面对比当前截图与基线
   - 标注差异区域（像素差异/布局偏移/内容变化）
   - 如无基线，将当前截图保存为基线

5. **输出视觉报告**
   - 写入 `wiki/summaries/quality/visual-report.md`
   - 包含：截图引用、源码分析结果、回归对比结果、问题清单
   - 更新 `wiki/index.md`
   - 追加 `logs/evolution-log.md`
</Steps>

<Tool_Usage>
- 浏览器工具：Playwright（首选）或 Claude Code 内置 WebFetch
- 截图：`page.screenshot({ fullPage: true })`
- 源码获取：`page.content()` 或 `page.evaluate()`
- 写入使用 Write 工具
- 产出路径：
  - `wiki/summaries/quality/visual-report.md`
  - `wiki/summaries/quality/screenshots/{page}-{viewport}.png`
  - `wiki/summaries/quality/screenshots/baseline/{page}-{viewport}.png`
</Tool_Usage>

<Examples>
<Good>
视觉验证输出：
```
页面: /homepage
Desktop 截图: screenshots/homepage-desktop.png ✓
Mobile 截图: screenshots/homepage-mobile.png ✓
源码分析:
  SEO: title 缺失 (Critical), og:image 缺失 (Major)
  可访问性: logo 缺少 alt (Major), 跳过导航链接缺失 (Minor)
  性能: 未压缩图片 2.3MB (Major)
回归对比: 与基线对比，导航栏位置偏移 12px (Minor)
```
Why good: 三个维度完整覆盖，问题有分级有证据，截图和源码分析互补。
</Good>

<Bad>
只截图不看源码：
```
页面: /homepage
截图: screenshots/homepage-desktop.png ✓
看起来没问题。
```
Why bad: 截图只看表面。SEO 缺陷、可访问性问题、性能瓶颈在截图上看不到。
</Bad>

<Bad>
SNAPSHOT 模式每次都新建基线：
"上次截图丢了，重新建基线吧。"
Why bad: 基线丢失意味着无法回归对比。应将基线纳入 Wiki 版本管理，不应轻易丢弃。
</Bad>
</Examples>

<Escalation_And_Stop_Conditions>
- 目标页面无法访问 → 检查部署状态，记录为 P0 阻塞项
- 浏览器工具不可用 → 降级为仅源码分析（WebFetch），记录降级原因
- 截图与基线差异过大（>30% 像素变化）→ 标记为重大变更，建议人工确认是否为预期变更
</Escalation_And_Stop_Conditions>

<Final_Checklist>
- [ ] 所有目标页面是否都已截图？
- [ ] 是否覆盖了 desktop + mobile 视口？
- [ ] 源码分析是否覆盖 SEO/可访问性/性能三个维度？
- [ ] 每个问题是否有分级（Critical/Major/Minor）？
- [ ] COMPARE/FULL 模式是否与基线对比？
- [ ] 截图文件是否保存到 wiki/summaries/quality/screenshots/？
- [ ] wiki/summaries/quality/visual-report.md 是否已写入？
- [ ] wiki/index.md 是否已更新？
- [ ] logs/evolution-log.md 是否已追加？
</Final_Checklist>

<Advanced>
## 产出目录结构

```
wiki/summaries/quality/
├── visual-report.md
└── screenshots/
    ├── homepage-desktop.png
    ├── homepage-mobile.png
    ├── dashboard-desktop.png
    ├── dashboard-mobile.png
    └── baseline/
        ├── homepage-desktop.png
        └── dashboard-desktop.png
```

## 视觉报告模板

```markdown
# 视觉验证报告

## 概要
- 验证模式: {SNAPSHOT|COMPARE|FULL}
- 页面数量: {N}
- 视口覆盖: desktop, mobile
- 问题总数: Critical {n}, Major {n}, Minor {n}

## 页面验证

### /{page-name}
| 视口 | 截图 | 状态 |
|------|------|------|
| Desktop | ![desktop](screenshots/{page}-desktop.png) | ✓/✗ |
| Mobile  | ![mobile](screenshots/{page}-mobile.png) | ✓/✗ |

**源码分析：**
- SEO: {发现的问题}
- 可访问性: {发现的问题}
- 性能: {发现的问题}

**回归对比：**（COMPARE/FULL 模式）
- 与基线差异: {描述}
```

## 配置

```json
{
  "pm": {
    "visualVerification": {
      "defaultMode": "SNAPSHOT",
      "viewports": {
        "desktop": { "width": 1440, "height": 900 },
        "tablet": { "width": 768, "height": 1024 },
        "mobile": { "width": 375, "height": 812 }
      },
      "screenshotPath": ".knowledge/wiki/summaries/quality/screenshots/",
      "baselinePath": ".knowledge/wiki/summaries/quality/screenshots/baseline/"
    }
  }
}
```

## 截图命名规则

`{page-route}-{viewport}.png`

- 页面路由中的 `/` 替换为 `-`，去掉前导 `/`
- 示例：`/dashboard/settings` → `dashboard-settings-desktop.png`
</Advanced>

Task: {{ARGUMENTS}}
