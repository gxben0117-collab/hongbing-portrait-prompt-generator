# 紅兵風格寫真咒語產生器

這是一個以單頁網頁形式運作的風格寫真咒語產生器，主打把使用者上傳的人像照片，結合風格範例、鏡頭語言、妝容、燈光與氛圍設定，生成可直接貼給 ChatGPT 使用的完整英文咒語。

## 目前定位

- 古裝神話寫真
- 景點旅拍外景
- 婚紗華麗大片
- COS / 奇幻 / 暗黑角色
- 寫真感美圖風格組合

## 目前檔案結構

- `index.html`：目前主版本網頁
- `versions/`：舊版 HTML 保留資料夾
- `versions/index_v0.10.html`：舊版保留
- `versions/index_v0.11.html`：舊版保留
- `versions/index_v0.12.html`：舊版保留
- `versions/index_v0.13.html`：舊版保留
- `versions/index_v0.14.html`：舊版保留
- `versions/index_v0.15.html`：舊版保留
- `versions/index_v0.16.html`：舊版保留
- `versions/index_v0.17.html`：舊版保留
- `versions/index_v0.18.html`：舊版保留
- `versions/index_v0.19.html`：舊版保留
- `versions/index_v0.20.html`：舊版保留
- `versions/index_v0.21.html`：舊版保留
- `versions/index_v0.22.html`：舊版保留
- `versions/index_v0.23.html`：舊版保留
- `versions/index_v0.24.html`：舊版保留
- `versions/index_v0.25.html`：舊版保留
- `versions/index_v0.26.html`：舊版保留
- `versions/index_v0.27.html`：舊版保留
- `versions/index_v0.28.html`：舊版保留
- `versions/index_v0.30.html`：舊版保留
- `versions/index_v0.35.html`：舊版保留
- `versions/index_v0.36.html`：舊版保留
- `versions/index_v0.37.html`：舊版保留
- `versions/index_v0.38.html`：舊版保留
- `versions/index_v0.39.html`：舊版保留
- `versions/index_v0.40.html`：舊版保留
- `versions/index_v0.41.html`：本輪 TASK-001 完成後快照
- `versions/index_v0.42.html`：TASK-002 清理 pose guidance 後快照
- `versions/index_v0.43.html`：快速隨機區塊左右位置交換後快照
- `versions/index_v0.44.html`：TASK-002 硬精簡選項與安全主路徑重建後快照
- `核心資料/核心咒語規範.md`：專案核心規則來源
- `核心資料/風格範例.md`：大型風格範例資料來源
- `docs/`：文件中心

## 使用方式

1. 開啟 `index.html`
2. 選擇風格大類與場景主題
3. 微調妝容、角度、比例、鏡頭、燈光與氛圍
4. 產生咒語後，與本人照片放在 ChatGPT 同一則訊息送出

## 工程來源規則

- 正式工程來源：`index.html`、`core.js`、`scripts/`、`docs/`、`核心資料/`
- `dist/` 是建置產物，不是主要修改來源
- 外部分發資料夾（如 `output/`）是同步副本，不是主要修改來源
- `核心資料/核心咒語規範.md` 未獲明確同意不得修改

## 目前資料治理

- 風格範例資料本體的 `prop` / `comp` 已完成系統性補齊
- 可使用 `node scripts/fill_style_pose_fields.mjs` 重新為缺漏條目補安全姿勢與構圖欄位
- 可使用 `python scripts/report_data_gaps.py` 驗證目前是否仍有缺漏欄位
- prompt engine 已導入 identity-first 核心排序，重點放在鎖臉、姿勢協調、頭身比例與反模式清洗
- `TASK-001` 後新增 `臉部特徵（選填）` 欄位，會把臉部文字錨點插入 prompt 第 2 段
- `Avoid:` 負面保護已前移到 prompt 第 3 段，避免尾段權重衰減
- `TPLS.char` 已改成純世界觀描述，不再用 heroine / beauty 等 archetype 詞覆蓋身份
- `TASK-002` 進一步清理 `Category pose guidance` 的殘留 archetype 字眼，連行為誘導層也改成完全中性
- `TASK-002` 已將高風險焦段 / 鏡頭語言 / 暗光與仙氣氛圍從主路徑移除，預設主幹收斂到 50mm / 85mm、雜誌封面、自然光與清透或輕霧氛圍

## 文件入口

- `docs/README.md`
- `docs/project/專案總覽.md`
- `docs/project/正式工程路線圖.md`
- `docs/版本規則.md`
- `docs/development-log/V1.00.md`
- `docs/development-log/V1.07.md`
- `docs/development-log/V1.08.md`
- `docs/development-log/V1.09.md`
- `docs/development-log/V1.10.md`
- `docs/development-log/V1.11.md`
- `docs/development-log/V1.12.md`
- `docs/development-log/V1.13.md`
- `docs/development-log/V1.14.md`
