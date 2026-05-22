import sys, shutil, os

fpath = 'index.html'
shutil.copy(fpath, fpath + '.bak')

with open(fpath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

cat_starts_1 = [346,470,530,559,699,728,808,864,1068,1114,1168,1242,1301,1345,1415,1780,1810,1846,1876,1913,1945,2079,2175,2301,2350,2423,2483,2512,2541,2591,2670,2770,2811,2852,2892,2943,3023,3112,3331,3405,3484,3566]
cats_end_1 = 3618
cat_ids = ['xianxia','hanfu','oriental','gothic','myth','fantasy','water','reference_styles','game','darkfantasy','drama','hotdrama','queen','spirits','china_myth_chars','europe_travel','japan_travel','korea_sea','world_travel','china_mark','jinyong','chinese_story','fallen_angel','holy_angel','goddess_myth','cyberpunk_sf','realistic_life','modern_lady','dragon_beast','dynasty_palace','tang_grandeur','song_grace','ming_grace','qing_grace','three_kingdoms','classic_lit','china_drama','succubus_demon','taiwan_travel','wedding_diamond','cos_character','mountain_sea']

cat_starts_0 = [s-1 for s in cat_starts_1]
cats_end_0 = cats_end_1 - 1

# Extract blocks
blocks = {}
for i, cid in enumerate(cat_ids):
    s = cat_starts_0[i]
    e = cat_starts_0[i+1] if i+1 < len(cat_ids) else cats_end_0
    blocks[cid] = lines[s:e]
    last = next((blocks[cid][j].rstrip() for j in range(len(blocks[cid])-1,-1,-1) if blocks[cid][j].strip()), '')
    print(f"  {cid}: lines {s+1}..{e}, last='{last[-25:]}'")

# New order
order = [
    # 旅拍景點
    'taiwan_travel','mountain_sea','europe_travel','japan_travel','korea_sea','world_travel','china_mark',
    # 漢服古裝朝代
    'hanfu','dynasty_palace','tang_grandeur','song_grace','ming_grace','qing_grace','oriental','reference_styles',
    # 仙俠武俠古典劇
    'xianxia','myth','china_myth_chars','drama','hotdrama','china_drama','three_kingdoms','jinyong','classic_lit','chinese_story',
    # 奇幻超自然
    'fantasy','gothic','darkfantasy','spirits','water','goddess_myth','holy_angel','fallen_angel','succubus_demon','dragon_beast',
    # 現代都市
    'modern_lady','realistic_life','queen','wedding_diamond',
    # 科技動漫
    'cyberpunk_sf','game','cos_character',
]

assert sorted(order) == sorted(cat_ids), "Order mismatch!"

def get_last_idx(block):
    for j in range(len(block)-1,-1,-1):
        if block[j].strip():
            return j
    return -1

new_cats = []
for i, cid in enumerate(order):
    block = list(blocks[cid])
    idx = get_last_idx(block)
    if idx >= 0:
        raw = block[idx].rstrip('\n').rstrip('\r')
        is_last = (i == len(order) - 1)
        if is_last:
            if raw.endswith('},'):
                block[idx] = raw[:-1] + '\n'
            elif not raw.endswith('}'):
                block[idx] = raw + '\n'
        else:
            if raw.endswith('}') and not raw.endswith('},'):
                block[idx] = raw + ',\n'
            elif raw.endswith('},'):
                block[idx] = raw + '\n'
    new_cats.extend(block)

before = lines[:cat_starts_0[0]]
after  = lines[cats_end_0:]
new_lines = before + new_cats + after

with open(fpath, 'w', encoding='utf-8', newline='') as f:
    f.writelines(new_lines)

print(f"\nDone! {len(lines)} -> {len(new_lines)} lines")
