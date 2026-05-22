# 風格範例 lint 腳本規格 v1.0

日期：2026-05-22

## 目的

這份文件定義未來「風格範例 lint 腳本」的第一版規格。

重點是先把腳本要做什麼、輸入輸出是什麼、要檢查哪些風險寫清楚，先形成藍圖，不急著立刻實作。

## 腳本定位

這支腳本的責任不是直接改資料，而是：

1. 掃描 `風格範例.md`
2. 找出高風險卡片
3. 找出欄位缺口
4. 產出可審核的報告
5. 協助判定：
   - `approved`
   - `review`
   - `blocked`
   - `legacy`

## 預期輸入

第一版至少支援：

1. `核心資料/風格範例.md`
2. 可選：
   - `index.html` 內的 `CATS`
   - 風險詞清單
   - category / tpl 對應表

## 預期輸出

第一版建議產出兩種結果：

### 1. 人類可讀報告

例如：

- 總卡數
- 高風險卡數
- `legacy` 建議數
- 每類風險數量
- 典型問題樣本

### 2. 結構化審核結果

建議 JSON：

- 一張卡一筆結果
- 對應 `風格範例審核標記格式 v1.0`

## 檢查模組

第一版建議拆成 6 個 lint 模組。

### 1. 欄位結構檢查

檢查：

- 是否有 `ID`
- 是否有 `妝容`
- 是否有 `角色氛圍`
- 是否有 `場景背景`
- 是否有 `服裝`
- 是否有 `道具`
- 是否有 `構圖`

若關鍵欄位缺失，至少標：

- `review`
- 風險旗標：`mapping_gap`

### 2. identity archetype 詞檢查

檢查詞例如：

- `heroine`
- `beauty`
- `goddess face`
- `celebrity`
- `perfect beauty`
- `flawless`
- `luxury beauty`
- `actress template`
- `influencer face`

規則：

- 若出現在角色氛圍且明顯描述長相，標 `review`
- 若強烈導向模板臉，標 `blocked`

### 3. pose 風險檢查

檢查詞例如：

- `仰拍`
- `回眸`
- `back-facing`
- `jumping`
- `spinning`
- `arms overhead`
- `covering face`

規則：

- 若屬主構圖或主動作，標 `review` 或 `blocked`

### 4. camera / composition 風險檢查

檢查詞例如：

- `movie trailer`
- `cinematic trailer`
- `超廣角`
- `廣角仰拍`
- `人物渺小`
- `bird's-eye tiny subject`
- `epic scale subject tiny`

規則：

- 若與 identity-first 主線衝突，標 `review / legacy / blocked`

### 5. 舊世代風格漂移檢查

判定一張卡是否屬舊世代語言：

- `UE5 cinematic`
- `仙氣縹緲`
- `女神感`
- `純淨無瑕`
- `冷豔絕世`
- `光芒萬丈`

規則：

- 若題材可保留，但語言明顯過舊，標 `legacy`

### 6. runtime 映射可行性檢查

檢查是否能穩定提取：

- `scene`
- `outfit`
- `prop`
- `comp`
- `mk`

若內容過度抽象、只有意境無法轉欄位，標：

- `review`
- `mapping_gap`

## 判定邏輯建議

### 判 `blocked`

符合任一條：

- 明確換臉模板引導
- 明確高風險姿勢為核心賣點
- 明確超廣角 / 仰拍 / 人物極小為核心構圖
- 明確遮臉或破壞五官可讀性

### 判 `legacy`

符合以下條件組合：

- 題材仍有參考價值
- 但用語與現行系統明顯不一致
- 不建議直接進 runtime

### 判 `review`

符合以下條件組合：

- 題材可用
- 欄位可救
- 只需要改寫或降風險

### 判 `approved`

同時滿足：

- 無重大高風險詞
- 欄位完整
- 可映射到 runtime
- 不與 identity-first 主線衝突

## 報告格式建議

第一版建議輸出：

1. summary
   - 總卡數
   - approved / review / blocked / legacy 數量

2. by_risk_type
   - identity_risk
   - pose_risk
   - camera_risk
   - beauty_risk
   - mapping_gap
   - legacy_style_drift

3. sample_cards
   - 每類列出 3 到 10 張代表卡

4. full_results
   - 每張卡一筆完整結構化結果

## 與現有程式的邊界

這支 lint 腳本：

- 不直接覆蓋 `index.html`
- 不直接修改 `風格範例.md`
- 不取代 `sanitizeCreativeField()`

它只做前審與報告。

真正修改資料，應由：

- 人工調整
- 或後續專用轉換腳本

## 建議未來檔名

若之後正式實作，可考慮：

- `scripts/lint_style_library.py`
- `scripts/lint_style_library.mjs`

輸出可考慮：

- `temp/style_library_lint_report.json`
- `temp/style_library_lint_summary.md`

## 第一版不做的事

為了避免一次做太大，v1.0 先不要求：

- 自動修正文字
- 自動寫回 md
- 自動產生 approved runtime 卡
- 自動做重寫建議的完整 prompt

第一版只負責：

- 找問題
- 分級
- 交給人或下一階段腳本處理

## 最終原則

lint 腳本的價值不是取代判斷，而是把「哪些資料有問題」提早抓出來。

這樣未來不管是人手補庫、AI 擴充，還是大規模 legacy 整理，都不會再一股腦把舊風格高風險語言重新灌回正式主系統。
