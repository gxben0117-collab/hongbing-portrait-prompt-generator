# 風格範例 lint 與審核規則 v1.0

日期：2026-05-22

## 目的

這份文件定義 `核心資料/風格範例.md` 與未來新增風格卡的正式審核規則。

目標是讓資料新增不再只靠主觀判斷，而有一套可重複、可交接、可機器化的 lint 思維。

## 適用範圍

適用於以下資料來源：

- `核心資料/風格範例.md`
- 待新增的風格卡草稿
- AI 自動補庫候選資料
- 人工整理後準備寫入 `index.html` 的 runtime 卡片

## 審核分級

每張卡在進入 runtime 前，應先被判定為以下其中一種狀態：

- `approved`
  - 已符合核心規範
  - 可進入正式流程

- `review`
  - 有可用價值
  - 但仍需要人工調整或詞彙降風險

- `blocked`
  - 含明顯高風險詞或高風險構圖
  - 不可直接進 runtime

- `legacy`
  - 舊世代資料
  - 可保留參考，但不可直接視為安全主流程來源

## 必查項目

每張卡至少要檢查以下五類問題：

1. identity 風險
2. pose 風險
3. camera / composition 風險
4. beauty archetype 風險
5. runtime 映射完整性

## 一、identity 風險規則

以下詞或概念出現在角色描述時，應視為高風險：

- `heroine`
- `beauty`
- `goddess face`
- `celebrity face`
- `perfect beauty`
- `flawless`
- `luxury beauty`
- `actress template`
- `influencer face`
- `AI beauty`

規則：

- 若這些詞出現在「角色氛圍」且明顯描述臉，而不是描述世界觀或風格，至少標為 `review`
- 若內容明確引導重建模板臉，標為 `blocked`

## 二、pose 風險規則

以下動作或姿勢描述，優先視為高風險：

- `仰拍`
- `回眸`
- `極端扭身`
- `全背面`
- `跳躍`
- `旋轉`
- `舞蹈式大動作`
- `雙手高舉靠近臉`
- `遮臉`
- `用髮絲或道具遮住五官`

規則：

- 若一張卡的動作核心建立在這些元素上，至少標為 `review`
- 若動作明顯會破壞臉身一致性，標為 `blocked`
- 若只是可改寫為安全姿勢，應轉寫後再進 runtime

## 三、camera / composition 風險規則

以下鏡頭語言與構圖描述屬高風險：

- `movie trailer`
- `cinematic trailer`
- `超廣角`
- `廣角仰拍`
- `人物渺小`
- `低角度仰視主體`
- `全景主體極小`
- `史詩大景人物僅作比例尺`
- `鳥瞰人物極小`

規則：

- 若卡片的畫面成立依賴「人物極小」或「超廣角壯景」，應標 `review` 或 `legacy`
- 若構圖直接與 proportion / face readability 主線衝突，標 `blocked`

## 四、beauty archetype 風險規則

以下描述若直接用來定義人物長相，而非僅描述風格氣質，視為高風險：

- `女神感`
- `仙氣十足`
- `絕美`
- `純淨無瑕`
- `冷豔絕世`
- `頂級女星氣場`
- `光芒萬丈`
- `神聖純美`

規則：

- 可保留敘事氣氛，但不得用來暗示臉應該被重建成某種 archetype
- 若這些詞主導了角色氛圍，應降為 `review`
- 若同時混合高風險鏡頭與高風險姿勢，標 `blocked`

## 五、runtime 映射完整性規則

即使一張卡題材很好，只要無法乾淨映射到 runtime，也不能直接上機。

最低要求：

- 可抽出清楚的 `scene`
- 可抽出清楚的 `outfit`
- 可抽出清楚的 `prop`
- 可抽出清楚的 `comp`
- 有合理 `mk`

若出現以下狀況，至少標 `review`：

- 只有意境，沒有可執行動作
- 只有場景，沒有服裝與動作
- 只有情緒詞，沒有畫面結構
- 構圖寫法太抽象，無法轉成穩定 prompt

## 建議 metadata

未來每張卡建議補以下 metadata：

- `category_id`
- `tpl`
- `source_type`
  - `manual`
  - `curated`
  - `legacy`
  - `auto`
- `status`
  - `approved`
  - `review`
  - `blocked`
  - `legacy`
- `risk_flags`
  - `identity_risk`
  - `pose_risk`
  - `camera_risk`
  - `beauty_risk`
  - `fx_risk`

## lint 判定建議

### 直接判 `blocked`

符合任一條即可：

- 明確鼓勵換臉 archetype
- 明確使用超廣角 + 人物渺小作為主賣點
- 明確依賴仰拍 / 回眸 / 背面姿勢
- 明確要求五官被煙、紗、髮絲、道具遮住

### 判 `review`

符合任一條即可：

- 題材可用，但描述語言仍偏舊世代
- 角色氛圍含高風險美女模板詞
- 場景好，但動作與構圖還不夠工程化
- 可映射，但需要改寫成安全版 runtime 文句

### 判 `legacy`

符合以下情況：

- 舊資料仍有參考價值
- 但文字風格明顯不符合現行 identity-first 主線
- 適合保留靈感，不適合直接進行安全輸出

## 與現行程式的關係

現行程式已有第二層保護：

- `sanitizePromptText()`
- `sanitizeCreativeField()`
- `ANTI_PATTERNS`

但這些只屬於輸出保險，不應取代資料前審。

原則：

1. 資料前審是第一層
2. runtime sanitize 是第二層
3. 二者不可互相替代

## 正式流程建議

新增風格卡時，流程建議固定為：

1. 先讀 `核心資料/核心咒語規範.md`
2. 依 `風格範例資料結構規格 v1.0` 撰寫資料
3. 依本文件做 lint 與審核分級
4. `approved` 才可轉入 runtime
5. 輸出時再由程式做 sanitize

## 最終原則

這份規則的重點不是刪掉所有舊資料，而是建立一條明確分界：

- 什麼是靈感
- 什麼是正式資料
- 什麼可以保留
- 什麼不能進主流程

只要這套 lint / 審核制度建立起來，之後即使再擴充大量風格卡，也比較不會把高風險舊語言重新灌回 identity-first 主系統。
