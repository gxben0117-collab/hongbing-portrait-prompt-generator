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
- `prompt_governance.js`：黑單字眼、焦段策略、姿勢模式與分類規則設定
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
- `versions/index_v0.46.html`：批次擴充風格範例並加入分類/主題數量顯示後快照
- `versions/index_v0.47.html`：第四輪 curated 擴充、icon fallback 與八行分類列後快照
- `versions/index_v0.48.html`：第五輪 curated 擴充 1000 組、全分類 icon 寫入與九行分類列後快照
- `versions/index_v1.0.0.html`：v1.0.0 正式上架快照
- `versions/index_v1.0.1.html`：v1.0.1 焦段策略與姿勢治理快照
- `核心資料/核心咒語規範.md`：專案核心規則來源
- `核心資料/風格範例.md`：大型風格範例資料來源
- `docs/`：文件中心

## 使用方式

1. 開啟 `index.html`
2. 選擇風格大類與場景主題
3. 微調妝容、角度、比例、鏡頭、燈光與氛圍
4. 產生咒語後，與本人照片放在 ChatGPT 同一則訊息送出

## 工程來源規則

- 正式工程來源：`index.html`、`core.js`、`prompt_governance.js`、`scripts/`、`docs/`、`核心資料/`
- `dist/` 是建置產物，不是主要修改來源
- 外部分發資料夾（如 `output/`）是同步副本，不是主要修改來源
- `核心資料/核心咒語規範.md` 未獲明確同意不得修改

## 目前資料治理

- 風格範例資料本體的 `prop` / `comp` 已完成系統性補齊
- 可使用 `node scripts/fill_style_pose_fields.mjs` 重新為缺漏條目補安全姿勢與構圖欄位
- 可使用 `python scripts/report_data_gaps.py` 驗證目前是否仍有缺漏欄位
- 可使用 `node scripts/report_risk_flags.mjs` 產出每張卡的 risk_flags 報告
- prompt engine 已導入 identity-first 核心排序，重點放在鎖臉、姿勢協調、頭身比例與反模式清洗
- v1.0.1 將黑單、焦段策略、姿勢模式與分類規則集中到 `prompt_governance.js`
- v1.0.1 新增 70mm / 80mm 焦段，並依風格自動帶入：古裝全身 50mm、平衡寫真 70mm、角色近景 80mm、婚紗半身 85mm
- v1.0.1 將「三分側面」改為「鎖臉微側」，限制為 10-15 度自然微轉，避免鎖臉時五官角度變怪
- 目前正式版號：`v1.0.0`
- `TASK-001` 後新增 `臉部特徵（選填）` 欄位，會把臉部文字錨點插入 prompt 第 2 段
- `Avoid:` 負面保護已前移到 prompt 第 3 段，避免尾段權重衰減
- `TPLS.char` 已改成純世界觀描述，不再用 heroine / beauty 等 archetype 詞覆蓋身份
- `TASK-002` 進一步清理 `Category pose guidance` 的殘留 archetype 字眼，連行為誘導層也改成完全中性
- `TASK-002` 已將高風險焦段 / 鏡頭語言 / 暗光與仙氣氛圍從主路徑移除，預設主幹收斂到 50mm / 85mm、雜誌封面、自然光與清透或輕霧氛圍
- 2026-05-22 新增兩輪大批風格範例擴充，採「先讀核心規範、再建檔、輸出時再清洗」原則，重複度過高條目會跳過不加
- 目前總風格條目數已提升至 `1750`，其中第二輪擴充聚焦台灣景點、高山大海、歐洲旅拍、日本旅拍、韓國與東南亞、世界地標、中國地標、漢服、朝代宮服與大唐盛世
- 2026-05-22 已加入第三輪全自動批次擴充腳本，會先比對 `風格範例.md` 與現有 `CATS` 後再補低庫存分類，避免重複灌水
- 第三輪完成後，總風格條目數已提升至 `1844`
- 2026-05-22 已加入第四輪 curated 擴充腳本 `scripts/expand_style_examples_round4_curated_20260522.mjs`，改成低庫存分類逐組補入、逐組比對名稱/詞幹/風格來源後再寫入
- 第四輪完成後，`song_grace`、`ming_grace`、`qing_grace`、`reference_styles`、`hotdrama`、`china_drama`、`spirits`、`goddess_myth`、`holy_angel`、`modern_lady`、`queen`、`wedding_diamond` 各再補 6 組，總風格條目數提升至 `1916`
- 2026-05-22 已加入第五輪 curated 擴充腳本 `scripts/expand_style_examples_round5_curated_20260522.mjs`，依全分類配額、逐組比對名稱/詞幹/素材母庫、禁詞檢查後再寫入，避免直接批次灌水
- 第五輪完成後，43 個分類合計再補 `1000` 組，總風格條目數提升至 `2916`
- 介面已把風格大類列擴充為 9 行，並對分類 icon / 卡片 icon / 選擇 badge 加入顯示 fallback，避免旗幟 emoji 在部分環境退化成 `TW` 等字母碼；第五輪新增條目也全部帶入 icon
- 介面目前會顯示總分類數，以及每個分類當下的場景主題數量，方便檢查庫存擴充結果

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
- `docs/development-log/V1.28.md`
- `docs/development-log/V1.33.md`
