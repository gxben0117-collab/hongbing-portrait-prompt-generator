# 核心咒語規範 版本 Log

---

## v1.6 — 2026-05-24

**變更摘要：**
- 新增 `IDENTITY SOVEREIGNTY PROMPT RULE`，正式定義「真人身份主權高於風格、角色、beauty、editorial、cinematic」。
- 新增 `FANTASY SCOPE LIMITATION`，明確規定幻想只能作用於環境、服裝、道具、光線、氛圍與色彩，不得作用於臉部幾何。
- 新增 `ANTI-BEAUTY-TEMPLATE OVERRIDE`，禁止網紅臉、fantasy queen 臉、古偶女主臉、V 臉、大眼、尖下巴、商業修臉。
- 新增 `STYLE CONTAMINATION BLACKLIST` 與 `IDENTITY-SAFE REPLACEMENT PRINCIPLE`，把 beauty / archetype / editorial / angle / head-scale 高危詞納入正式規範。
- 更新 prompt 組裝順序為：身份主權 → 禁止美化模板 → 解剖與比例 → 環境 → 光線 → 真人語境 → 表面妝容 → 服裝 → 安全動作 → 平衡構圖 → 真人攝影品質。

**主要方向：** 從「identity-first」升級為「identity sovereignty + style contamination suppression」，核心目標是讓真人保持原樣進入幻想世界，而不是生成幻想角色再套真臉。

---

## v1.3 — 2026-05-22

**變更摘要：**
- prompt engine 新增 `buildFaceAnchor(faceDesc)`，允許在不改動核心規範 `.md` 的前提下，把臉部文字錨點固定插入 prompt 前段
- `Avoid: ${AVOID_LOCK}` 從尾段前移到第 3 段，強化防換臉、防臉身不協調、防頭身比例失衡的實際權重
- `TPLS.char` 全面中性化，只保留世界觀與場景語意，不再用 heroine / beauty / divine presence 等人物原型詞
- `ANCIENT_BOOST` 改為精簡安全版：限制頭飾數量、限制頭部輪廓膨脹、保留古裝層次與單一手持道具
- `sanitizePromptText()` 新增更嚴格 safer replacement，覆蓋 `movie trailer`、`fashion editorial camera language`、`perfect beauty`、`cat-eye`、`jumping`、`back-facing` 等高風險詞

**主要方向：** 從「identity-first 排序」進一步升級為「identity-first + face anchor + template neutralization」

---

## v1.4 — 2026-05-22

**變更摘要：**
- 清理 `CATEGORY_POSE_LIBRARY` 中殘留的 `beauty / heroine` 類 archetype 行為描述
- 將古裝行為引導改寫為純角色功能與情境邏輯描述，例如 `court figure`、`scholar`、`martial character`
- 驗證腳本新增 pose guidance archetype 檢查，避免未來回歸

**主要方向：** 把 archetype 清理從模板層延伸到姿勢行為誘導層

---

## v1.4-task2 — 2026-05-22

**變更摘要：**
- 依 `TASK-002` 對選項層做硬精簡：`LENS` 僅保留 `l_50`、`l_85`，移除 `cl_travel`、`ls_lowkey`、`at_dark`、`at_ethereal`
- `TPL_DEFAULTS` 全面改成安全主路徑：仙俠 / 古裝類以 `at_misty` 為主，現代旅拍以 `at_clear` 為主，女王 / 婚紗收斂到 `l_85 + cl_magazine + ls_studio + at_warm`
- `sanitizePromptText()` 與 `sanitizeCreativeField()` 新增 `travel documentary`、`candid travel`、`ethereal atmosphere`、`celestial mist` 等 safer replacement
- 補上舊資料相容正規化：即使 `index.html` 既有卡片仍帶有舊 `lens / light / atm` id，程式也會自動落到安全有效值，不會把舊危險選項帶回 prompt
- 驗證腳本同步加入 `TASK-002` 檢查項目，並更新 `faceDesc` 引導與 `at_misty` 可見性限制語

**主要方向：** 從 identity-first 架構進一步收斂成「安全主幹道優先」的 prompt engine，降低大頭、浮臉、身體消失與 AI 美女模板化風險

---

## v1.1 — 2026-05-21

**變更摘要：**
- 新增 `IDENTITY ELASTICITY (REALISM SUPPORT)` 段落：允許自然頭髮變化、電影感構圖、現實環境互動、隨機能量，鼓勵真實感而非靜態呈現
- 新增 `VISUAL REALISM PRIORITY` 段落：強調最終圖像應像真實照片，避免過度對稱、人偶式姿勢、美顏濾鏡
- `IDENTITY & EXPRESSION PRESERVATION` 增強：加入 eye shape、nose structure、mouth structure、emotional characteristics 等更細緻的臉部保護描述
- `ANATOMY & VISUAL FRAME` 放寬：允許局部遮擋、自然頭髮遮蓋、電影陰影，只要人物仍可辨識即可
- `PROMPT GENERATION RESTRAINTS` 更新：加入 mannequin-like posing、artificial symmetry、frozen expressions、repetitive framing 等新的禁止項
- `CATEGORY-SPECIFIC MAKEUP LOCKS` 獨立成段（原本併在 VISUAL LOCKS 內）
- `PROMPT STRUCTURING` 新增：支援更廣泛攝影風格（candid、documentary、film photography、natural light、spontaneous）
- VERSION MANAGEMENT：版本號從 v0.22（HTML 版號）改為獨立的 v1.1 核心規範版號

**主要方向：** 從「硬鎖定身份」轉向「真實感攝影 + 有彈性的身份保護」

---

## v1.0 — 2026-05-21（初始封存版）

**內容：** 原始核心咒語規範，含 IDENTITY PRESERVATION、ANTI-AI ARTIFACTS、ANATOMY、PROMPT STRUCTURING、VERSION MANAGEMENT、CATEGORY-SPECIFIC VISUAL LOCKS 六個段落。

**備份檔：** `versions/核心咒語規範_v1.0.md`
