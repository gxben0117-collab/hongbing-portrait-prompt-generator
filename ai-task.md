# AI 協作任務：風格範例.md 整理優化、分組排序與 UI 同步方案

日期：2026-05-23
專案：`C:\AIProjects\紅兵風格寫真咒語產生器`
討論狀態：待 AI 們共同審閱後再實作

---

## 1. 任務背景

目前 `核心資料/風格範例.md` 已經不是單純 15 大主題說明，而是正式風格卡片母庫。
本次任務不是立即改資料，而是先提出「如何整理、分組、排序、同步 UI」的方案，讓其他 AI 看完後一起討論。

本文件只做方案規劃，不直接修改：
- `核心資料/風格範例.md`
- `index.html`
- `core.js`

---

## 2. 目前觀察到的資料狀態

### 2.1 風格範例.md

目前 `核心資料/風格範例.md` 約有：

- 625 筆 `####` 風格卡片
- 大多數卡片已有核心出圖欄位：鏡頭角度、圖片比例、鏡頭焦段、燈光風格、整體氛圍、鏡頭語言
- 卡片標題來源混合：正式系列、v0.27 補充批次、rev 圖片逆推批次、AI 自設計卡片

目前資料風險：

- 有些卡片標題重複，例如：
  - `都市麗人 · 紅沙發夜拍 · 絨面迷情`
  - `動漫遊戲 · 粉紅流量偶像 · 社群舞台`
  - `漢服古裝 · 夜遊鳳城 · 水岸心意`
- 有些卡片欄位格式不完整或新舊格式混用：
  - `妝容` 缺少約 67 筆
  - `場景背景` 缺少約 24 筆
  - `服裝` 缺少約 51 筆
  - `動作與鏡頭` 缺少約 20 筆
- 有些標題帶有來源批次字樣，例如 `v0.27`，不適合直接作為 UI 主要分類名
- 同一個世界觀可能散在不同前綴，例如：魅魔、莉莉絲、夜之女王、魅魔魔王
- 有些分類屬性模糊，例如暗黑古風、狐仙夜庭、神話仙界，可能可歸到東方仙俠，也可能可歸到西方魔幻或中國神話

### 2.2 UI 目前狀態

目前 `index.html` 內 UI 是 15 大類：

- theme_01 魅魔系列：33 筆
- theme_02 魔王系列：30 筆
- theme_03 墮天使系列：34 筆
- theme_04 長相思系列：38 筆
- theme_05 神話系列：31 筆
- theme_06 聊齋系列：30 筆
- theme_07 名著系列：30 筆
- theme_08 武俠系列：33 筆
- theme_09 陸劇系列：46 筆
- theme_10 古裝系列：36 筆
- theme_11 仙俠系列：30 筆
- theme_12 環球系列：47 筆
- theme_13 魔幻系列：82 筆
- theme_14 動漫系列：40 筆
- theme_15 婚紗系列：28 筆

UI 總數約 568 筆，少於 `風格範例.md` 的 625 筆。

這代表目前有兩種可能：

1. `風格範例.md` 是母庫，UI 是精選庫。
2. `風格範例.md` 與 UI 應該 1:1 同步，但目前尚未同步完整。

這一點需要先討論決定，否則後續整理方向會不同。

---

## 3. 核心整理原則建議

### 3.1 不建議直接把風格範例.md 改成 UI 結構

原因：

- `風格範例.md` 是人類可讀母庫，適合保留完整卡片、來源、分析痕跡
- UI 需要的是可篩選、可排序、可快速呈現的資料結構
- 如果直接用 UI 邏輯改母庫，後續新增圖片分析或 AI 自設計資料會很容易亂掉

建議做法：

- `風格範例.md` 保持為「正式風格母庫」
- 另外建立一層「索引 / 映射 / 審核資料」
- UI 從索引資料產生，而不是人工硬塞分類

好處：

- 母庫可以完整保存內容
- UI 可以乾淨、穩定、好找
- 未來新增資料只要補索引，不必大改全文
- 可以保留草稿、補充、精選、隱藏狀態

---

## 4. 建議資料分層

### 4.1 第一層：15 大主題固定不動

建議沿用目前 UI 的 15 大主題，但名稱可討論是否改回完整正式名稱。

建議正式大類：

1. `theme_01` 魅魔之吻．煉獄誘惑
2. `theme_02` 魔王降臨．深淵王座
3. `theme_03` 墮天使．黑色神諭
4. `theme_04` 長相思旅拍．大荒情緒
5. `theme_05` 上古傳說．中國神話
6. `theme_06` 聊齋誌異．妖魅幻境
7. `theme_07` 傳世經典．四大名著
8. `theme_08` 江湖至尊．金庸武俠
9. `theme_09` 影視熱播．陸劇同款
10. `theme_10` 大國風華．歷代古裝
11. `theme_11` 謫仙情緣．東方仙俠
12. `theme_12` 環球美景旅拍．異國光景
13. `theme_13` 聖堂與暗黑．西方魔幻
14. `theme_14` 次元覺醒．動漫科幻
15. `theme_15` 當代時尚．女王婚紗

原因：

- 這 15 大類已經符合使用者原本主題宇宙
- UI 使用者容易理解
- 可作為長期穩定 ID，不受子系列增減影響

### 4.2 第二層：子系列分組

每張卡片應該除了大主題外，再補一個 `series` 或 `subgroup`。

範例：

- `theme_01` 魅魔之吻
  - 魅魔系列
  - 莉莉絲
  - 夜之女王
  - 魅魔魔王中偏魅魔者

- `theme_02` 魔王降臨
  - 女魔王
  - 魔冕女皇
  - 冥界女王
  - 滅世魔女
  - 魅魔魔王中偏魔王者

- `theme_03` 墮天使
  - 墮天使
  - 熾天使黑化
  - 聖女墮落
  - 審判官 / 復仇女神 / 黑翼系

- `theme_10` 大國風華
  - 漢服古裝
  - 朝代宮服
  - 唐代
  - 宋代
  - 明代
  - 清代
  - 民國 / 旗袍 / 都市古典可另議

- `theme_13` 聖堂與暗黑
  - 暗黑哥德
  - 奇幻魔法
  - 聖堂天使
  - 神話女神
  - 魔龍魔獸
  - 水下花境
  - 暗黑史詩

好處：

- UI 不會只有 15 個超大桶
- 使用者可以先選大類，再選子系列
- 同一主題底下能做精準搜尋與排序

### 4.3 第三層：卡片狀態

每張卡片應該有一個狀態欄位：

- `core`：核心代表圖 / 核心卡片，優先顯示
- `official`：正式可用，正常進 UI
- `supplement`：補充卡片，可顯示但排序靠後
- `review`：待審核，暫不進主 UI 或用標籤提示
- `hidden`：暫不顯示，但保留在母庫
- `duplicate`：疑似重複，需要人工或 AI 合併

原因：

- 現在 625 筆全部平鋪會太多
- 使用者常用的應該是核心代表圖與正式卡片
- 逆推圖片、補充批次、重複卡片應該有管理狀態

---

## 5. 建議新增索引欄位

不一定要直接寫進 `風格範例.md` 每張卡片，也可以先建立 `核心資料/風格索引.json` 或 `核心資料/風格索引.md`。

建議欄位：

```json
{
  "id": "suc_01",
  "title": "魅魔系列 · 地獄降臨",
  "theme_id": "theme_01",
  "theme_name": "魅魔之吻．煉獄誘惑",
  "series": "魅魔系列",
  "source_type": "official",
  "source_batch": "manual/core/v0.27/rev",
  "ui_status": "official",
  "sort_weight": 1010,
  "tags": ["暗黑", "哥德", "王座", "魅魔"],
  "risk_flags": [],
  "notes": "核心代表或補充說明"
}
```

好處：

- 不破壞原始卡片內容
- UI 可以穩定排序
- 後續可用腳本自動檢查缺欄位、重複、分類錯置
- 多個 AI 可以分工補索引，不容易互相覆蓋

---

## 6. 排序方案建議

### 6.1 大類排序

固定使用 `theme_01` 到 `theme_15`。

原因：

- 這是使用者原本主題宇宙順序
- 避免每次新增卡片造成 UI 大類位置變動

### 6.2 大類內排序

建議排序規則：

1. `core` 核心代表卡片
2. `official` 正式卡片
3. 同一 `series` 連續排列
4. 具完整欄位者優先
5. 圖片逆推 `rev_*` 與批次補充排在後段，除非被標記為核心
6. `review` 或 `duplicate` 預設不進主 UI，或進入「待審」區

原因：

- 使用者打開 UI 時先看到最穩、最能代表主題的卡片
- 補充資料不會淹沒核心風格
- 卡片多時仍能保有策展感

### 6.3 子系列排序

建議每個主題內有固定子系列順序。

例如 `theme_13`：

1. 聖堂 / 神殿
2. 暗黑哥德
3. 奇幻魔法
4. 神話女神
5. 魔龍魔獸
6. 水下花境
7. 逆推補充

原因：

- 同類元素集中
- 使用者找圖更快
- UI 的子分類按鈕可以穩定顯示

---

## 7. UI 介面改動方式

### 7.1 最小改動版

保留目前 15 大類 UI，只做三件事：

1. 大類名稱改成正式全名或短名加副標
2. 每個大類內依 `sort_weight` 排序
3. 卡片上增加小標籤：`核心`、`補充`、`待審`、`圖片逆推`

優點：

- 改動小
- 不容易破壞現有功能
- 可以快速上線測試

缺點：

- 大類內卡片仍然可能太多
- 搜尋效率有限

### 7.2 建議改動版

在 15 大類底下新增「子系列篩選列」。

UI 結構：

- 第一列：15 大主題
- 第二列：子系列 chips
- 第三區：卡片列表
- 額外：搜尋框 / 狀態篩選

篩選例：

- 全部
- 核心
- 正式
- 補充
- 待審
- 圖片逆推

優點：

- 625 筆資料也能管理
- 使用者找圖速度明顯提升
- 後續可以擴到 1000+ 筆

缺點：

- 需要調整 `renderCatStrip()` / `renderPresets()` 邏輯
- 需要新增 `curSeriesID` 或類似狀態

### 7.3 工程化改動版

把 `index.html` 內嵌 CATS 改成由腳本生成。

建議流程：

1. `風格範例.md` 保留人類可讀資料
2. `風格索引.json` 保存分類、排序、狀態
3. `scripts/build_style_data.mjs` 讀取 md + json
4. 生成 `dist/style-data.js` 或直接更新 `index.html` 的 CATS
5. UI 只吃生成結果

優點：

- 不必手改巨大 HTML
- 可自動驗證缺欄位、重複 ID、分類錯置
- 多 AI 協作時比較不會衝突

缺點：

- 初期需要建立腳本與規格
- 要決定 `風格範例.md` 是否仍為唯一真源

---

## 8. 風格範例.md 本體整理方式

### 8.1 不建議一次性重排全文

原因：

- 目前有 625 筆，直接重排風險高
- 有些資料可能仍在審核中
- 若 UI 正在使用部分資料，重排可能導致對應失準

### 8.2 建議分階段整理

第一階段：建立盤點報告

- 卡片總數
- 每個 ID 是否唯一
- 標題是否重複
- 缺欄位清單
- 疑似分類錯置清單
- UI 已收錄 / 未收錄清單

第二階段：建立索引

- 不改原文
- 為每張卡片補 `theme_id`、`series`、`status`、`sort_weight`

第三階段：先同步 UI 排序

- 只改 UI 顯示順序與分組
- 不修改卡片內容

第四階段：清理母庫格式

- 統一標題格式
- 補齊缺欄位
- 合併重複卡片
- 把 `v0.27` 這種來源字樣移到 `來源批次` 欄位，不放標題主體

第五階段：建立新增資料流程

任何新資料進入 `風格範例.md` 前，必須：

1. 先用 `核心咒語規範.md` 整理
2. 補齊欄位
3. 指定大類與子系列
4. 指定 UI 狀態
5. 通過檢查腳本
6. 再進母庫或 UI

---

## 9. 建議的資料品質規則

每張正式卡片至少要有：

- ID
- 標題
- 妝容
- 場景背景
- 光線
- 服裝
- 動作與鏡頭
- 構圖
- 特效
- 色調
- 鏡頭角度
- 圖片比例
- 鏡頭焦段
- 燈光風格
- 整體氛圍
- 鏡頭語言
- 大主題 ID
- 子系列
- UI 狀態

若缺少重要欄位：

- 不應直接進 `official`
- 可以先標 `review`
- UI 可選擇隱藏或顯示「待補」標籤

---

## 10. 需要 AI 們一起討論的問題

1. `風格範例.md` 要定位成「全部母庫」還是「UI 可用正式庫」？
2. UI 要顯示全部 625 筆，還是只顯示精選 568 筆左右？
3. 目前 15 大類名稱要用短名，例如 `魅魔系列`，還是正式名，例如 `魅魔之吻．煉獄誘惑`？
4. `v0.27`、`rev_*`、圖片逆推資料要不要預設進 UI？
5. 重複標題要合併、保留多版本，還是用 `variant` 區分？
6. 東方暗黑、狐仙、妖后、神話仙界這類交界資料，應歸入中國神話、聊齋、仙俠，還是西方魔幻？
7. 是否新增 UI 子系列篩選列？
8. 是否建立 `風格索引.json` 作為 UI 與母庫中介層？
9. 是否要建立一個 `scripts/audit_style_examples.mjs`，每次建檔前自動檢查？
10. 後續 AI 自己設計的新卡片，是否一律先進 `review`，人工確認後才進 `official`？

---

## 11. 我建議的決策方向

建議採用：

- `風格範例.md` = 母庫
- `風格索引.json` = 分組、排序、狀態、UI 控制
- `index.html` = 從索引生成或同步
- UI = 15 大類 + 子系列篩選 + 狀態標籤

原因：

- 保留母庫完整性
- UI 不會被資料量拖垮
- 後續新增圖片分析與 AI 自設計資料比較安全
- 可讓多 AI 分工處理不同主題，不會互相打架

---

## 12. 建議下一步

如果 AI 們同意本方案，下一步可以做：

1. 產生 `docs/audit/風格範例_資料盤點_20260523.md`
2. 產生 `核心資料/風格索引草案.json`
3. 先標記 625 筆卡片的大類、子系列、狀態
4. 列出 UI 未收錄的 57 筆左右差異清單
5. 討論哪些進 UI、哪些留母庫
6. 再開始改 UI 子系列篩選

本文件先到這裡，等待其他 AI 共同審閱與討論。

---

## 13. Codex 初步意見：同意採用母庫 + 索引層方案

Codex 目前同意本文件的主方向，並建議不要直接把 `風格範例.md` 當成 UI 唯一資料結構。

### 13.1 同意原因

目前 `風格範例.md` 已經累積成大型母庫，裡面同時包含：

- 正式可用卡片
- 補充批次資料
- 圖片逆推資料
- AI 自設計資料
- 疑似重複標題
- 欄位尚未補齊的卡片

如果直接把整份母庫塞進 UI，短期可以快速同步，但長期會造成：

- UI 卡片過多，使用者不好找
- 核心代表風格被補充資料淹沒
- 新增資料一進母庫就污染正式 UI
- 重複卡片、待審卡片、逆推卡片無法分流
- 15 大主題底下變成超大桶，缺少策展感

因此，較穩定的做法是：

- `風格範例.md` 保留為完整母庫
- `風格索引.json` 或同等索引層負責 UI 分組、排序、狀態
- UI 只讀取已審核、可展示、排序完成的資料

### 13.2 最重要的三個共識

Codex 認為目前應優先確認三件事：

1. 15 大主題固定不動

`theme_01` 到 `theme_15` 應該作為長期骨架，不應因為新增卡片而改名、換順序或重新拆大類。

2. 必須新增第二層子系列

15 大主題太大，尤其是魔幻、古裝、旅拍、婚紗、魅魔魔王類。每張卡片應該補 `series` 或 `subgroup`。

例如：

- 魅魔之吻：魅魔系列、莉莉絲、夜之女王、魅魔魔王偏魅魔者
- 魔王降臨：女魔王、魔冕女皇、冥界女王、滅世魔女
- 聖堂與暗黑：暗黑哥德、奇幻魔法、聖堂天使、神話女神、水下花境、魔龍魔獸
- 大國風華：漢服古裝、朝代宮服、唐代、宋代、明代、清代、民國旗袍

3. 必須新增卡片狀態

建議至少使用：

- `core`：核心代表卡，優先展示
- `official`：正式可用卡
- `supplement`：補充卡
- `review`：待審卡
- `hidden`：保留但不顯示
- `duplicate`：疑似重複，待合併或改 variant

這樣 AI 新增資料時可以先進 `review`，不會直接進正式 UI。

### 13.3 Codex 建議的實作順序

Codex 不建議下一步直接改 UI。

建議順序如下：

1. 先做資料盤點報告

建立 `docs/audit/風格範例_資料盤點_20260523.md`，列出：

- 母庫總卡片數
- ID 重複狀態
- 標題重複狀態
- 缺欄位清單
- 疑似分類錯置清單
- UI 已收錄 / 未收錄清單

2. 再做 `風格索引草案.json`

先不要改母庫全文，只建立索引草案，為每張卡片標：

- `id`
- `title`
- `theme_id`
- `series`
- `ui_status`
- `source_type`
- `source_batch`
- `sort_weight`
- `tags`
- `risk_flags`

3. 討論 UI 要吃哪些狀態

建議初期 UI 只吃：

- `core`
- `official`
- 必要的 `supplement`

`review`、`hidden`、`duplicate` 暫不進主 UI。

4. 最後才改 UI

UI 改動建議採取漸進方式：

- 第一階段：維持 15 大類，改排序與標籤
- 第二階段：增加子系列篩選 chips
- 第三階段：增加狀態篩選與搜尋
- 第四階段：讓 UI 從索引自動生成，而不是手工維護巨大 CATS

### 13.4 Codex 對 568 / 625 筆差異的看法

目前 UI 約 568 筆，母庫約 625 筆。

Codex 不建議直接把缺少的 57 筆全部補進 UI。

原因：

- 有些可能是待審或逆推資料
- 有些可能重複
- 有些可能欄位不足
- 有些可能分類還不穩

比較好的做法是先列出差異清單，再逐筆標記：

- 應進 UI
- 留母庫不進 UI
- 需要補欄位
- 需要合併
- 需要改分類

### 13.5 Codex 的推薦結論

Codex 建議採用以下架構：

```text
核心資料/風格範例.md
  = 完整母庫，保留所有正式卡、補充卡、逆推卡、待審卡

核心資料/風格索引.json
  = 分組、排序、狀態、UI 顯示控制

scripts/audit_style_examples.mjs
  = 檢查母庫品質、欄位缺漏、重複、UI 差異

scripts/build_style_data.mjs
  = 從母庫 + 索引生成 UI CATS

index.html
  = 只負責展示，不直接承擔資料治理
```

這樣後續 AI 們可以分工：

- 一個 AI 做盤點
- 一個 AI 做分類索引
- 一個 AI 做重複與缺欄位審核
- 一個 AI 做 UI 子系列篩選
- 一個 AI 做自動生成腳本

### 13.6 請其他 AI 接續討論

請其他 AI 針對以下問題回覆：

1. 是否同意 `風格範例.md` 作為母庫，而不是 UI 直接資料源？
2. 是否同意新增 `風格索引.json`？
3. 是否同意 UI 初期只顯示 `core + official`？
4. 子系列命名是否需要先由 AI 建議，再由使用者定稿？
5. 568 / 625 筆差異是否應先盤點，不直接補進 UI？
6. 是否需要把所有 AI 新增資料預設標為 `review`？

Codex 的立場：同意先盤點、建索引、再改 UI。不要先大幅重排母庫，也不要直接把全部資料推進 UI。

---

## 14. 方案 A 已通過：正式處理順序

討論結論：大家同意採用方案 A。

方案 A 定義：

- `風格範例.md` 保留為完整母庫
- 新增索引層管理分組、排序、狀態
- UI 不直接吃整份母庫
- 先盤點，再建索引，再同步 UI
- 不先重排母庫全文

以下是正式處理順序。

---

### Phase 0：凍結規則與備份

目標：確保後續整理有回復點，不會誤傷現有資料。

要做：

1. 備份目前檔案：
   - `核心資料/風格範例.md`
   - `index.html`
   - `core.js`
2. 建立本輪整理版本標記，例如：
   - `style-index-plan-v1`
   - `audit-20260523`
3. 宣告整理期間規則：
   - 不直接刪母庫卡片
   - 不直接把未審資料推進 UI
   - 不直接重排全文
   - 所有新增資料預設 `review`

原因：

- 現在母庫已有 625 筆，直接動全文風險高
- UI 仍在使用，必須保留可回復版本

完成標準：

- 備份檔存在
- `ai-task.md` 記錄本輪流程
- 沒有修改正式資料內容

---

### Phase 1：資料盤點報告

目標：先知道母庫真實狀態，不憑印象整理。

要做：

建立：

`docs/audit/風格範例_資料盤點_20260523.md`

盤點內容：

1. 母庫總卡片數
2. UI 目前卡片數
3. 母庫有、UI 沒有的卡片
4. UI 有、母庫找不到的卡片
5. 重複標題清單
6. 重複 ID 清單
7. 缺欄位清單
8. 疑似分類錯置清單
9. `v0.27` / `rev_*` / 圖片逆推來源清單
10. 每個主題目前卡片數分布

原因：

- 目前母庫約 625 筆，UI 約 568 筆，有差異
- 不能直接補，也不能直接刪
- 必須先知道差異來源

完成標準：

- 有完整盤點報告
- 差異清單可追溯到卡片 ID / 標題
- 可以看出哪些卡片需要 review / duplicate / supplement

---

### Phase 2：建立風格索引草案

目標：在不改母庫全文的前提下，先建立可治理的索引層。

要做：

建立：

`核心資料/風格索引草案.json`

每筆至少包含：

```json
{
  "id": "",
  "title": "",
  "theme_id": "",
  "theme_name": "",
  "series": "",
  "ui_status": "review",
  "source_type": "",
  "source_batch": "",
  "sort_weight": 0,
  "tags": [],
  "risk_flags": [],
  "notes": ""
}
```

狀態初始規則：

- 現有 UI 已收錄且欄位完整：`official`
- 明確代表該主題者：`core`
- 補充批次：`supplement`
- 圖片逆推或來源不明：`review`
- 重複標題：`duplicate`
- 暫不適合 UI：`hidden`

原因：

- 索引層可以管理分類與狀態
- 不破壞 `風格範例.md`
- 後續 UI 可以只吃索引中允許顯示的資料

完成標準：

- 625 筆母庫卡片都有索引記錄
- 每筆都有 `theme_id`、`series`、`ui_status`
- 不直接修改母庫正文

---

### Phase 3：主題與子系列定稿

目標：把 15 大主題底下的子系列整理成穩定結構。

要做：

1. 固定 15 大主題 ID：
   - `theme_01` 到 `theme_15`
2. 為每個大主題定義子系列順序
3. 對交界資料做歸屬判斷
4. 把模糊分類標 `review`，不硬塞

建議優先處理順序：

1. `theme_01` 魅魔之吻
2. `theme_02` 魔王降臨
3. `theme_03` 墮天使
4. `theme_13` 聖堂與暗黑
5. `theme_10` 大國風華
6. `theme_12` 環球美景旅拍
7. `theme_15` 當代時尚
8. `theme_14` 次元覺醒
9. `theme_11` 東方仙俠
10. `theme_05` 中國神話
11. `theme_06` 聊齋
12. `theme_07` 四大名著
13. `theme_08` 金庸武俠
14. `theme_09` 陸劇同款
15. `theme_04` 長相思

原因：

- 先處理卡片量大、混雜度高的主題
- 魔幻、古裝、旅拍、婚紗最容易膨脹，應先治理
- 長相思、金庸、陸劇等 IP 型主題邊界較明確，可以後處理

完成標準：

- 每個 `theme_id` 有明確子系列表
- 每張卡片都能被歸到某個大主題與子系列，或明確標 `review`

---

### Phase 4：排序權重與核心卡指定

目標：讓 UI 顯示有策展順序，而不是照檔案出現順序。

排序規則：

1. `core`：最前面
2. `official`：第二段
3. `supplement`：第三段
4. `review`：不進主 UI，或進待審區
5. `duplicate`：不進主 UI
6. `hidden`：不進 UI

建議 `sort_weight`：

- `1000-1999`：core
- `2000-4999`：official
- `5000-6999`：supplement
- `7000-8999`：review
- `9000-9999`：hidden / duplicate

同系列內排序：

- 代表性強者優先
- 欄位完整者優先
- 角色識別清楚者優先
- 來源穩定者優先
- 逆推圖與批次補充靠後

原因：

- UI 第一眼要看到最穩的風格
- 補充資料不能淹沒核心圖
- 後續新增資料可直接插入權重區間

完成標準：

- 每筆索引都有 `sort_weight`
- 每個主題至少有 1-3 張 `core`
- UI 可依權重穩定排序

---

### Phase 5：差異審核與資料補齊

目標：處理 568 / 625 的差異，不直接補進 UI。

要做：

1. 列出母庫有但 UI 沒有的卡片
2. 每筆判斷：
   - 進 UI
   - 留母庫
   - 需要補欄位
   - 需要合併
   - 需要重新分類
3. 補齊缺欄位：
   - 妝容
   - 場景背景
   - 光線
   - 服裝
   - 動作與鏡頭
   - 構圖
   - 特效
   - 色調
4. 重複標題處理：
   - 真重複：標 `duplicate`
   - 只是相似：加 `variant`
   - 一張較好：保留為 `official`，另一張 `supplement` 或 `hidden`

原因：

- 差異不代表錯誤，可能是精選或待審
- 必須逐筆標狀態

完成標準：

- 568 / 625 差異有明確處理結果
- 缺欄位卡片被標記或補齊
- 重複標題都有處理策略

---

### Phase 6：建立檢查腳本

目標：讓後續建檔有自動檢查，不靠人工記憶。

要做：

建立：

`scripts/audit_style_examples.mjs`

檢查內容：

1. 卡片數
2. ID 是否唯一
3. 標題是否重複
4. 必要欄位是否缺漏
5. 索引是否覆蓋全部卡片
6. `theme_id` 是否合法
7. `ui_status` 是否合法
8. UI 收錄數與索引狀態是否一致
9. 高風險詞是否出現
10. 新增資料是否仍是 `review`

原因：

- 後續會繼續新增圖片分析與 AI 自設計資料
- 沒有腳本會很快再亂

完成標準：

- 腳本可執行
- 輸出 audit report
- 發現錯誤時能指出卡片 ID / 標題

---

### Phase 7：建立 UI 生成腳本

目標：不要再手工維護巨大 `index.html` CATS。

要做：

建立：

`scripts/build_style_data.mjs`

功能：

1. 讀取 `風格範例.md`
2. 讀取 `風格索引.json`
3. 只選取允許進 UI 的狀態
4. 依 `theme_id`、`series`、`sort_weight` 排序
5. 生成 UI 用 `CATS`
6. 可選擇：
   - 輸出 `dist/style-data.js`
   - 或更新 `index.html` 內的 CATS 區塊

原因：

- 降低手改錯誤
- 讓 UI 與母庫同步可重複執行
- 讓多 AI 協作更安全

完成標準：

- 腳本能穩定生成 UI 資料
- 生成後 UI 卡片數與索引狀態一致
- 不破壞現有咒語生成功能

---

### Phase 8：UI 第一階段改動

目標：先小改 UI，不一次改太大。

要做：

1. 15 大類名稱改為正式名稱或「短名 + 副標」
2. 卡片顯示狀態標籤：
   - 核心
   - 正式
   - 補充
   - 待審
3. 卡片排序改吃 `sort_weight`
4. 不新增複雜搜尋，先保持穩定

原因：

- 先驗證索引與排序是否正確
- 避免 UI 一次改太大導致測試困難

完成標準：

- UI 仍可正常選卡、產出咒語、複製
- 卡片順序符合索引
- 狀態標籤顯示正常

---

### Phase 9：UI 第二階段改動

目標：加入子系列篩選，讓大量資料可用。

要做：

1. 在大類下方增加子系列 chips
2. 新增 `curSeriesID`
3. `renderPresets()` 根據大類 + 子系列過濾
4. 增加「全部」選項
5. 可選：增加狀態篩選與搜尋框

原因：

- 625 筆以上資料需要第二層篩選
- 使用者可以更快找到想要的風格

完成標準：

- 選大類後能看到子系列
- 點子系列後卡片正確過濾
- 隨機功能可選擇全庫或目前篩選範圍

---

### Phase 10：母庫清理與正式化

目標：在索引穩定後，再整理 `風格範例.md` 本體。

要做：

1. 把 `v0.27` 來源字樣移到來源欄位
2. 統一標題格式
3. 補齊缺欄位
4. 合併或標記重複卡
5. 將 `review` 卡片逐步轉正或隱藏
6. 更新 `核心咒語規範.md` 的建檔流程描述

原因：

- 等索引穩定後再清母庫，風險最低
- 避免整理中途破壞 UI 或卡片對應

完成標準：

- 母庫格式一致
- 所有正式卡片欄位完整
- 後續新增流程清楚

---

## 15. 優先順序總結

正式執行順序如下：

1. Phase 0：備份與凍結規則
2. Phase 1：資料盤點報告
3. Phase 2：建立風格索引草案
4. Phase 3：主題與子系列定稿
5. Phase 4：排序權重與核心卡指定
6. Phase 5：差異審核與資料補齊
7. Phase 6：建立檢查腳本
8. Phase 7：建立 UI 生成腳本
9. Phase 8：UI 第一階段改動
10. Phase 9：UI 第二階段改動
11. Phase 10：母庫清理與正式化

目前下一步應從 Phase 0 與 Phase 1 開始，不應直接改 UI。

---

## 16. Codex 執行結果：Phase 0-10 本輪落地狀態

執行時間：2026-05-23

本輪已依方案 A 進行工程化落地。核心原則維持不變：

- `核心資料/風格範例.md` 保留為母庫
- 不直接刪除母庫卡片
- 不直接重排母庫全文
- `review` / `duplicate` 不自動進主 UI
- UI 由索引層控制顯示、排序與子系列

### 16.1 已建立的主要成果

1. Phase 0 備份與凍結：
   - `核心資料/versions/20260523_phase0_freeze_style-index-plan-v1/`
   - `docs/audit/phase0_備份與凍結規則_20260523.md`

2. Phase 1 基準與目前盤點：
   - `docs/audit/風格範例_資料盤點_20260523_baseline.md`
   - `docs/audit/風格範例_資料盤點_20260523.md`
   - baseline 固定記錄原始狀態：母庫 625、UI 568、母庫有但 UI 沒有 57、UI 有但母庫找不到 1。
   - current 記錄索引同步後狀態：母庫 625、UI 441、母庫未進 UI 184、UI 有但母庫找不到 0。

3. Phase 2-4 索引、子系列、排序與核心卡：
   - `核心資料/風格索引草案.json`
   - `docs/audit/風格索引草案_20260523.md`
   - 625 筆母庫卡片全覆蓋。
   - 狀態統計：`core` 30、`official` 314、`supplement` 97、`review` 164、`duplicate` 20。
   - 15 大主題皆有核心卡。

4. Phase 5 差異審核：
   - 差異不直接補進 UI，先由索引狀態分流。
   - `review` 與 `duplicate` 留在母庫與索引，不進主 UI。
   - 目前索引檢查唯一警告：母庫 `wx_19` source ID 重複 2 次。

5. Phase 6 檢查腳本：
   - `scripts/audit_style_examples.mjs`
   - `scripts/audit_style_examples_baseline.mjs`
   - `scripts/audit_style_index.mjs`

6. Phase 7 UI 生成腳本：
   - `scripts/build_style_data.mjs`
   - 可輸出 `dist/style-data.generated.json` / `dist/style-data.generated.js`
   - 可用 `--write-html` 同步 `index.html` 內 CATS metadata。

7. Phase 8-9 UI 改動：
   - `index.html` 15 大類改為正式主題名。
   - 卡片加入 `ui_status` 標籤與 `series` 標籤。
   - 大類下方新增子系列 chips。
   - `core.js` 新增 `curSeriesID`、`renderSeriesFilter()`、`selSeries()`、依子系列過濾卡片。
   - 目前主 UI 顯示 `core + official + supplement`，總數 441。

8. Phase 10 母庫正式化邊界：
   - `docs/audit/phase10_母庫清理與正式化_20260523.md`
   - 本輪未直接整理母庫全文；後續應先處理 `duplicate` 與 `review`，再逐步補欄位。

### 16.2 新增 npm scripts

- `npm run phase0:freeze-style-index`
- `npm run audit:style-examples-baseline`
- `npm run audit:style-examples`
- `npm run build:style-index-draft`
- `npm run audit:style-index`
- `npm run build:style-data`
- `npm run sync:style-data`
- `npm run verify:ui-static`

### 16.3 驗證結果

已通過：

- `node --check core.js`
- `node --check prompt_governance.js`
- `node --check scripts/lib/style_library.mjs`
- `node --check scripts/audit_style_examples_baseline.mjs`
- `node --check scripts/audit_style_examples.mjs`
- `node --check scripts/build_style_index_draft.mjs`
- `node --check scripts/audit_style_index.mjs`
- `node --check scripts/build_style_data.mjs`
- `node --check scripts/freeze_style_index_phase0.mjs`
- `node --check scripts/verify_ui_static.mjs`
- `python scripts/check_structure.py`
- `python scripts/build_dist.py`
- `node scripts/lint_prompt_governance.mjs`
- `node scripts/report_risk_flags.mjs`
- `node scripts/verify_ui_static.mjs`

`verify_ui_static` 結果：

- `cats`: 15
- `total`: 441
- 子系列篩選可過濾卡片
- `buildPrompt()` 可產生包含 identity gate 的 prompt
- `generate()` 與 `doRandom()` 可執行

### 16.4 已知剩餘事項

- 母庫 `wx_19` source ID 重複，需 Phase 10 後續處理。
- 9 組重複標題多來自 `rev_*`，目前標 `duplicate`。
- 164 筆 `review` 不進主 UI，需人工或 AI 逐筆審核。
- 553 筆有母庫欄位缺口，其中大量是 `光線`、`特效`、`色調` 等非 runtime 必需欄位，後續需決定補欄位或調整母庫欄位要求。

---

## 17. 身份主權 Prompt 規範：保留真人，替她換世界

日期：2026-05-24
狀態：新增為方案 A 後續核心規範，待 AI 們共同確認後落實到 `核心咒語規範.md`、`prompt_governance.js`、索引與 UI。

---

### 17.1 新共識

目前最重要的方向不是「生成更美的幻想角色」，而是：

> 保留這個真人，然後替她換世界。

也就是說，之後所有風格卡片、圖片分析、AI 自設計建檔、UI 產出咒語，都必須遵守：

- 真人身份優先於風格
- 臉部身份優先於美感
- reference photo 優先於角色設定
- 幻想元素只能作用在環境、服裝、道具、光線、氛圍
- 不能讓幻想詞彙重建臉部模板

核心宣告：

```text
Identity priority over aesthetics.
The uploaded face identity is more important than fantasy styling, cinematic beauty, costume elegance, or genre atmosphere.
Do not beautify, idealize, redesign, reconstruct, or reinterpret the face.
Keep the original facial proportions, eye spacing, eyelid shape, nose geometry, cheek volume, jaw width, mouth structure, and natural skin texture from the uploaded photo.
The result must look like a real photograph of this exact person inside a fantasy environment, not a fantasy character generated from the reference photo.
```

---

### 17.2 舊問題：風格堆疊 Prompt 會召喚模板臉

以下詞彙不應再被當成普通氣氛詞使用：

```text
succubus queen
fantasy beauty
editorial realism
magazine cover
goddess aura
immortal aesthetic
dark fantasy heroine
perfect skin
glamorous model face
fantasy empress
```

原因：

這些詞容易讓 AI 直接召喚：

- 網紅臉
- 古偶臉
- fantasy queen 臉
- 歐美模特臉
- 女神模板臉
- AI 美顏臉

結果會變成「像本人，但不是本人」。

所以後續不能只靠 `Avoid identity drift` 補救，而要從源頭改寫風格資料與 Prompt 架構。

---

### 17.3 新寫法：身份主權語言

之後描述人物時，不應說：

```text
demon queen
succubus woman
fantasy empress
goddess heroine
immortal beauty
```

應改成：

```text
a real woman inside a dark supernatural environment
a real person wearing fantasy-inspired clothing
a real-person environmental portrait in a mythic setting
a documentary-real portrait with supernatural surroundings
the uploaded person placed inside a cinematic fantasy environment
```

差別：

- 舊寫法把人變成角色
- 新寫法把真人放進世界

---

### 17.4 5 大核心原則

#### 1. 人物永遠是真人

所有卡片的 `角色氛圍`、`動作與鏡頭`、`服裝`、`品質` 都要避免把人物寫成新角色。

建議語法：

```text
a real person
real woman
real-person portrait
documentary-real subject
authentic human presence
```

禁止或降權語法：

```text
fantasy beauty
goddess face
heroine template
perfect queen
idealized empress
```

#### 2. 風格只能作用在環境與服裝

允許：

```text
dark supernatural environment
mythic environment
cinematic surroundings
gothic palace interior
fantasy-inspired costume
ritual props
atmospheric lighting
```

避免：

```text
fantasy face
goddess aura on face
immortal facial beauty
perfect fantasy queen look
```

原則：

> 讓幻想發生在世界，不要發生在臉。

#### 3. beauty 類詞全部降權

高風險詞：

```text
beautiful
gorgeous
glamorous
perfect skin
elegant beauty
magazine beauty
model face
flawless face
porcelain skin
luxury beauty
```

替換方向：

```text
authentic human skin
real-person texture
natural facial asymmetry
documentary portrait realism
visible natural skin detail
real facial geometry
reference face fidelity
```

#### 4. 不讓 AI 重建角度

高風險姿勢與角度：

```text
looking upward
dramatic side profile
heroic angle
extreme cinematic pose
low-angle hero shot
over-the-shoulder turn-back pose
```

替換方向：

```text
neutral gaze
gentle eye contact
camera-level face alignment
stable facial orientation
front or mild three-quarter face angle
natural head-to-neck alignment
```

原因：

AI 最容易在大幅轉頭、仰頭、側臉、英雄仰拍時換臉。

#### 5. 身份優先權必須明講

每次產出咒語時，都應有身份優先段落，且排序要在風格描述前面。

身份段落優先順序：

1. reference photo gate
2. identity priority over aesthetics
3. no face redesign
4. preserve facial geometry
5. fantasy only affects environment / costume / props / lighting
6. real photograph of this exact person

---

### 17.5 對資料庫的修改要求

後續整理 `風格範例.md` 與 `風格索引.json` 時，要新增身份風險治理欄位。

建議在索引新增：

```json
{
  "identity_mode": "identity_sovereign",
  "fantasy_scope": ["environment", "costume", "props", "lighting"],
  "face_scope": "preserve_only",
  "beauty_risk": "low | medium | high",
  "angle_risk": "low | medium | high",
  "identity_risk_flags": [],
  "rewrite_needed": false
}
```

用途：

- 標記哪些卡片容易換臉
- 找出高污染詞
- 區分「風格在世界」與「風格污染人物」
- 讓 UI 或生成器能自動套用更強身份保護

---

### 17.6 對風格卡片欄位的重寫規則

#### 妝容欄位

妝容只能是表面化妝，不可改五官。

應寫：

```text
surface makeup only, preserving original eye shape, eyelid structure, lip shape, cheek volume, jaw width, and natural skin texture
```

避免：

```text
cat-eye reshaping
sharp goddess eyes
perfect lips
porcelain beauty skin
fantasy queen face
```

#### 角色氛圍欄位

應寫「真人在某種世界中」。

例如：

```text
real-person environmental portrait inside a dark gothic fantasy setting
```

不要寫：

```text
dark fantasy queen beauty with goddess aura
```

#### 服裝欄位

服裝可以華麗，但不能要求臉變成角色。

應寫：

```text
fantasy-inspired gown worn by the uploaded real person, costume styling only, no facial redesign
```

#### 動作與鏡頭欄位

優先穩定臉部：

```text
camera-level face alignment, neutral gaze, stable head-neck-shoulder continuity, mild three-quarter face angle
```

避免大幅轉頭、仰拍、英雄角度。

#### 品質欄位

應偏真人攝影：

```text
real photograph, documentary realism, authentic skin texture, real-person portrait fidelity
```

避免：

```text
perfect beauty render
fantasy model quality
AI goddess portrait
```

---

### 17.7 對核心咒語規範.md 的修改建議

下一步應在 `核心資料/核心咒語規範.md` 新增一章：

`身份主權 Prompt 規範`

內容應包含：

1. 禁止把真人生成為角色模板
2. 幻想元素只能附著在環境、服裝、道具、光線
3. 身份優先權高於美感、風格、角色、電影感
4. beauty 類詞要降權或替換
5. 角度與姿勢要優先保臉
6. 所有新卡片進母庫前都要檢查身份污染風險

---

### 17.8 對 prompt_governance.js / core.js 的修改建議

後續工程應新增或強化：

1. 高污染詞降權表

包含：

```text
fantasy beauty
goddess aura
immortal aesthetic
heroine
model face
perfect skin
flawless
glamorous beauty
```

2. 替換詞表

例如：

```text
fantasy beauty -> real-person portrait in a fantasy environment
goddess aura -> mythic atmosphere around the environment
magazine beauty -> documentary-real portrait styling
perfect skin -> authentic human skin texture
```

3. Prompt 強制前置段落

在所有風格前面插入 identity sovereignty block。

4. 角度風險檢查

遇到：

```text
looking upward
side profile
low angle
heroic angle
over shoulder
extreme pose
```

要自動提醒或替換為 safer face orientation。

5. 卡片風險報告

`audit_style_examples.mjs` 應新增 identity risk 掃描。

---

### 17.9 對 UI 的修改建議

UI 不一定要增加複雜功能，但應讓使用者知道目前是身份保護模式。

建議 UI 增加：

1. 模式標籤

```text
身份主權模式：開啟
```

2. 卡片風險標籤

```text
低身份風險
需改寫
高美化詞
角度風險
```

3. 產出咒語時，預設套用身份主權段落

4. 不建議給使用者一個可以關閉身份保護的主開關

原因：

這個工具的核心價值就是真人鎖臉，不應讓使用者不小心關掉。

---

### 17.10 Phase A 後續新增工作項目

在原本 Phase 0-10 後，新增以下工作：

#### Phase 11：身份污染掃描

建立或擴充：

`scripts/audit_style_examples.mjs`

新增掃描：

- 高污染 beauty 詞
- goddess / heroine / model face 類模板詞
- 角度換臉風險詞
- face redesign 風險詞
- fantasy 是否作用到人物臉部

輸出：

`docs/audit/身份污染風險報告_20260524.md`

#### Phase 12：身份主權改寫索引

在 `風格索引.json` 中為每筆卡片補：

- `identity_mode`
- `beauty_risk`
- `angle_risk`
- `identity_risk_flags`
- `rewrite_needed`

#### Phase 13：高風險卡片改寫

優先改：

- 魅魔
- 魔王
- 墮天使
- 西方魔幻
- 女王婚紗
- 仙俠神女

因為這些最容易召喚模板臉。

#### Phase 14：Prompt 生成器更新

更新：

- `核心咒語規範.md`
- `prompt_governance.js`
- `core.js`
- UI 顯示文字

確保所有 prompt 都先宣告身份主權，再描述風格。

---

### 17.11 最終判斷標準

之後判斷一張卡片是否合格，不再只看畫面是否漂亮，而是看：

1. 是否仍像 reference photo 本人
2. 是否保留真實五官幾何
3. 是否沒有 AI 自行美化成模板臉
4. 幻想元素是否只作用在世界、服裝、道具、光線
5. 動作與角度是否保護臉部穩定
6. 最終結果是否像「真人照片換世界」，不是「角色生成後貼臉」

一句話標準：

> 不是生成角色，而是保留真人，替她換世界。

---

## 18. 問題過程分析：為什麼有 Identity Lock 還是換臉 / 大頭

日期：2026-05-24
狀態：依實際 prompt 失敗案例補充，作為 Phase 11-14 的具體修正依據。

---

### 18.1 核心結論

目前問題不是沒有寫 identity lock，而是：

> 後段風格詞、角色詞、beauty 詞、editorial 詞、構圖詞的總權重大於 identity lock。

所以模型最後仍然會走向：

- 幻想女王模板臉
- 古偶女主模板臉
- fantasy queen 臉
- AI 網紅臉
- 時尚封面大頭構圖

目前真正要修的不是單純加更多 `preserve face`，而是要降低後段污染詞，讓整個 prompt 結構變成：

```text
身份主權 > 真人攝影 > 穩定構圖 > 服裝 / 環境幻想 > 低強度特效
```

不能再讓 prompt 變成：

```text
幻想角色 archetype > editorial beauty > cinematic / concept art > reference face
```

---

### 18.2 失敗類型 A：幻想角色模板壓過真人身份

高風險來源：

```text
聊齋誌異．妖魅幻境
綠蜂化形
綠衣女
xianxia-style
immortal aesthetic
Chinese drama character
fantasy queen
demon sovereign
succubus queen
```

問題：

這類詞會讓模型先生成「它認為的角色」，再把 reference photo 縫進去。

結果：

- 還像本人，但被角色模板化
- 眼睛放大或變長
- 下巴收尖
- 鼻樑精修
- 皮膚變平滑
- 表情與本人情緒斷開

修正方向：

不要把人物稱為角色本體，改成真人進入某個世界。

替換：

```text
聊齋誌異．妖魅幻境 / 綠蜂化形 / 綠衣女
-> inspired by classical Chinese forest fantasy atmosphere

xianxia-style character
-> a real person placed inside a xianxia-inspired environment

fantasy queen / demon sovereign
-> a real woman in a dark supernatural environment with symbolic royal styling

succubus woman
-> the uploaded real person wearing dark supernatural costume styling
```

工程要求：

- `prompt_governance.js` 應新增 archetype 降權表。
- `風格索引.json` 應增加 `archetype_risk`。
- 卡片標題可以保留世界觀名稱，但輸出 prompt 時人物描述要改成 real person language。

---

### 18.3 失敗類型 B：Editorial / Magazine / Concept Art 造成模板臉

高風險詞：

```text
editorial realism
premium fantasy editorial realism
magazine cover
premium Chinese drama character editorial realism
cinematic production quality
premium dark supernatural character concept art quality
ultra realistic dark costume detail
high-end magazine visual grammar
fashion beauty portrait
```

問題：

`editorial`、`magazine cover`、`concept art` 在模型中常連到：

- 模特臉
- 高級美女臉
- 修過的五官
- 對稱美顏
- 銳利下巴
- 磨皮
- 大頭半身封面構圖

替換方向：

```text
premium fantasy editorial realism
-> natural cinematic realism

magazine cover camera language
-> natural environmental portrait photography

premium dark supernatural character concept art quality
-> dark cinematic fashion photography with real-person identity fidelity

premium Chinese drama character editorial realism
-> natural period-drama environmental portrait realism

fashion beauty portrait
-> controlled real-person portrait photography
```

工程要求：

- `ANTI_PATTERNS.bannedPromptTerms` 應納入 `editorial realism`、`magazine beauty`、`concept art quality`、`character editorial realism`。
- `Camera language` 不應再輸出 `magazine cover` 這類容易放大臉的描述，應改為 identity-safe camera language。
- `quality` 欄位要從 `concept art quality` 改成 `real-person photographic quality`。

---

### 18.4 失敗類型 C：Beauty / Makeup 詞仍會偷改臉

看似安全但仍有風險：

```text
natural clean makeup
realistic everyday beauty
nude-pink lip
soft defined brows
gold shimmer eye shadow
peach nude lip
immortal aesthetic
sharp elegant winged eyeliner
blackened red smoky eyes
dark regal contour
```

問題：

這些詞容易影響：

- 眼型
- 眉骨視覺
- 唇形厚薄
- 下巴輪廓
- 皮膚年齡感
- 臉部立體度

替換方向：

```text
realistic everyday beauty
-> realistic natural skin appearance

natural clean makeup
-> minimal surface makeup, no facial restructuring

soft defined brows
-> natural brows preserved from the reference photo

gold shimmer eye shadow
-> subtle color-only eye surface makeup, no eye-shape enhancement

blackened red smoky eyes
-> soft dark red smoky eye makeup kept subtle and surface-only

dark regal contour
-> minimal shadow-toning on makeup surface only, no cheekbone or jaw reshaping

sharp winged eyeliner
-> soft eyeliner color only, no eye-shape-changing liner
```

必加硬鎖臉句：

```text
Face identity lock:
The uploaded face must remain structurally unchanged.
Do not beautify, redesign, reconstruct, idealize, or reinterpret the face.
Keep the exact forehead height, eye spacing, eyelid shape, nose bridge width, nostril geometry, lip thickness, cheek structure, jaw width, and natural facial proportions from the uploaded photo.
No actress-face conversion.
No fantasy queen face template.
No xianxia heroine face template.
No beauty-filter reconstruction.
```

工程要求：

- 妝容資料要分成 `makeup_color` 與 `face_structure_policy`。
- 所有妝容只能輸出 surface/color/texture，不得輸出 reshape/enhance/contour face。
- `prompt_governance.js` 應自動把 `beauty` 轉成 `natural skin appearance` 或直接移除。

---

### 18.5 失敗類型 D：側看、仰頭、英雄角度造成換臉

高風險詞：

```text
looking curious toward the side
looking upward
dramatic side profile
heroic angle
low-angle hero shot
over-the-shoulder turn-back pose
turning back over the shoulder
extreme cinematic pose
```

問題：

AI 最容易在大幅轉頭、側臉、仰頭、英雄仰拍時重建另一張臉。

替換方向：

```text
looking curious toward the side
-> gentle natural eye contact toward camera

looking upward
-> camera-level gaze with stable face orientation

dramatic side profile
-> mild three-quarter face angle with both eyes structurally recognizable

heroic angle / low-angle hero shot
-> eye-level or natural chest-height portrait

over-the-shoulder turn-back pose
-> front-facing or mild three-quarter body turn, face directed toward camera
```

工程要求：

- 所有 pose guidance 必須通過 `face_orientation_safety`。
- 若出現 side / upward / over shoulder / low angle，預設改寫。
- UI 中的角度選項應標示「高換臉風險」或直接隱藏高風險角度。

---

### 18.6 失敗類型 E：半身 + face-readable + fashion framing 造成大頭

高風險組合：

```text
Angle/framing: 半身人像
half-body portrait from waist up
face-readable half-body
face remains clear and readable
showing face, upper costume details
fashion camera framing
magazine cover camera language
```

問題：

半身 / waist up / face-readable / upper costume details 疊加後，模型會自動拉近鏡頭。

結果：

- 頭變大
- 肩膀變窄
- 身體縮短
- 胸口與臉被放大
- 形成時尚美妝封面比例

修正方向：

```text
Angle/framing: 半身人像
-> three-quarter portrait or medium-full composition

half-body portrait from waist up
-> three-quarter composition showing head, shoulders, torso, waist, and partial skirt silhouette

showing face, upper costume details
-> showing complete upper-body silhouette and natural body proportion

face-readable half-body
-> identity-readable three-quarter portrait with balanced head-to-shoulder-to-torso proportion
```

必加比例句：

```text
Head must not dominate the frame.
Maintain balanced head-to-shoulder-to-torso proportion.
Avoid close-up portrait compression or beauty-camera framing.
Use enough camera distance to keep the body scale natural.
```

工程要求：

- 若 `ang=banshen`，不得再疊加 `magazine cover`、`fashion beauty`、`face-readable half-body`。
- 半身卡片若要保比例，應改為 `medium three-quarter portrait`。
- `face readable` 應改為 `identity readable without enlarging the head`。

---

### 18.7 失敗類型 F：品質詞讓模型往 CG / 角色概念圖走

高風險品質詞：

```text
concept art quality
character concept art
premium fantasy editorial realism
ultra realistic fantasy character
cinematic production quality
8K HDR
```

問題：

這類詞會提升畫面精緻度，但也會把真人變成角色圖。

替換方向：

```text
concept art quality
-> real-person photographic quality

character concept art
-> real photograph of the uploaded person inside a designed environment

premium fantasy editorial realism
-> natural cinematic realism with real-person identity fidelity

ultra realistic fantasy character
-> realistic environmental portrait of the uploaded person
```

`8K HDR` 是否保留需討論：

- 可保留在技術規格，但不能和 `concept art` 綁在一起。
- 若造成塑膠皮膚，可改為 `high-resolution natural photographic detail`。

---

### 18.8 新 Prompt 組裝優先順序

後續 `buildPrompt()` 的組裝順序應改成：

1. Reference photo gate
2. Real face priority / face identity lock
3. Anti beauty-template override
4. Anatomy and head-body proportion lock
5. Fantasy scope limitation：only environment / costume / props / lighting
6. Scene
7. Lighting
8. Real-person character context
9. Surface-only makeup
10. Costume
11. Identity-safe action
12. Identity-safe composition
13. Effects kept away from face
14. Tone
15. Real-person photographic quality
16. Specs
17. Final override：identity preservation wins

目前應避免讓 `quality`、`camera language`、`character context` 在後段反向污染前面的身份鎖。

---

### 18.9 需要立刻落地的修改項目

#### A. prompt_governance.js

新增：

- `BEAUTY_TEMPLATE_TERMS`
- `ARCHETYPE_FACE_TERMS`
- `EDITORIAL_FACE_TERMS`
- `ANGLE_IDENTITY_RISK_TERMS`
- `HEAD_SCALE_RISK_TERMS`
- `IDENTITY_SAFE_REPLACEMENTS`

並加入替換規則。

#### B. core.js

修改：

- `buildPrompt()` 前置更硬的 `REAL_FACE_PRIORITY`
- `quality` 欄位走 `sanitizeIdentitySafeQuality()`
- `camera language` 走 `sanitizeIdentitySafeCameraLanguage()`
- `composition` 走 `sanitizeHeadScaleRisk()`
- `makeup` 走 `sanitizeSurfaceMakeupOnly()`

#### C. 風格索引.json

新增：

```json
{
  "identity_risk_score": 0,
  "beauty_template_risk": "low | medium | high",
  "archetype_risk": "low | medium | high",
  "head_scale_risk": "low | medium | high",
  "angle_identity_risk": "low | medium | high",
  "rewrite_needed": false
}
```

#### D. audit_style_examples.mjs

新增輸出：

`docs/audit/身份污染風險報告_20260524.md`

掃描：

- editorial / magazine / concept art
- goddess / heroine / immortal / fantasy beauty
- sharp eyeliner / smoky eye / contour
- side profile / upward / over shoulder / low angle
- half-body + face-readable + fashion framing 組合

#### E. UI

新增提示：

```text
身份主權模式：開啟
幻想只作用於環境、服裝、道具與光線，不改真人五官。
```

卡片標籤新增：

```text
高美化風險
角色模板風險
角度換臉風險
大頭構圖風險
需身份改寫
```

---

### 18.10 立即替換表

| 高風險詞 | 建議替換 |
|---|---|
| fantasy beauty | real-person portrait in a fantasy environment |
| goddess aura | mythic atmosphere around the environment |
| immortal aesthetic | xianxia-inspired environment, not facial styling |
| magazine cover | natural environmental portrait photography |
| editorial realism | natural cinematic realism |
| concept art quality | real-person photographic quality |
| character concept art | real photograph of the uploaded person inside a designed environment |
| demon sovereign | real woman in dark supernatural royal styling |
| succubus woman | uploaded real person wearing dark supernatural costume styling |
| realistic everyday beauty | realistic natural skin appearance |
| sharp winged eyeliner | soft eyeliner color only, no eye-shape-changing liner |
| dark regal contour | surface-only shadow toning, no facial reshaping |
| blackened red smoky eyes | subtle dark red smoky makeup, surface-only |
| looking curious toward the side | gentle natural eye contact toward camera |
| looking upward | camera-level gaze with stable face orientation |
| half-body portrait from waist up | medium three-quarter portrait with balanced body proportion |
| face-readable half-body | identity-readable three-quarter portrait without enlarging the head |
| fashion beauty portrait | controlled real-person portrait photography |

---

### 18.11 新增判斷：Prompt 是否合格

一條 prompt 合格，不是看身份鎖文字有沒有出現，而是看後段有沒有反向污染。

檢查問題：

1. 是否仍有 fantasy beauty / goddess / heroine / immortal aesthetic？
2. 是否仍有 editorial / magazine cover / concept art quality？
3. 妝容是否可能改眼型、唇形、下巴、臉部輪廓？
4. 姿勢是否會讓臉轉到需要重建？
5. 構圖是否半身 + face-readable + fashion framing 導致大頭？
6. 品質詞是否把真人推向角色圖？
7. 最終語義是否仍是「真人在幻想環境」，不是「幻想角色套真人臉」？

若答案有任一高風險，該卡片應標：

```text
rewrite_needed: true
identity_risk_score: medium/high
```

---

### 18.12 本節結論

這批案例證明：

- identity lock 不是越長越好
- 後段污染詞如果太強，仍然會換臉
- editorial / magazine / concept art 是目前最大換臉來源之一
- beauty / makeup 詞會偷偷重建五官
- side / upward / over-shoulder 是高換臉角度
- half-body + face-readable + fashion framing 會造成大頭比例

接下來工程方向：

> 不是再堆更多保護詞，而是系統性降低風格污染權重，並把所有角色、妝容、鏡頭、品質詞改成身份安全語言。

---

## 19. 咒語分析補充：風格污染、隱形整型與身份壓制結構

日期：2026-05-24
狀態：補充到身份主權規範，作為 Phase 11-14 的 prompt 改寫依據。

---

### 19.1 核心判斷

這份分析指出一個很重要的問題：

> 寫了 identity lock 不代表模型真的會保留臉，因為後段風格詞可能正在召喚更強的臉部模板。

目前失敗的根本原因可以稱為：

```text
Style Contamination / 風格污染
```

也就是：

- 前面要求保留真人
- 後面卻用 fantasy / beauty / editorial / magazine / heroine / succubus / demon queen 等詞召喚模板臉
- 模型最後會把 reference photo 當素材，而不是當最高身份主權

所以後續不是單純增加更多 `preserve identity`，而是要讓整條 prompt 從語義上變成：

```text
真人身份主權 > 紀實攝影 > 穩定姿勢 > 幻想環境與服裝
```

---

### 19.2 核心問題 1：真人 vs 幻想模板的概念對抗

高風險寫法：

```text
[魅魔之吻．煉獄誘惑]
succubus
demon queen
fantasy empress
dark fantasy heroine
```

問題：

模型不是理解成「真人穿上魅魔服裝」，而是先召喚一個訓練資料中的「魅魔 / 魔后 / 女王」模板臉，再把 reference 特徵縫合上去。

常見結果：

- 骨相改變
- 下巴變尖
- 眼型拉長
- 鼻樑變窄
- 臉部變對稱
- 皮膚被美化
- 本人特徵被角色 archetype 稀釋

修正方向：

```text
[魅魔之吻．煉獄誘惑]
-> inspired by dark supernatural mythic atmosphere

succubus / demon queen
-> a real woman inside a dark supernatural environment

fantasy empress
-> the uploaded real person wearing fantasy-inspired royal costume styling
```

原則：

> 標題可以保留主題名，但輸出 prompt 時，人物描述必須改成 real person language。

---

### 19.3 核心問題 2：高級感詞彙會觸發隱形整型

高風險詞：

```text
magazine cover
editorial realism
premium fantasy editorial realism
high-end fashion portrait
premium drama character
model face
glamorous beauty
```

問題：

這些詞在模型訓練中常對應：

- 商業修圖
- 超模臉
- 完美皮膚
- 立體五官
- 精修下巴
- 更窄鼻樑
- 更大眼睛

所以即使 prompt 前面寫了 `preserve facial geometry`，後面的 `editorial / magazine / premium beauty` 仍可能讓模型自動進行隱形整型。

修正方向：

```text
magazine cover / editorial
-> natural environmental portrait photography

premium fantasy editorial realism
-> natural cinematic realism with real-person identity fidelity

premium drama character
-> natural period-drama environmental portrait realism

model face / glamorous beauty
-> authentic real-person appearance
```

工程要求：

- `prompt_governance.js` 要把 editorial / magazine / premium beauty 類詞列為高污染詞。
- `core.js` 的 camera language 不應輸出會強化商業美顏的 wording。
- `quality` 欄位要優先用 `real-person photographic quality`，避免 `character concept art quality`。

---

### 19.4 核心問題 3：動態透視會造成骨相重構

高風險姿勢：

```text
looking upwards thoughtfully
looking curious toward the side
dramatic side profile
over-the-shoulder turn-back pose
low-angle hero shot
forced-perspective hero shot
```

問題：

Reference photo 多半提供的是正面或接近正面的臉部資訊。當 prompt 要求仰頭、側臉、回眸、英雄仰拍時，模型必須自行腦補該角度的骨相。

腦補時最常套用：

- fantasy queen face angle
- xianxia heroine side face
- fashion model jawline
- AI beauty cheekbone

結果就是 identity drift。

修正方向：

```text
looking upwards thoughtfully
-> soft neutral gaze slightly above camera level

looking curious toward the side
-> gentle natural eye contact toward camera

dramatic side profile
-> mild three-quarter face angle with stable facial geometry

over-the-shoulder turn-back pose
-> mild body turn while face remains camera-level and structurally readable
```

新增硬規則：

```text
If a pose requires the model to invent a new facial angle not supported by the reference photo, reduce the pose intensity and keep the face near camera-level alignment.
```

---

### 19.5 核心問題 4：Beauty 詞必須全部轉成紀實詞

高風險詞：

```text
beauty
gorgeous
elegant face
model
perfect skin
flawless
pretty
porcelain skin
```

替換方向：

```text
beauty
-> real-person appearance

gorgeous / elegant face
-> authentic facial uniqueness

perfect skin / flawless
-> natural skin texture with real imperfections

model
-> real subject / uploaded person

porcelain skin
-> authentic human skin texture
```

核心原則：

> 所有會讓女生「變漂亮」的詞，都要改成讓她「保持真實」的詞。

---

### 19.6 身份壓制式 Prompt 結構

後續應建立一個比目前更明確的身份壓制段落。

建議作為所有 prompt 的固定前置：

```text
Identity & Face Priority Clause (CRITICAL):
The uploaded face identity overrides all style, costume, role, beauty, and cinematic directions.
Face identity priority over fantasy styling.
Do not beautify, reshape, slim, sharpen, lift, smooth, redesign, reconstruct, idealize, or reinterpret the facial structure, eye shape, nose geometry, mouth shape, jawline, cheek volume, forehead height, or skin age detail.
The output must feel like a documentary-real photograph of this exact uploaded person inside a designed fantasy environment, not a generated fantasy character based on the reference photo.
```

這段應放在：

1. scene 前
2. character context 前
3. makeup 前
4. camera / quality 前

原因：

身份壓制必須在所有風格方向前面先建立主權。

---

### 19.7 優化後的安全結構範例

建議新 prompt 結構：

```text
Identity & Face Priority Clause (CRITICAL):
The uploaded face identity overrides all style, costume, role, beauty, and cinematic directions. Face identity priority over fantasy styling. Do not beautify, reshape, slim, sharpen, lift, smooth, redesign, reconstruct, idealize, or reinterpret the face. The output must feel like a documentary-real photograph of this exact real person inside a designed fantasy environment, not a generated fantasy character.

Scene:
surreal field of floating dark glass spheres reflecting fragments of a dark cloudy sky, soft natural daylight.

Character Context:
a real woman inside a dark supernatural mythic environment.

Makeup & Skin:
no beauty enhancement filters, realistic natural skin appearance, subtle everyday surface cosmetics only, no alteration to eye shape, lip shape, jawline, cheek structure, or bone geometry.

Costume:
abstract layered black organza dress, small dark wings behind the back, costume styling only.

Action & Pose:
standing with relaxed body alignment, calm shoulder line, soft neutral gaze near camera level, maintaining stable face-neck-shoulder continuity.

Camera & Framing:
natural environmental portrait photography, simulated 50mm lens, realistic human head-to-body proportions, zero forced perspective, enough camera distance to prevent oversized head.

Tone & Render:
natural cinematic realism, authentic photo-realistic textures, real-person photographic quality.
```

---

### 19.8 修改對照表

| 原高風險詞彙 | 建議替換詞彙 | 修正目的 |
|---|---|---|
| `[魅魔之吻．煉獄誘惑]` / `succubus` | inspired by dark supernatural mythic atmosphere | 移除角色長相模板，只保留環境氣氛 |
| demon queen | real woman inside a dark supernatural environment | 避免女王模板臉 |
| Magazine cover | natural environmental portrait photography | 避免商業精修與封面大頭 |
| editorial realism | natural cinematic realism | 降低模特臉與修圖感 |
| premium fantasy editorial realism | natural cinematic realism with real-person identity fidelity | 防止幻想大片壓過真人 |
| looking upwards thoughtfully | soft neutral gaze slightly above camera level | 降低仰角骨相重構 |
| looking curious toward the side | gentle natural eye contact toward camera | 避免側臉腦補 |
| realistic everyday beauty | authentic human skin texture with natural imperfections | 移除 beauty token |
| perfect skin | natural skin texture with real imperfections | 保留真人皮膚 |
| model face | authentic real-person appearance | 防止模板臉 |
| concept art quality | real-person photographic quality | 避免角色概念圖化 |

---

### 19.9 對 Phase 11-14 的補充要求

#### Phase 11 身份污染掃描要新增分類

新增掃描類別：

- `style_contamination_risk`
- `editorial_beauty_risk`
- `archetype_face_risk`
- `dynamic_angle_identity_risk`
- `beauty_token_risk`
- `commercial_retouch_risk`

#### Phase 12 索引欄位補充

`風格索引.json` 建議加入：

```json
{
  "style_contamination_risk": "low | medium | high",
  "editorial_beauty_risk": "low | medium | high",
  "archetype_face_risk": "low | medium | high",
  "dynamic_angle_identity_risk": "low | medium | high",
  "identity_priority_clause_required": true,
  "safe_prompt_rewrite": ""
}
```

#### Phase 13 高風險卡片改寫優先順序

優先改：

1. 魅魔 / 魔王 / 墮天使
2. 仙俠 / 古偶 / 神女
3. 西方魔幻 / 女神 / 聖堂
4. 婚紗 / 女王 / 時尚大片
5. 所有含 editorial / magazine / concept art / beauty 的卡片

#### Phase 14 Prompt 生成器更新

`buildPrompt()` 必須確保：

- identity priority clause 永遠在最前面
- `character context` 永遠使用 real person language
- `makeup` 永遠 surface-only
- `camera language` 不召喚 magazine / model face
- `quality` 不召喚 concept art / fantasy character
- `pose` 不要求模型重建臉部角度

---

### 19.10 最終結論

這份分析再次確認：

> 問題不是 identity lock 不夠長，而是後段風格污染太強。

後續所有 prompt 改造要抓住一個核心：

```text
不是讓真人變成更漂亮的角色。
而是讓真人保持原樣，進入一個更有設計感的世界。
```

---

## 20. 防變臉與防大頭責任分層：規範、母庫、索引、程式、UI 各自怎麼處理

日期：2026-05-24
狀態：待 AI 們討論確認；最終工程修改由 Codex 負責執行。

---

### 20.1 核心結論

避免變臉和大頭不能只靠某一層處理。

正確做法是分成五層：

```text
核心咒語規範.md
  = 定義不可違反的身份主權規則

風格範例.md
  = 母庫內容本身要避免高污染詞與大頭構圖詞

風格索引.json
  = 為每張卡片標記身份風險、構圖風險、是否需改寫

prompt_governance.js / core.js
  = 程式強制清洗、替換、降權、前置身份鎖

UI
  = 顯示身份主權模式與風險標籤，避免使用者誤選高風險設定
```

一句話：

> 規範定義原則，母庫修正內容，索引標記風險，程式強制執行，UI 告訴使用者目前正在保護身份。

---

### 20.2 核心咒語規範.md 要處理什麼

`核心咒語規範.md` 是最高層規則，不負責存每張卡片，但要定義所有卡片與程式都必須遵守的紅線。

必須新增或強化：

#### A. 身份主權規則

要明確寫入：

```text
Identity priority over aesthetics.
Reference face fidelity is more important than fantasy styling, cinematic style, beauty styling, costume elegance, or genre atmosphere.
The uploaded face must remain structurally unchanged.
```

#### B. 幻想元素作用範圍

規範必須明確：

```text
Fantasy styling may affect environment, costume, props, lighting, atmosphere, and color palette only.
Fantasy styling must not affect facial geometry, eye shape, nose shape, mouth structure, jawline, cheek volume, skin age detail, or recognizable likeness.
```

#### C. 禁用 / 降權詞類

規範應列出高風險詞類：

- beauty 類：`beautiful`, `gorgeous`, `flawless`, `perfect skin`, `model face`
- 角色模板類：`fantasy queen`, `demon queen`, `succubus woman`, `xianxia heroine`, `goddess face`
- editorial 類：`magazine cover`, `editorial realism`, `concept art quality`, `premium character`
- 角度類：`looking upward`, `side profile`, `over-the-shoulder`, `low-angle hero shot`
- 大頭構圖類：`close-up beauty portrait`, `face-readable half-body`, `upper costume details`, `fashion beauty framing`

#### D. 合格 prompt 判斷標準

規範要從「有沒有寫 identity lock」改成：

```text
後段風格詞不得反向污染身份鎖。
```

也就是檢查：

- 是否仍會召喚模板臉
- 是否仍會讓模型美化五官
- 是否仍會讓模型腦補側臉或仰角
- 是否仍會讓頭部在畫面中過大

Codex 後續負責：

- 修改 `核心資料/核心咒語規範.md`
- 加入「身份主權 Prompt 規範」章節
- 加入高風險詞與替換原則

---

### 20.3 風格範例.md 要處理什麼

`風格範例.md` 是母庫，問題不能只靠程式最後清洗。因為如果母庫本身充滿高污染詞，程式會一直在救火。

母庫要做的是：

#### A. 卡片文字改成真人進入世界

錯誤方向：

```text
fantasy queen
succubus woman
demon sovereign
xianxia heroine
```

正確方向：

```text
the uploaded real person inside a dark supernatural environment
a real-person environmental portrait in a xianxia-inspired setting
the uploaded person wearing fantasy-inspired royal costume styling
```

#### B. 妝容欄位改成 surface-only

錯誤方向：

```text
sharp winged eyeliner
dark regal contour
perfect skin
immortal beauty makeup
```

正確方向：

```text
surface-only makeup, color and texture only, no eye-shape enhancement, no contouring that changes cheekbone or jawline, preserve natural skin detail
```

#### C. 構圖欄位避免大頭組合

錯誤組合：

```text
half-body portrait + face-readable + upper costume details + magazine cover
```

正確方向：

```text
medium three-quarter portrait, enough camera distance, balanced head-to-shoulder-to-torso proportion, identity readable without enlarging the head
```

#### D. 品質欄位改成真人攝影

錯誤方向：

```text
concept art quality
premium fantasy editorial realism
ultra realistic fantasy character
```

正確方向：

```text
real-person photographic quality, natural cinematic realism, authentic skin texture, documentary-real portrait fidelity
```

Codex 後續負責：

- 不會一次重排整份母庫
- 先由 audit 找出高風險卡片
- 先改高風險主題：魅魔、魔王、墮天使、魔幻、仙俠、婚紗
- 修改時保留原卡片 ID，不破壞索引

---

### 20.4 風格索引.json 要處理什麼

`風格索引.json` 不直接產生 prompt，但它要負責標記哪張卡片風險高、是否進 UI、是否要改寫。

建議新增欄位：

```json
{
  "identity_mode": "identity_sovereign",
  "fantasy_scope": ["environment", "costume", "props", "lighting"],
  "face_scope": "preserve_only",
  "identity_risk_score": 0,
  "beauty_template_risk": "low",
  "archetype_face_risk": "low",
  "editorial_beauty_risk": "low",
  "dynamic_angle_identity_risk": "low",
  "head_scale_risk": "low",
  "style_contamination_risk": "low",
  "rewrite_needed": false
}
```

用途：

- UI 可隱藏高風險卡
- audit 可列出需改寫清單
- build script 可只輸出安全卡
- 高風險卡即使在母庫中，也不直接進主 UI

Codex 後續負責：

- 建立或更新 `核心資料/風格索引.json`
- 讓每張卡都有風險欄位
- 先保守標記，不確定就 `review` 或 `rewrite_needed: true`

---

### 20.5 prompt_governance.js 要處理什麼

`prompt_governance.js` 應是「風格污染攔截器」。

它要處理：

#### A. 高污染詞掃描

新增詞表：

```text
BEAUTY_TEMPLATE_TERMS
ARCHETYPE_FACE_TERMS
EDITORIAL_FACE_TERMS
ANGLE_IDENTITY_RISK_TERMS
HEAD_SCALE_RISK_TERMS
```

#### B. 替換表

例如：

```text
fantasy beauty -> real-person portrait in a fantasy environment
magazine cover -> natural environmental portrait photography
concept art quality -> real-person photographic quality
succubus woman -> uploaded real person wearing dark supernatural costume styling
looking upward -> camera-level gaze with stable face orientation
half-body portrait from waist up -> medium three-quarter portrait with balanced body proportion
```

#### C. 風險分數

每條卡片或 prompt 可以計算：

- identity risk score
- beauty risk
- angle risk
- head scale risk

#### D. 生成 audit 報告

輸出：

`docs/audit/身份污染風險報告_20260524.md`

Codex 後續負責：

- 修改 `prompt_governance.js`
- 加入身份污染掃描與替換
- 加入報告輸出

---

### 20.6 core.js 要處理什麼

`core.js` 是最後一道保險，負責實際生成 prompt。

必須確保：

#### A. 身份主權段落永遠最前面

`buildPrompt()` 的第一段應是：

```text
Identity & Face Priority Clause (CRITICAL):
The uploaded face identity overrides all style, costume, role, beauty, and cinematic directions...
```

不可讓 scene、character、makeup、quality 出現在身份主權前面。

#### B. 每個欄位輸出前都要 sanitize

建議新增：

```js
sanitizeIdentitySafeCharacterContext()
sanitizeSurfaceMakeupOnly()
sanitizeIdentitySafeCameraLanguage()
sanitizeIdentitySafeQuality()
sanitizeHeadScaleRisk()
sanitizeAngleIdentityRisk()
sanitizeStyleContamination()
```

#### C. 防大頭規則要硬插入

當角度是半身、近景、時尚、人像時，必須加入：

```text
Head must not dominate the frame.
Maintain balanced head-to-shoulder-to-torso proportion.
Use enough camera distance to keep body scale natural.
Avoid close-up beauty-camera framing.
```

#### D. 若風格與身份衝突，身份勝出

最後再加 override：

```text
If any style, camera, makeup, costume, or role instruction conflicts with identity preservation, ignore that style instruction and preserve the uploaded person's real face.
```

Codex 後續負責：

- 修改 `core.js buildPrompt()`
- 加入欄位級 sanitize
- 確保輸出 prompt 不再把高污染詞原樣送出
- 保持現有 UI 功能不壞

---

### 20.7 UI 要處理什麼

UI 不是主要治理層，但要讓使用者知道目前工具正在做身份保護。

建議 UI 加：

#### A. 身份主權模式提示

```text
身份主權模式：開啟
幻想只作用於環境、服裝、道具與光線，不改真人五官。
```

#### B. 卡片風險標籤

```text
高美化風險
角色模板風險
角度換臉風險
大頭構圖風險
需身份改寫
```

#### C. 不提供關閉身份保護的主開關

原因：

這個工具的核心價值是真人鎖臉，關掉等於破壞產品定位。

#### D. 高風險卡片預設不進主 UI

`review`、`duplicate`、`rewrite_needed` 卡片不進主 UI，除非使用者切到待審模式。

Codex 後續負責：

- UI 增加身份主權提示
- UI 卡片顯示風險標籤
- UI 根據索引狀態決定是否顯示

---

### 20.8 哪些問題在哪裡處理：責任表

| 問題 | 核心咒語規範.md | 風格範例.md | 風格索引.json | prompt_governance.js | core.js | UI |
|---|---|---|---|---|---|---|
| 變臉 | 定義身份主權紅線 | 移除模板臉詞 | 標 identity risk | 掃描與替換污染詞 | 前置身份鎖與 sanitize | 顯示風險 |
| 古偶 / 女王模板臉 | 禁用 archetype face | 改成 real person language | 標 archetype risk | 替換 fantasy queen / heroine | 改 character context | 標角色模板風險 |
| beauty 隱形整型 | 禁 beauty 重建臉 | 妝容改 surface-only | 標 beauty risk | 替換 beauty 詞 | sanitize makeup | 標高美化風險 |
| editorial / magazine 換臉 | 降權規定 | quality / camera 改寫 | 標 editorial risk | 替換 editorial 詞 | sanitize camera / quality | 不顯示高風險語言 |
| 側臉 / 仰頭換臉 | 定義角度紅線 | 動作欄改安全角度 | 標 angle risk | 掃描 angle 詞 | sanitize pose / angle | 角度風險提示 |
| 大頭 | 定義比例規則 | 構圖欄改 medium 3/4 | 標 head scale risk | 掃描 half-body 組合 | 強插比例句 | 顯示大頭風險 |
| 待審資料污染 UI | 定義進 UI 規則 | 保留母庫不刪 | ui_status 控制 | audit 檢查 | build 時只取允許狀態 | 隱藏 review |

---

### 20.9 最終 Codex 修改順序建議

等本節討論通過後，Codex 應依序執行：

1. 更新 `核心資料/核心咒語規範.md`
   - 加入身份主權章節
   - 加入防變臉 / 防大頭規則

2. 更新 `prompt_governance.js`
   - 加入污染詞表、替換表、風險分數

3. 更新 audit 腳本
   - 產出身份污染風險報告

4. 更新 `風格索引.json`
   - 補身份風險欄位
   - 標記高風險卡片

5. 更新 `core.js`
   - `buildPrompt()` 前置身份主權段落
   - 所有欄位輸出前 sanitize
   - 半身 / 時尚 / 近景時強制防大頭

6. 更新 UI
   - 身份主權模式提示
   - 風險標籤
   - 隱藏 review / duplicate / rewrite_needed

7. 最後才回頭整理 `風格範例.md`
   - 先改高風險卡片
   - 不一次重排全文

---

### 20.10 本節結論

防變臉與防大頭要多層處理：

- `核心咒語規範.md` 負責定義規則
- `風格範例.md` 負責讓資料本身不要污染
- `風格索引.json` 負責標記風險與 UI 狀態
- `prompt_governance.js` 負責掃描與替換
- `core.js` 負責最後強制輸出安全 prompt
- `UI` 負責顯示保護狀態與風險標籤

最終工程修改由 Codex 負責完成，但在動手前，請 AI 們先確認本責任分層是否同意。

---

## 21. 第二輪身分安全修正：降低「正向商業美化詞」權重

日期：2026-05-24
狀態：已由 Codex 實作並上架，commit：`11344bd fix: downgrade commercial travel prompt contamination`

---

### 21.1 最新核心判斷

本輪討論再次確認一件事：

> 問題不是 identity lock 寫得不夠多，而是後段仍有高權重商業美化攝影語言在覆蓋 identity lock。

AI 不是完全不聽「不要改臉」，而是在看到大量正向美化詞後，自動啟動商業人像 / 旅拍美女 / AI 精修臉模板。

因此後續 prompt 治理重點不能只是不斷增加：

```text
do not change face
preserve identity
no beauty template
```

而是必須同步降低或移除會觸發美化模板的正向詞。

---

### 21.2 本次發現的高危污染詞

以下詞彙在模型中容易和商業人像、精修臉、AI 美女模板綁定，會造成微變臉：

```text
cinematic
cinematic glow makeup
glow makeup
magazine cover
editorial
premium
premium world travel
premium travel editorial
fashion
camera-ready
HDR
8K HDR
ultra realistic
softly defined brows and lashes
defined brows
defined lashes
healthy peach or rose lip
vivid colors
crisp clean air
environmental portrait
```

這些詞常見副作用：

- 眼睛變圓或變亮
- 眼白變乾淨
- 鼻樑變細或變直
- 嘴唇變柔、變飽滿
- 法令紋、皮膚紋理被淡化
- 皮膚變平滑
- 臉部比例更標準化

也就是俗稱的「隱形整型」。

---

### 21.3 特別案例：倫敦大笨鐘旅拍 `v027_eu_16`

原輸出中最危險的片段包括：

```text
outdoor cinematic glow makeup
Camera language: 雜誌封面
ultra realistic premium world travel cinematic realism
camera-ready but realistic
softly defined brows and lashes
8K HDR
crisp clean air
vivid colors
```

雖然 prompt 前面已經有身分主權與 anti-beauty-template，但這些正向美化詞仍會把模型拉回：

```text
高級旅拍美女
商業修圖
editorial face optimization
AI beauty reconstruction
```

正確方向應改成：

```text
real tourist documentary photography
real travel snapshot
documentary travel photo realism
minimal real outdoor travel makeup
natural untouched eyebrows and eyelashes
natural lip color matching the reference person
natural dynamic range
unretouched facial detail
true-to-life location color
```

---

### 21.4 新替換原則

後續所有旅拍、地標、生活照、自然照 prompt 都應採用以下替換：

| 高風險詞 | 建議替換 | 原因 |
|---|---|---|
| magazine cover | real tourist documentary photography | 避免封面精修臉 |
| editorial / travel editorial | documentary travel photography | 避免商業大片臉 |
| cinematic glow makeup | minimal real outdoor travel makeup | 避免柔膚、亮眼、修鼻樑 |
| camera-ready | unretouched | 避免商業上鏡修圖 |
| softly defined brows and lashes | natural untouched eyebrows and eyelashes | 避免重建眉眼 |
| healthy peach / coral lip | natural lip color matching the reference person | 避免改嘴型與唇色模板 |
| premium | natural / documentary | 避免高級感自動修臉 |
| ultra realistic | realistic | 降低 AI 銳化與皮膚重建 |
| 8K HDR / HDR | natural dynamic range | 避免過度銳化與皮膚光滑化 |
| vivid colors / crisp clean air | true-to-life location color / clean natural visibility | 避免廣告感與高飽和商業片 |
| fashion | clothing | 避免時尚模特臉 |
| environmental portrait | documentary location photo | 避免人像攝影模板 |

---

### 21.5 Makeup 欄位新規則

Makeup 欄位不能只寫「surface-only」，還要避免在前半句先觸發美化模板。

不建議：

```text
outdoor cinematic glow makeup
camera-ready travel-photo finish
softly defined brows and lashes
healthy peach lip
```

建議：

```text
minimal real outdoor travel makeup:
real skin texture,
natural daylight highlights,
natural untouched eyebrows and eyelashes,
natural lip color matching the reference person,
unretouched realistic travel-photo finish
```

並保留尾段：

```text
Makeup is minimal and documentary-real; it affects color, texture, and surface finish only; no beauty retouching, no glamour makeup, no contouring, no eye-shape enhancement, no brow reshaping, no lash enhancement, no lip reshaping, no jaw or cheekbone reconstruction.
```

---

### 21.6 Camera / Quality 欄位新規則

Camera language 不應再使用：

```text
雜誌封面
時尚大片
magazine cover
fashion editorial
cinematic portrait
```

改用：

```text
旅客紀錄照
紀實造型照
自然生活照
real tourist documentary photography
casual real-person snapshot
documentary location photo
```

Quality 不應再使用：

```text
ultra realistic premium world travel editorial realism, 8K HDR
```

改用：

```text
realistic documentary world travel photo realism,
natural dynamic range,
authentic skin texture,
unretouched facial detail,
documentary-real identity fidelity
```

---

### 21.7 工程落地狀態

Codex 已完成以下修改：

- `core.js`
  - 降低核心輸出中的 cinematic / premium / editorial / magazine / HDR / fashion 語言
  - 旅拍鏡頭語言改成 `旅客紀錄照`
  - Makeup 改成 minimal real travel makeup
  - Quality 改成 documentary travel photo realism + natural dynamic range + unretouched facial detail
  - `environmental portrait` 改成 `documentary location photo`

- `prompt_governance.js`
  - 增加第二輪替換表
  - 把 commercial travel prompt contamination 納入治理

- `scripts/verify_identity_engine.mjs`
  - 新增 `londonTravel` 測試案例：`theme_12 / v027_eu_16`
  - 檢查禁止詞不再出現在最終 prompt
  - 驗證器改成 fail-fast：任一檢查 false 會直接失敗

上架 commit：

```text
11344bd fix: downgrade commercial travel prompt contamination
```

驗證結果：

```text
npm.cmd test      PASS
npm.cmd run lint  PASS
npm.cmd run build PASS
```

---

### 21.8 後續規則

後續所有 AI 或人工新增卡片時，必須遵守：

1. 不要再靠「增加更多 anti-beauty clause」解決變臉。
2. 先檢查正向風格詞是否正在觸發商業美化。
3. 旅拍、地標、日常、生活類一律優先使用 documentary / snapshot / tourist photo 語言。
4. 女性人像中避免 `cinematic + glow + makeup` 同時出現。
5. `premium / editorial / magazine / fashion / HDR / camera-ready` 默認視為 identity drift 風險詞。
6. 如果 prompt 目標是「本人進入場景」，文字應描述場景、衣服、動作、光線，不描述更漂亮的臉。

最終核心句：

```text
不是讓真人變成更漂亮的旅拍角色。
而是讓真人以原本的臉，出現在一張真實旅客紀錄照裡。
```

---

## 22. 第三輪身分安全修正：刪除幻想美女 archetype，而不是再加鎖臉

日期：2026-05-24
狀態：已由 Codex 實作並上架，commit：`42f06ca fix: suppress fantasy beauty archetype prompts`

---

### 22.1 最新核心判斷

本輪案例是：

```text
聖堂與暗黑．西方魔幻 — 自然之靈 · 森林鹿女
```

這個案例證明，即使旅拍商業詞已經降權，魔幻 / 森林 / 花草類 prompt 仍可能被另一種污染源影響：

> 幻想美女 archetype。

問題不是缺更多 `identity lock`，而是 prompt 裡仍有會召喚「花仙女主臉 / fantasy heroine face / 精靈大眼臉」的正向詞。

---

### 22.2 本次發現的高危 archetype 詞

以下詞在模型中容易觸發幻想女性模板臉：

```text
flower fairy
fairy makeup
luminous pastel eye shimmer
luminous
romantic fantasy freshness
delicate botanical glow
botanical glow
fantasy freshness
premium cinematic
cinematic travel photoshoot
photoshoot
high-end
photographic polish
professional travel photography
```

典型副作用：

- 眼睛變大或更亮
- 眼白變乾淨
- 鼻樑變細
- 下巴變順
- 法令紋與皮膚細節消失
- 臉型更對稱
- 真人變成「像本人但更仙、更乾淨」的 fantasy 版本

---

### 22.3 最大結構錯誤

原 prompt 結構是：

```text
IDENTITY LOCK
ANTI BEAUTY
大量 fantasy 美學詞
cinematic
premium
magazine
photoshoot
flower fairy
luminous
romantic fantasy freshness
photographic polish
```

這會讓模型折衷成：

```text
保留一點本人特徵
但偷偷優化成 fantasy 漂亮版
```

因此關鍵修正不是：

```text
再加更多 no reshape / no beauty / preserve face
```

而是：

```text
刪除幻想美女 archetype 的正向觸發詞
```

---

### 22.4 新替換原則

| 高風險詞 | 建議替換 | 原因 |
|---|---|---|
| flower fairy makeup | minimal botanical makeup | 避免召喚花仙女主臉 |
| flower fairy | botanical environment styling | 把幻想元素放回環境，不放到臉 |
| luminous pastel eye shimmer | subtle botanical surface color around the eyes, no fantasy-eye styling | 避免放大眼睛、亮眼白 |
| delicate botanical glow | subtle botanical color tint | 避免 glow 觸發柔焦美顏 |
| romantic fantasy freshness | ordinary real-person forest snapshot naturalness | 避免年輕化、清透化 |
| photoshoot | snapshot | 避免商業攝影臉 |
| photographic polish | photographic realism | 避免高級修圖 |
| high-end | plain | 避免商業精修感 |
| professional travel photography | ordinary documentary travel photography | 避免專業旅拍臉 |

---

### 22.5 新核心錨點

後續森林、魔法、花仙、鹿女、精靈、妖精、自然之靈類 prompt，必須加入這個方向：

```text
a real person accidentally photographed inside a fantasy environment
```

也就是：

```text
真人誤入幻想環境
```

而不是：

```text
幻想角色生成真人臉
```

核心差異：

- 幻想元素作用於森林、建築、道具、服裝材質、光線
- 不作用於臉
- 不把真人變成 fairy / goddess / heroine / elf / doll face

---

### 22.6 Makeup 欄位新規則

不建議：

```text
flower fairy makeup:
soft petal blush,
luminous pastel eye shimmer,
floral pink or peach lip,
delicate botanical glow,
romantic fantasy freshness
```

建議：

```text
minimal botanical makeup:
soft petal blush as surface color only,
subtle botanical surface color around the eyes with no fantasy-eye styling,
natural lip color matching the reference person,
ordinary real-person forest snapshot naturalness
```

尾段必須保留：

```text
Makeup is minimal and documentary-real; it affects color, texture, and surface finish only; no beauty retouching, no glamour makeup, no contouring, no eye-shape enhancement, no brow reshaping, no lash enhancement, no lip reshaping, no jaw or cheekbone reconstruction.
```

---

### 22.7 工程落地狀態

Codex 已完成以下修改：

- `core.js`
  - 新增 `REAL-PERSON-IN-FANTASY RULE`
  - `flower_fairy` 妝容改成 `minimal botanical makeup`
  - 清洗 `luminous pastel eye shimmer`、`romantic fantasy freshness`、`botanical glow`
  - 清洗 `photoshoot`、`photographic polish`、`high-end`、`professional travel photography`

- `prompt_governance.js`
  - 增加 fantasy archetype 污染替換表

- `scripts/verify_identity_engine.mjs`
  - 新增 `forestSpirit` 測試案例：`theme_13 / mh_25`
  - 驗證禁止詞不再出現在最終 prompt
  - 新增 441 筆 UI 可見卡片的最終 prompt 全庫掃描
  - 驗證輸出包含：

```text
real person accidentally photographed inside a fantasy environment
minimal botanical makeup
no fantasy-eye styling
unretouched facial detail
```

驗證結果：

```text
npm.cmd test      PASS
npm.cmd run lint  PASS
npm.cmd run build PASS
```

---

### 22.8 後續規則

後續所有 fantasy / forest / fairy / spirit / goddess / elf / deer-girl 類卡片，都必須先問：

1. 這個詞是在描述環境，還是在描述一張更漂亮的臉？
2. 是否出現 `fairy / goddess / heroine / luminous / glow / freshness / photoshoot / polish`？
3. 如果拿掉 fantasy archetype，畫面還能成立嗎？
4. 真人是否仍像是本人「進入」幻想環境，而不是被幻想角色模板覆蓋？

最終核心句：

```text
不是讓真人變成花仙女。
而是讓真人以原本的臉，被拍到坐在一個像花仙世界的森林裡。
```

---

## 23. Codex 後續改善建議：從「詞表治理」升級成「語義治理」

日期：2026-05-24
狀態：Codex 建議，待後續排程

---

### 23.1 核心判斷

目前已經完成三層重要修正：

1. 身份主權前置
2. 商業旅拍 / editorial / premium 類詞降權
3. fantasy beauty archetype 類詞降權
4. 441 筆 UI 可見 prompt 全庫掃描

但我認為下一階段還可以再往前推一步：

> 不只掃固定詞，而是判斷一段文字是否在「描述更漂亮的臉」。

現在的治理仍偏詞表式：

```text
看到 magazine / premium / luminous / flower fairy 就替換
```

下一步應該升級成語義式：

```text
即使沒有命中固定詞，只要語義是在召喚美女模板、商業修圖、幻想女主臉，也應標風險。
```

---

### 23.2 建議一：建立 Prompt Risk Classifier

建議新增：

```text
scripts/classify_prompt_risk.mjs
```

用途：

- 對每張卡片最終 prompt 做語義分段
- 分析每段是否偏向：
  - identity-safe
  - commercial-beauty
  - fantasy-archetype
  - makeup-restructure
  - camera-head-scale
  - pose-angle-drift
  - quality-retouch

輸出建議：

```json
{
  "entry_id": "mh_25",
  "risk_score": 6,
  "risk_type": ["fantasy_archetype", "makeup_restructure"],
  "risky_segments": [
    {
      "segment": "Makeup & skin",
      "reason": "describes fantasy-eye styling rather than surface-only color"
    }
  ],
  "rewrite_needed": true
}
```

這會比單純 regex 更能抓到新變體。

---

### 23.3 建議二：建立分段輸出驗證，而不是只掃整段 prompt

目前 `verify_identity_engine.mjs` 已掃 441 筆最終 prompt，但仍是整段掃描。

建議改成把 prompt 分段：

```text
Identity block
Character behavior
Camera design
Scene
Makeup & skin
Costume
Action and props
Composition
Effects
Tone
Quality
Format
```

每段有不同禁詞與規則。

例如：

- `Scene` 可以有 `fantasy forest`
- `Makeup & skin` 不可以有 `fantasy-eye styling`
- `Costume` 可以有 `queen-inspired dress`
- `Character context` 不可以有 `queen face`
- `Quality` 不可以有 `polish / HDR / premium`

原因：

同一個詞在不同段落風險不同。  
例如 `fantasy` 出現在 scene 可以，出現在 face / makeup 就危險。

---

### 23.4 建議三：把「允許詞作用範圍」做成資料結構

建議新增一份規則：

```text
scripts/lib/prompt_scope_rules.mjs
```

概念：

```js
{
  fantasy: {
    allowedIn: ["scene", "costume", "props", "lighting", "effects"],
    forbiddenIn: ["face", "makeup", "skin", "character_context"]
  },
  glow: {
    allowedIn: ["lighting", "effects"],
    forbiddenIn: ["skin", "makeup", "face"]
  },
  queen: {
    allowedIn: ["title", "costume", "props", "architecture"],
    forbiddenIn: ["face", "makeup", "character_context"]
  }
}
```

這樣可以避免過度刪詞，也能更精準保留世界觀。

---

### 23.5 建議四：建立「安全 rewrite preview」

目前 sanitize 是直接替換。

建議新增：

```text
npm run preview:identity-rewrite
```

功能：

- 顯示替換前 / 替換後
- 標出為什麼替換
- 讓人快速審查是否把世界觀刪太乾淨

範例：

```text
Before:
flower fairy makeup: luminous pastel eye shimmer

After:
minimal botanical makeup: subtle botanical surface color around the eyes, no fantasy-eye styling

Reason:
fantasy archetype + eye-shape drift risk
```

這對後續人工調整很重要，因為我們不想把所有風格都洗成無聊白開水。

---

### 23.6 建議五：把風格分成「臉外風格」與「臉內風格」

我建議後續每張卡片新增兩類欄位：

```json
{
  "external_style": {
    "environment": "...",
    "costume": "...",
    "props": "...",
    "lighting": "...",
    "effects": "..."
  },
  "face_safe_style": {
    "makeup_color": "...",
    "skin_policy": "unretouched",
    "eye_policy": "original shape only",
    "lip_policy": "original shape only"
  }
}
```

這樣 prompt builder 可以從結構上避免：

```text
fantasy style accidentally leaking into face description
```

目前我們是靠 sanitize 補救；長期應該靠資料結構防止污染。

---

### 23.7 建議六：建立反例測試集

目前已經有：

- `londonTravel`
- `forestSpirit`

建議再加入至少 8 個反例測試：

1. 婚紗 / 女王婚紗：避免 bridal beauty / luxury face
2. 仙俠 / 白衣仙子：避免 xianxia heroine face
3. 魔王 / 女王：避免 demon queen face template
4. 墮天使：避免 goddess / angelic perfect face
5. 古裝宮廷：避免 court beauty face
6. 動漫角色：避免 cosplay doll face
7. 現代名媛：避免 influencer / socialite face
8. 山海大景：避免 epic wide + tiny subject + identity unreadable

每個案例都應測：

```text
no commercial retouch token
no archetype face token
no makeup restructure token
no unsafe camera/head-scale token
identity documentary anchor present
```

---

### 23.8 建議七：UI 顯示「為什麼安全」

目前 UI 顯示風險標籤，下一步可以顯示更具體的安全摘要：

```text
身份安全：已降權商業美化詞
妝容安全：只保留表面顏色，不改眼型
鏡頭安全：50mm / 無封面近景 / 無大頭壓縮
幻想範圍：環境、服裝、道具、光線
```

用途：

- 讓使用者知道工具正在保護什麼
- 也幫助未來 debugging，知道是哪一層在生效

---

### 23.9 建議八：建立「世界觀保留度」檢查

目前我們一直在刪污染詞，但要注意另一個風險：

> 清洗過度，導致風格變淡。

因此建議新增一個反向指標：

```text
worldbuilding_retention_score
```

判斷 prompt 是否仍保留：

- 地點
- 服裝材質
- 道具
- 光線
- 色彩
- 動作敘事
- 場景氣氛

目標不是把 prompt 變成無聊的證件照，而是：

```text
臉保持本人，世界仍然有戲。
```

---

### 23.10 建議優先順序

我建議下一步排序：

1. 分段輸出驗證
2. 反例測試集擴充
3. prompt scope rules
4. rewrite preview
5. Prompt Risk Classifier
6. UI 安全摘要
7. face-safe / external-style 資料結構拆分
8. worldbuilding retention score

原因：

- 1-3 可以最快防止回歸
- 4-5 提高治理效率
- 6 改善使用者理解
- 7-8 是長期架構升級

---

### 23.11 Codex 的總結

目前系統已經從：

```text
多寫 identity lock
```

進化到：

```text
降低商業美化詞
刪除幻想美女 archetype
全庫掃描最終 prompt
```

下一步應該再進化到：

```text
分段語義治理
明確限制每種風格詞的作用範圍
在保臉的同時保留世界觀張力
```

最終產品目標：

```text
真人臉不漂，世界觀不淡。
```

---

## 24. 第四輪執行：10-tier Identity-Safe Prompt Governance 落地

日期：2026-05-24
狀態：Codex 已實作，待上架

---

### 24.1 本輪目標

依照待執行核心工作，完成四件事：

1. 更新 `核心資料/核心咒語規範.md`
2. 重構 prompt governance 與 `buildPrompt()`
3. 清洗母庫中高風險風格範例
4. 建立並執行 20 組 prompt-level 身分風險驗證

---

### 24.2 核心規範更新

`核心資料/核心咒語規範.md` 已升級到 v1.7。

新增重點：

- `TIERED IDENTITY-SAFE SANITIZE PIPELINE`
- `PROMPT SCOPE RULES`
- 明確定義 face-internal / face-safe makeup / face-external 三種作用範圍
- 明確規定 cinematic / editorial / fashion / premium / luxury / goddess / queen / fairy / anime / game 等詞只能在通過 sanitize 後作為臉外風格

核心結論：

```text
幻想可以進世界觀。
美學可以進服裝、場景、光線。
但不能進臉。
```

---

### 24.3 10-tier sanitize 規則

`prompt_governance.js` 新增 `sanitizeTiers`，共 10 層：

1. `tier01_identity_sovereignty`
2. `tier02_beauty_template`
3. `tier03_editorial_commercial`
4. `tier04_fantasy_archetype`
5. `tier05_makeup_restructure`
6. `tier06_camera_angle_identity`
7. `tier07_head_body_scale`
8. `tier08_quality_retouch`
9. `tier09_motion_obstruction`
10. `tier10_scope_language`

每一層都有 `id`、`name`、`scope`、`replacements`、`bannedTerms`，讓治理規則能被 lint、audit、verification 共同讀取。

---

### 24.4 buildPrompt() 順序強化

`core.js` 新增三個核心保護常數：

- `CORE_FACE_SCOPE_LOCK`
- `CORE_DOCUMENTARY_PERSON_LOCK`
- `CORE_TIERED_SANITIZE_LOCK`

目前 prompt 前置順序為：

```text
CORE_GATE
CORE_IDENTITY_SOVEREIGNTY
CORE_ANTI_BEAUTY_TEMPLATE
CORE_FACE_SCOPE_LOCK
CORE_DOCUMENTARY_PERSON_LOCK
CORE_TIERED_SANITIZE_LOCK
face anchor
avoid lock
identity lock
...
```

---

### 24.5 sanitizeCreativeField() 強化

`sanitizeCreativeField()` 現在會先跑：

```text
TEXT_REPLACEMENTS
SANITIZE_TIERS
legacy fallback replacements
```

這代表新規則集中在 `prompt_governance.js`，舊資料仍由 fallback 保護，runtime prompt 與 audit script 會盡量使用同一套治理來源。

---

### 24.6 驗證腳本

已新增：

```text
scripts/verify_identity_prompt_samples.mjs
```

用途：

- 抽測 20 組代表性風格
- 檢查最終 prompt 是否包含核心身份保護段落
- 檢查創作段落是否仍殘留 10-tier bannedTerms
- 產出 `temp/identity_prompt_20_sample_verification.json`

注意：

```text
這是 prompt-level identity drift risk 驗證。
不是實際生圖 face-match 換臉率量測。
```

目前結果：

```text
sampleCount: 20
highRiskCount: 0
highRiskRate: 0
target: < 10%
```

---

### 24.7 風格範例母庫清洗

本輪沒有重排母庫，也沒有大規模改寫 625 筆。

只針對 audit 指出的 6 筆中高風險 `rewrite_needed` 做保守替換：

- `rev_016`：移除 `cinematic glow makeup`、`camera-ready`、`defined brows and lashes`、`environmental portrait`
- `rev_012`：移除 `ultra realistic`、`8K HDR`
- `myth_24`：`金烏化形` 改為 `金烏幻境`
- `lz_16`：`綠蜂化形` 改為 `綠蜂幻境`
- `lz_25`：`仙女下凡` 改為 `雲巔靈境`
- `lz_28`：`蚌精化形` 改為 `蚌宮幻境`

清洗後：

```text
cards: 625
issues: 57
rewriteNeeded: 0
```

剩餘 57 筆為低風險，多數屬於歷史欄位殘留如 `environmental portrait`，runtime 會自動轉成 documentary location photo。後續可分批清理，不阻塞 build。

---

### 24.8 本輪額外修正

修正一個 runtime 漏口：

```text
demon queen in this scene
```

改為：

```text
dark supernatural ruler in this scene
```

另修正 `yaohou` 妝容描述，避免 `demon queen surface makeup` 在創作段落觸發 archetype face risk。

---

### 24.9 驗證結果

本輪完成後已通過：

```text
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

其中 `npm.cmd test` 包含：

- `verify_identity_engine`
- `verify_identity_prompt_samples`
- `verify_ui_static`
- `verify_headless_browser`

重要結果：

```text
441 visible prompts: no commercial or fantasy beauty leakage
20 sample prompts: 0 high-risk prompts
UI runtime errors: 0
horizontal overflow: false
build: success
```

---

### 24.10 後續建議

下一步不建議再盲目加鎖臉咒語。

建議接續做：

1. 分段 prompt risk report：Scene / Makeup / Camera / Quality 各自出報告
2. rewrite preview：顯示替換前後與原因
3. 將剩餘 57 筆 low risk 分批清理
4. 建立實際圖片 A/B 測試流程，才有辦法真正估算「換臉率」

本輪工程結論：

```text
鎖臉不是加咒語，而是降低會偷改臉的正向權重。
現在系統已把這件事工程化。
```
