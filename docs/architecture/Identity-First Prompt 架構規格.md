# Identity-First Prompt 架構規格

## 目標

這份規格定義「紅兵風格寫真咒語產生器」的 prompt 核心架構。

核心原則不是先堆場景美術詞，而是先鎖定真人身份，再決定姿勢、比例、妝容與世界觀。

## 優先順序

prompt 權重順序固定為：

1. `face_lock_core`
2. `pose_coherence_core`
3. `proportion_core`
4. `makeup_safety_core`
5. `anatomy_safety_core`
6. `character_style_block`
7. `costume_block`
8. `scene_block`
9. `lighting_block`
10. `camera_block`
11. `negative_prompt_block`

任何角色、服裝、世界觀、電影感、美術風格，都不得覆蓋前四層核心。

實作細節補充：

- prompt 第 1 段固定為 `CORE_GATE`
- prompt 第 2 段為可選的 `face anchor`
- prompt 第 3 段固定為 `Avoid: ...`
- `face anchor` 空白時可略過，但 `CORE_GATE` 與 `Avoid:` 順序不變

## 核心模組

### 1. face_lock_core

責任：

- 以參考照片作為唯一身份錨點
- 保留五官幾何、表情氣質、自然年齡感與皮膚紋理
- 明確壓制 AI 美女模板化

必須保留：

- forehead proportions
- eye spacing
- eyelid structure
- eye shape
- nose bridge width
- nose tip shape
- mouth width
- lip proportions
- philtrum length
- jaw curvature
- chin structure
- natural asymmetry
- real age appearance
- skin texture and pores

前端對應：

- `index.html` 新增 `臉部特徵（選填）`
- 由 `buildFaceAnchor(faceDesc)` 轉成文字身份錨點
- 若使用者填入 `單眼皮、寬鼻樑、方下巴、自然不對稱` 等描述，會在風格模組前強制插入

### 2. pose_coherence_core

責任：

- 確保臉、頭、脖子、肩膀、軀幹在物理上相容
- 若姿勢與臉部穩定衝突，優先保護身份穩定

硬規則：

- face-body coherence over pose drama
- prefer front-facing or three-quarter face
- avoid extreme twist
- avoid back-facing pose
- avoid overhead arms near face
- avoid props, hair, veil, smoke covering the face

### 3. proportion_core

責任：

- 修正「鎖臉成功但頭身比例不協調」問題
- 確保頭肩比、脖子支撐、torso volume、鏡頭距離合理

硬規則：

- realistic head-to-body proportion
- natural shoulder-width support
- elegant neck transition
- believable torso presence
- avoid oversized head appearance
- avoid chibi proportion
- avoid enlarged cranial silhouette caused by hair ornaments

### 4. makeup_safety_core

責任：

- 妝容只能作為表面風格
- 禁止妝容變相重塑五官

硬規則：

- makeup is surface only
- do not change eye shape
- do not reconstruct lip shape
- do not generate actress-face / influencer-face / AI beauty template makeup

## 反模式規則

以下為已實測列入硬限制的反模式：

- `仰拍`
- `回眸`
- `電影預告 / movie trailer`

原因：

- 容易導致臉身不協調
- 容易把人物導向模板化戲劇構圖
- 容易降低真實寫真質感

系統層要求：

- 預設值不得再導向這三種模式
- 若資料條目或輸入文字含這些模式，輸出前要自動清洗成 safer version
- `Scene context` 僅能描述世界觀，不得再混入 heroine / beauty / divine presence 類 archetype 用語
- `Category pose guidance` 也必須遵守同一規則，行為誘導只能描述角色功能、敘事情境與動作邏輯，不得用 beauty / heroine 類人物原型詞

## 文件邊界

這份檔案是架構規格。

它只定義：

- 核心模組責任
- prompt 順序
- 反模式
- 工程限制

它不保存具體的角色範例 prompt。

角色範例 prompt 應放在：

- `核心資料/正式preset/`

這樣才能把：

- 測試 prompt
- 工程規格

分開維護。
