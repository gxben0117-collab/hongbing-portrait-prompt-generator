import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");

const CATEGORY_PREFIX = {
  taiwan_travel: "tw",
  mountain_sea: "ms",
  europe_travel: "eu",
  japan_travel: "jp",
  korea_sea: "ks",
  world_travel: "wt",
  china_mark: "cm",
  hanfu: "hf",
  dynasty_palace: "dp",
  tang_grandeur: "tg",
};

const RAW_ADDITIONS = {
  taiwan_travel: `
九份茶聖女：煙雨山城、青磚木窗、一襲改良旗袍手捧茶盞
墾丁逐浪少女：熱帶陽光、比基尼與碎花罩衫、腳踏衝浪板
阿里山墨染茶仙：雲海翻騰、日出金光灑在白底水墨漢服上
日月潭水靈巫女：湖面縹緲、邵族圖騰編織羽冠、手執祈福水鈴
淡水暮色戀人：夕陽染紅海面、英倫風風衣、髮絲隨海風飛揚
清境牧歌精靈：青青草原、歐式蕾絲圍裙、手抱軟萌綿羊
大稻埕昭和名媛：百年紅磚洋樓、刺繡絲綢旗袍、手拿蕾絲洋傘
蘭嶼達悟海神女：椰林海風、傳統紅白黑幾何織紋長裙、配戴貝殼項鍊
太魯閣峽谷行者：大理石斷崖背景、帥氣機能風衝鋒衣、高馬尾工裝褲
高美濕地鏡面舞者：天空之鏡、純白芭蕾舞裙在水面輕起漣漪
台南古都千金：赤崁樓紅牆、巴洛克風蕾絲洋裝、手拿復古摺扇
司馬庫斯泰雅織女：神木林深處、紅白相間傳統織布披肩、眼神澄澈
陽明山花季仙子：漫山芒草與繡球花海、法式輕紗初戀裙
鹿港老街掌櫃娘：摸乳巷深處、民初棉麻斜襟衫、手搖蒲扇
野柳女王蜂后：奇岩怪石背景、前衛液態金屬晚禮服、女王氣場
安平追想曲歌姬：港口黃昏、復古波點連身裙、手提皮質行李箱
三仙台跨海祭司：巨浪拍打八拱橋、玄色長袍隨風狂舞、祭祀神態
西門町霓虹辣妹：夜雨街頭、Y2K 漆皮夾克、彩色挑染、手拿珍奶
十分天燈祈願少女：鐵道夜色、天燈微光映照橘調棉麻裙與溫柔笑顏
澎湖雙心石滬人魚：蔚藍珊瑚海、波光粼粼的亮片魚尾裙
內灣戲院復古伶人：日治木造戲院、手推波浪髮型、深綠絲絨旗袍
合歡山銀河觀星者：滿天星斗、工裝羽絨大衣、手提復古露營燈
美濃客家藍衫姑娘：煙雨廊道、經典右襟藍衫、手撐油紙傘
象山俯瞰都市女王：台北101背景、黑色高開叉亮片禮服、冷艷高傲
金門花洋樓佳人：閩南燕尾脊、馬卡龍色系改良漢服、文藝清新
馬祖藍眼淚魔女：夜間海灘、螢光藍水面、幽藍色輕紗長裙
集集小鎮單車少女：綠色隧道、日系制服裙、草帽、單車車籃裝滿花
北投溫泉幽蘭：日式榻榻米、白底藍花浴衣、手執木質水瓢
烏來瀑布山林神女：飛瀑之下、碧綠流蘇長裙、額間點綴翠綠寶石
外埔忘憂谷稻田仙子：金色稻浪、一襲薑黃色棉麻連身裙、赤腳奔跑
`.trim().split("\n"),
  mountain_sea: `
冰島黑沙灘冰后：極地玄武岩、黑紗重工禮服、冷冽銀髮與皇冠
撒哈拉流沙吉普賽：烈日狂沙、大紅披帛纏繞、金色額飾、眼神野性
珠峰金山朝聖者：日照金山雪線、紅藏袍、藏銀耳環、神聖虔誠
挪威峽灣精靈女王：萬丈絕壁、冰藍色拖尾長裙、銀色長髮隨風
深海寂靜人魚：深邃蔚藍、無人光影、半透明薄紗魚尾、空靈寂寞
科羅拉多荒漠女俠：紅岩大峽谷、麂皮流蘇外套、牛仔帽、皮靴
茶卡鹽湖天空繆斯：純白結晶水面、大紅色飄逸雪紡長裙、極致反差
富士山櫻雪姬：白雪覆頂、櫻花飄落、櫻粉色十二單和服
亞馬遜雨林豹女：巨型芭蕉葉、豹紋圖騰獵裝、小麥肌、手執長矛
落基山脈林海獵手：白雪皚皚松林、皮草斗篷、手持復古長弓
馬爾地夫玻璃海仙女：果凍浪花、薄荷綠露背泳絲長裙
多洛米蒂山脈牧羊女：針葉林阿爾卑斯風情、綁帶圍裙、羊毛背心
死海浮沉智者：烈日鹽晶、黑色極簡泳衣、浮在水面讀古老羊皮紙
針葉林迷霧尋蹤者：晨霧森林、清冷系卡其色長版風衣、眼神孤傲
大堡礁深海潛水姬：極彩珊瑚礁、專業人魚流線潛水服、人魚姿態
安地斯山脈印加聖女：馬丘比丘遺址、色彩斑斕的民族斗篷、編髮
冰川裂縫幽藍之花：萬年冰川、鈷藍色高級定制禮服、冰晶妝容
惡魔之眼地熱魔女：彩色溫泉迷霧、暗紅絲絨緊身裙、冷酷高貴
白沙荒漠純白修女：無垠白沙丘、純黑與純白交織的高定修女袍
海島火山熔岩女王：黑火山石、烈焰紅唇、橘紅漸層流蘇禮服
烏尤尼鹽沼星空聖女：夜間鏡面反射銀河、璀璨星光長裙、如立雲端
馬達加斯加猴麵包樹女巫：黃昏剪影、非洲藤編飾品、原始野性長裙
愛琴海懸崖白裙繆斯：藍天白雲深海、極簡純白真絲吊帶裙
阿爾卑斯碎花少女：雪山草甸、德迪爾（Dirndl）民俗碎花裙
螢光海灘夜之精靈：藍色螢光浪花、半透明夜光絲綢裙、赤腳漫步
羚羊峽谷光影神女：一線天流動光芒、大地色系修身針織長裙
愛爾蘭莫赫懸崖孤女：狂風巨浪、深灰色羊毛斗篷、黑髮狂舞
棉花堡溫泉天鵝：石灰岩階梯白水、天鵝羽毛裝飾抹胸短裙
納米比亞紅沙漠女戰士：紅沙丘脊線、黑皮革抹胸、古銅肌膚
神祕地下鐘乳石姬：地底暗河水晶、幽綠色亮片透視裙、神秘高冷
`.trim().split("\n"),
  europe_travel: `
巴黎鐵塔左岸名伶：塞納河畔、黑色小黑裙、法式網紗赫本帽
威尼斯面具貴婦：貢多拉船頭、巴洛克重工蕾絲大擺裙、金色面具
倫敦霧夜偵探神探：大笨鐘下、英倫格紋雙排扣風衣、貝雷帽、煙斗
羅馬假日赫本風少女：許願池畔、白襯衫、復古高腰大擺赫本裙
聖托里尼藍白繆斯：藍頂教堂背景、純白真絲露背長裙、微風拂面
布拉格廣場黃昏歌姬：天文鐘前、暗紅絲絨大衣、手捧白玫瑰
新天鵝堡逃跑公主：童話城堡、水藍色宮廷蓬蓬裙、水晶皇冠
巴塞隆納狂想女巫：聖家堂前、高彩幾何撞色長裙、藝術家氣質
佛羅倫斯文藝復興仕女：烏菲茲長廊、文藝復興油畫風方領重工裙
瑞士小鎮阿爾卑斯少女：因特拉肯草坪、編髮雙馬尾、麻花毛衣裙
維也納金色大廳琴女：大提琴、一襲抹胸金色刺繡晚禮服、優雅尊貴
阿姆斯特丹鬱金香花仙：風車與彩色花海、法式碎花方領泡泡袖
普羅旺斯薰衣草織女：紫色花海、法式草編帽、白色棉麻吊帶裙
西班牙塞維亞佛朗明哥舞伶：大紅層疊魚尾裙、紅玫瑰咬唇、木屐
蘇格蘭高地格子呢少女：古堡廢墟、經典綠紅格紋呢絨裙、紅髮
雅典衛城神廟祭司：帕德嫩神廟、古希臘單肩垂墜白褶裙、金桂冠
柏林牆龐克酷女：塗鴉牆背景、鉚釘黑皮衣、網襪、破洞馬汀鞋
布魯日中世紀織錦女：天鵝小街、復古墨綠絲絨方領長裙、金絲眼鏡
莫斯科紅場冬美人：洋蔥頭教堂雪景、白色皮草大衣與毛皮帽
愛丁堡幽靈新娘：黑夜皇家哩路、殘破婚紗、煙燻妝、清冷詭異
尼斯海灘陽光名媛：蔚藍海岸、超大沿草帽、黑白條紋復古泳裝
米蘭時裝週高冷超模：街頭抓拍、廓形西裝套裝、大墨鏡、冷漠臉
哥本哈根童話美人魚：新港彩色房子、馬卡龍色針織衫、溫柔直髮
凡爾賽宮瑪麗王后：鏡廳內部、洛可可極致奢華粉色羽毛撐裙
布達佩斯廢墟酒吧辣妹：迷幻霓虹、亮片吊帶裙、煙燻玫瑰唇
薩爾斯堡音樂之聲女教士：草坡上、樸素黑白修女裙、手拿吉他
高加索山脈格魯吉亞聖女：古老石教堂、白紗蒙頭、傳統刺繡長袍
冰島藍湖溫泉仙子：地熱溫泉迷霧、白色極簡泳衣、濕髮微醺
牛津大學學院淑女：博德利圖書館、黑袍學士服、內搭精緻襯衫
馬爾他騎士團女教皇：黃金城牆、黑底金線十字繡長袍、手持權杖
`.trim().split("\n"),
  japan_travel: `
京都祇園碎步藝妓：大紅色重工振袖和服、高聳髮髻、手持櫻花折扇
淺草雷門和服少女：巨大紅燈籠下、淡粉底小碎花蕾絲改良和服
奈良公園小鹿仙子：日系微光、日系JK制服、手拿鹿仙貝溫柔微笑
伏見稻荷千本鳥居巫女：紅白相間傳統巫女服、束髮、眼神清冷
北海道小樽雪燈路冬女：漫天飛雪、白色粗針織毛衣、紅格子圍巾
富士河口湖楓紅佳人：紅葉掩映富士山、深杏色羊毛大衣、貝雷帽
沖繩萬座毛琉球神女：蔚藍海風、琉球傳統紅型織物、彩色頭飾
新宿街頭霓虹夜雨辣妹：透明雨傘、原宿風撞色夾克、雙馬尾鬆糕鞋
鎌倉高校前海景少女：江之電鐵道、經典水手服、手扶單車迎風笑
銀山溫泉大正浪漫千金：木造旅館雪景、大正風箭羽紋行燈袴、馬靴
江之島落日衝浪女孩：金色夕陽海面、緊身衝浪衣、手抱衝浪板
吉卜力森林系女孩：大龍貓雕像旁、棉麻背心裙、雙編辮、草帽
秋葉原二次元女僕：動漫街頭、黑白荷葉邊經典女僕裝、白絲襪
明治神宮白無垢新娘：參天古木、純白重工白無垢、端莊高貴
竹林深處清冷刺客：嵐山竹海、墨綠色緊身忍者服、手執黑鞘短刀
東京鐵塔夜景女王：六本木觀景台、紅色緊身露背晚禮服、大波浪
築地魚市煙火氣廚娘：藍染頭巾、日式職人圍裙、甜美笑容
兼六園名媛賞梅：雪吊景觀、深紫底金絲刺繡訪問著和服
澀谷十字路口潮流達人：人潮洶湧、暗黑機能風拼接套裝、銀髮
日光東照宮古韻歌姬：金碧輝煌廟宇、絳紅色小振袖、手持三味線
輕井澤森林單車千金：白樺林、法式復古綠色碎花裙、法式編髮
箱根溫泉霧中天鵝：露天風呂、大片白霧、花卉浴衣半褪、微醺妝
宇治茶田採茶姑娘：滿山翠綠、藍白扎染頭巾與圍裙、手提茶簍
鳥取沙丘大漠孤女：白色長紗裙隨風狂舞、赤腳在無垠沙丘
橫濱中華街旗袍御姐：霓虹招牌、黑色高開叉絲絨旗袍、手拿煙斗
川越小江戶風鈴少女：風鈴長廊、天藍色夏季浴衣、手拿水信玄餅
美秀美術館未來祭司：時空隧道、極簡結構主義白裙、科技妝容
白川鄉合掌村雪國精靈：點燈夜景、大紅斗篷毛絨帽、手捧雪球
那智瀑布神道教聖女：飛瀑古道、全白狩衣、頭戴櫻花冠
姬路城白鷺天守千金：純白城堡背景、大禮服式改良振袖、氣質高雅
`.trim().split("\n"),
  korea_sea: `
景福宮春雪韓服娘：粉白底金絲刺繡高級韓服、雙辮綴髮帶
曼谷大皇宮金碧神女：金箔壁畫、泰國傳統傳統裹胸紗裙、金奢飾品
清邁古城水燈仙子：萬盞天燈、泰北潑水節白色筒裙、手捧水燈
峇里島烏布叢林精靈：熱帶雨林高空鞦韆、大露背亮黃色長裙飛揚
下龍灣海上石林船娘：翡翠色水面、傳統奧黛（Ao Dai）、戴斗笠
吳哥窟高棉微笑聖女：巨樹纏繞石雕、藏青色民族刺繡長裙
新加坡濱海灣未來姬：超級樹背景、未來感銀色緊身連身裙
長灘島白沙灘日落繆斯：椰林剪影、極簡白色比基尼外搭波西米亞罩衫
首爾梨泰院冬日潮女：街角咖啡廳、廓形羊羔毛大衣、冷酷厭世臉
萬榮藍色潟湖跳水女孩：果凍色水潭、熱帶植物、陽光小麥肌泳裝
吉隆坡雙子星夜色女王：玻璃高空、黑色亮片深V禮服、高冷氣場
長灘島椰林落日編髮少女：滿頭彩色髒辮、鏤空針織裙、赤腳奔跑
胡志明市法式公館名媛：黃色法式建築、深綠色絲綢奧黛、蕾絲扇
濟州島山房山油菜花仙：滿眼金黃、韓系白色娃娃裙、草帽
蒲甘千塔佛光聖女：熱氣球日出、一襲橘紅長裙背影、手持蓮花
北村韓屋村文藝閨秀：青磚瓦房、改良素色韓服、手拿復古相機
萬隆火山煙霧魔女：硫磺白煙、暗黑系哥德長裙、冷酷妝容
芭達雅人妖皇后：極致華麗羽毛大禮服、滿鑽面具、魅惑眾生
薄荷島眼鏡猴森林精靈：林深處、森系大地色棉麻裙、頭戴花冠
釜山甘川洞文化村少女：彩色房子、馬卡龍色衛衣、牛仔短裙
金邊王宮高棉舞伶：神廟前、金冠羽衣、傳統天女舞（Apsara）姿態
美奈白沙丘紅裙舞者：一半沙漠一半大海、正紅真絲長裙迎風狂舞
華欣火車站復古淑女：紅白相間舊車站、泰式復古碎花裙、手提藤編包
馬尼拉西班牙古城千金：巴洛克教堂、大蓬袖西班牙殖民風禮服
清萊藍廟深海織女：極致湛藍雕刻、深藍亮片旗袍、冷艷高貴
會安古城燈籠夜魅：滿城彩燈、黑色鏤空奧黛、手提紅色紙燈籠
沙巴仙本那玻璃船姑娘：果凍浪花、水下透視感白紗裙、純淨無暇
首爾弘大熱舞辣妹：街頭塗鴉、迷彩工裝褲、露臍吊帶、耳機
印尼婆羅浮屠日出聖女：佛塔剪影、白紗纏繞身軀、聖潔微光
檳城老街壁畫文藝女：復古單車壁畫旁、文青白裙、文藝復興雙眼皮
`.trim().split("\n"),
  world_travel: `
紐約時代廣場霓虹女王：都市深夜、黃色計程車、黑皮衣、紅唇冷艷
埃及金字塔法老守護者：黃沙漫天、白紗蒙面、金色聖蛇頭飾
泰姬瑪哈陵純白王妃：水池倒影、印度重工白色紗麗（Saree）、眉心紅點
萬里長城烽火女將：崇山峻嶺、改良紅戰袍、手扶青磚、黑髮飄逸
里約基督像森巴舞后：俯瞰海港、極致華麗彩色羽毛桑巴舞衣
杜拜塔雲端奢華名媛：停機坪、高定拖尾金色禮服、俯瞰沙漠之城
莫斯科紅場冬之女皇：漫天大雪、暗紅呢大衣、白色狐狸毛皮帽
舊金山金門大橋霧鎖佳人：紅橋白霧、焦糖色風衣、英倫格子圍巾
雪梨歌劇院港灣繆斯：風帆建築背景、寶藍色抹胸晚禮服、乾練短髮
皮皮島情人沙灘野性女：石灰岩懸崖、熱帶叢林泳裝、古銅肌膚
卡帕多奇亞熱氣球飛天娘：滿天熱氣球、橘黃漸層長裙在露台飛舞
威尼斯聖馬可廣場鴿群仙女：千隻白鴿飛起、一襲香檳色蕾絲蓬蓬裙
羅浮宮金字塔夜色黑天鵝：玻璃金字塔燈光、黑色芭蕾大擺裙
比薩斜塔惡搞甜心：搞怪扶塔姿勢、復古黃色背帶褲、高馬尾
巴塞隆納奎爾公園斑斕女：彩色馬賽克長椅、波西米亞風拼布長裙
肯亞馬賽馬拉草原獵手：百萬動物遷徙背景、軍綠獵裝、墨鏡
雅典帕德嫩神廟白褶神女：日落黃金光芒、白紗垂墜單肩禮服
馬丘比丘失落印加公主：草駝背影、安地斯民族織錦斗篷、長編髮
死海漂浮墨鏡御姐：極致鹽白、黑色連身泳衣、戴大墨鏡仰臥水面
倫敦眼摩天輪英倫淑女：泰晤士河夜景、駝色羊絨大衣、手拿雨傘
吉薩獅身人面像探險家：遮陽帽、卡其色探險襯衫、馬褲皮靴、自信笑
布達佩斯國會大廈多瑙河歌姬：藍色多瑙河、銀色重工閃片長裙
柏林布蘭登堡門鋼鐵玫瑰：宏偉凱旋門、黑色廓形西裝、幹練冷冽
阿姆斯特丹運河櫻草仙子：彩色老房子、黃色單車、白色法式連身裙
西雅圖太空針塔雨夜孤女：西雅圖夜雨、半透明雨傘、墨綠色風衣
舊金山九曲花街繡球花姑娘：滿街鮮花、復古波點裙、甜美笑容
芝加哥雲門大豆子科幻女：鏡面反射都市、銀色液態金屬太空服
好萊塢星光大道復古巨星：手按星形地磚、金髮大波浪、白狐狸披肩
溫哥華楓葉大道秋之女神：漫天紅楓、焦糖色針織毛衣、大地色系妝
復活節島巨石像神祕女祭司：日落剪影、奇異圖騰長裙、星宿刺青
`.trim().split("\n"),
  china_mark: `
故宮雪景紅牆格格：紅牆白雪、手捧金色暖爐、大紅羽緞斗篷
上海外灘十里洋場歌后：東方明珠夜景、金色亮片改良旗袍、羽毛扇
西安大唐不夜城楊貴妃：盛唐燈火、富貴牡丹頭飾、霓裳羽衣
重慶洪崖洞千尋千金：吊腳樓萬家燈火、改良黑色暗黑風漢服、紅傘
張家界乾坤柱御劍女俠：懸浮山迷霧、青色修身道袍、手執長劍
桂林灕江漁火縹緲仙：孤舟蓑笠、灕江山水、白衣勝雪、手持竹笛
杭州西湖斷橋青蛇：煙雨迷濛、青色薄紗漢服、手撐西湖綢傘、妖嬈
蘇州園林拙政閨秀：月亮門、漏窗背景、粉藍色蘇繡水袖裙
拉薩布達拉宮聖潔藏女：高原藍天、精緻蜜蠟綠松石頭飾、手轉經輪
敦煌鳴沙山大漠飛天：黃沙如浪、赤腳懸空、五彩飄帶反彈琵琶
洛陽龍門石窟神祕佛女：大佛腳下、玄色緙絲長袍、悲憫眼神
長城居庸關鐵血花木蘭：烽火台、銀亮魚鱗甲、大紅披風、手握長槍
南京夫子廟秦淮歌姬：秦淮河畫舫、素色棉麻旗袍、懷抱琵琶
鳳凰古城沱江吊腳樓翠翠：翠綠江水、苗族盛裝銀冠、銀鈴作響
青海茶卡鹽湖硃砂仙子：純白鹽結晶、一身大紅雪紡紗裙赤腳站立
泰山頂峰日出紫氣女神：雲海日出、紫金刺繡道袍、手執拂塵
大理洱海長裙文藝女神：雙廊海景、棉麻白色大擺長裙、棉麻草帽
哈爾濱中央大街冰雪女王：歐式建築雪景、白色貂皮大衣、銀髮
平遙古城晉商少奶奶：深宅大院大紅燈籠、清代刺繡馬面裙
武當山金頂太極女俠：雲霧繚繞、白藍拼接太極道服、劍氣逼人
烏鎮水鄉江南船娘：搖櫓船頭、藍印花布頭巾與圍裙、吳儂軟語
新疆喀納斯圖瓦精靈：金黃白樺林、北歐風情民族長裙、馭馬而來
稻城亞丁雪山聖女：央邁勇雪山、藏式白長裙、手捧格桑花
三亞亞龍灣椰林名媛：陽光沙灘、熱帶印花大露背沙灘裙、墨鏡
黃山迎客松雲海仙姑：怪石奇松、水墨漸層漢服、不食人間煙火
宏村月沼水墨佳人：徽派建築粉牆黛瓦倒影、黑白漸變水袖裙
神農架野性深林聖女：迷霧原始森林、皮草獵裝、身側有白狼相隨
成都錦里川劇變臉女：古街燈火、重工川劇鳳冠蟒袍、執扇半遮面
色達喇榮五明佛學院尋道者：漫山紅房子、絳紅色僧袍、眼神清澈
千島湖水下古城美人魚：翡翠色湖水、新中式刺繡亮片魚尾裙
`.trim().split("\n"),
  hanfu: `
魏晉名士・竹林聽琴女：大袖翩翩、素色對襟襦裙、臨風撫琴
漢宮秋月・掌上飛燕：漢代繞襟袍、腰肢纖細、長袖善舞
桃之夭夭・出閣新娘：周制婚服紅綠撞色、鳳冠霞帔、卻扇遮面
青青子衿・書院才女：漢服交領襦裙、手執簡牘、氣質溫婉
風蕭蕭兮・墨客女俠：玄色交領漢服、頭戴斗笠、高馬尾、手握長劍
雲想衣裳・大唐牡丹后：齊胸襦裙、富貴高髻、面貼金箔花鈿
蒹葭蒼蒼・清冷秋水女：白衣勝雪、獨立寒秋蘆葦蕩、眼神幽怨
浮生若夢・茶道仙子：宋制褙子、清淡素雅、低頭點茶
山有扶蘇・山鬼神女：赤豹隨行、身披薜荔、赤腳赤心
皎皎明月・廣寒仙子：鵝黃月白漸層仙服、懷抱玉兔、衣袂飄飄
衣冠上國・祭天大祭司：重工十二章紋祭祀禮服、神情莊嚴肅穆
春江花月夜・弄潮女：江水微瀾、月色披帛、手執銀色蓮花燈
蘭亭竹影・臨摹才女：青綠色齊腰襦裙、手執毛筆、宣紙點墨
西窗剪燭・閨怨少婦：紅燭殘燼、深色襦裙、對鏡貼花黃
曲水流觴・賦詩才女：溪水畔、鵝黃色對襟羽緞斗篷、杯中盛酒
木蘭花開・歸鄉淑女：脫去戎裝、著我舊時裳、對鏡理雲鬢
橘頌・楚辭神女：橘紅刺繡長袍、屈原詩意、眼神憂國憂民
梨花帶雨・江南歌姬：梨花樹下、素白長裙、懷抱阮咸、淚眼婆娑
霓裳羽衣・天宮舞姬：彩色飛天飄帶、滿身玲瓏配飾、懸空起舞
鐵血紅顏・束髮女將：半身鐵甲內搭大紅襦裙、英姿颯爽
洛神驚鴻・水面仙子：水霧繚繞、硃砂紅披帛、翩若驚鴻
採蓮曲・江南蓮女：荷葉叢中、綠羅裙、紅肚兜、採蓮小舟
空山新雨・隱逸居士：麻布素裙、手提竹簍採藥、自然隨性
梅花三弄・雪中折梅女：白雪紅梅、大紅羽緞披風、雪地折梅
金戈鐵馬・待嫁巾幗：身披戰甲、頭戴鳳冠、極致矛盾的美感
晚唐頹廢・墮馬髻美人：斜靠榻上、薄紗半褪、眼神迷離慵懶
紈扇仕女・撲蝶少女：紈扇在手、粉色齊胸、花園中輕盈撲蝶
雀欲高飛・孔雀神女：翠綠藍漸層孔雀翎刺繡漢服、高傲尊貴
九幽玄女・暗黑漢服：全黑交領禮服、面繪彼岸花、幽冥氣息
盛世華章・百鳥朝鳳后：金絲萬縷、重工鳳凰刺繡大禮服、萬民臣服
`.trim().split("\n"),
  dynasty_palace: `
大漢宣室・呂后掌權：黑金漢代深衣、重工金冠、眼神凌厲不怒自威
盛唐夜宴・武皇登基：明黃龍袍、百鳥朝鳳冠、手執權杖、君臨天下
大明霓裳・九翟冠后：明代大衫霞帔、精緻九翟冠、端莊肅穆
清宮剪影・孝莊太后：深色滿族旗裝、手盤朝珠、眼神深邃睿智
宋韻風雅・向太后垂簾：宋代青色禮服、珠翠面飾、溫和而威嚴
大秦宣太后・羋月掌政：秦代玄黑紅邊禮服、高髻、大開大合霸氣
兩晉名士・謝道韞才女：寬大晉制襦裙、羽扇在手、詠雪之才
北朝木蘭・代父從軍妃：半身龍鱗甲、內襯宮廷錦緞裙、剛柔並濟
隋宮華章・蕭皇后迷樓：隋代奢華刺繡宮服、迷樓月色、絕代風華
康乾盛世・富察皇后：清代石青色朝服、戴朝冠、溫婉賢淑
漢宮燕居・班婕妤怨：素色漢宮服、團扇在手、冷宮秋葉
唐宮長公主・太平幽怨：大明宮詞風格、深紫薄紗宮服、眼神寂寞
宋宮詞・劉娥登朝：宋代褘衣、面貼珠翠、一代女主風采
明宮錦衣・萬貴妃專寵：明代交領宮服、眼神嫵媚狠辣、手執金簪
清宮冬日・華妃賞雪：大紅圍領狐皮正裝旗服、花盆底、傲慢冷艷
大漢椒房・衛子夫椒房：漢代玄青繞襟袍、長髮及腰、溫柔恭順
馬王堆傳奇・辛追夫人：奢華素紗襌衣、漢代貴婦妝容、雍容華貴
魏文昭后・甄宓洛神：魏晉高腰襦裙、手托玉璧、眼神哀傷
五代十國・花蕊夫人：宮廷蜀錦長裙、手折芙蓉、詩才絕代
北宋李師師・青樓天子寵：宋制性感薄紗褙子、懷抱古箏、清高孤傲
明代冷宮・幽禁廢后：殘破素白宮服、髮絲凌亂、冷月照枯井
清末珍妃・井邊落淚：晚清鑲邊旗裝、淚眼婆娑、紫禁城深宮幽怨
南朝陳后主・張麗華麗宇：玉樹後庭花意境、輕紗宮服、極致妖嬈
元代宮廷・奇皇后執政：元代質孫服元素改良宮服、皮草滾邊高冠
大明長公主・坤寧喋血：崇禎斷臂長公主、血染白衣明宮服、悲壯
清宮大婚・赫舍里皇后：大紅清代朝服、重工朝冠、明眸皓齒
漢代和親・解憂公主：烏孫異域風漢宮服、手握漢節、望向故鄉
唐代女官・上官婉兒簪筆：唐代男裝圓領袍、額間梅花妝、手執硃筆
宋代和碩公主・金枝玉葉：粉櫻色宋制襦裙、珍珠貼面、嬌俏高貴
大明東宮・太孫妃新禧：明代織金馬面裙、紅色對襟短衫、喜氣洋洋
`.trim().split("\n"),
  tang_grandeur: `
貴妃醉酒・沉香亭北：牡丹花海、羞花之貌、霓裳羽衣半褪、眼神迷離
長安花朝・滿城霓裳：長安街頭、手執鮮花、高皇冠齊胸襦裙少女
西域胡姬・胡旋舞影：落日酒肆、薄紗遮面、露臍胡服、赤腳旋轉
太真仙子・驪山出浴：華清池水霧、白紗裹身、濕髮貼頰、清純絕色
平陽昭公主・娘子軍帥：身披明光鎧、內襯大紅戰裙、手勒駿馬韁繩
曲江流飲・探花宴女：曲江水畔、鵝黃齊胸襦裙、手拿金樽、才情洋溢
大明宮詞・少年太平：周迅版風格、滿身羽毛編織的仙子裙、眼神靈動
梨園春曉・絲竹首席：手持篳篥或排簫、大唐宮廷樂伎重工妝容
盛唐俠女・紅線夜奔：夜行衣外搭紅斗篷、手執匕首、高馬尾夜色
上官婉兒・巾幗首相：唐代女官圓領袍、手批奏折、眉宇間皆是權謀
打馬球唐代颯女：緊身翻領胡服、高馬尾、手執馬球桿、英姿颯爽
公孫大娘・劍器渾脫：大紅舞衣、雙手執長劍、劍影如動八方
唐代崑崙奴傳奇・紅綃女：夜色深庭、黑衣輕紗、身手矯健的俠女
虢國夫人・素面朝天：不施粉黛、著青綠騎馬裝、自信傲然遊春
魚玄機・易求無價寶：咸宜觀道姑服、青絲半挽、眼神清冷看透紅塵
薛濤・浣花溪畔才女：親手製作薛濤箋、一襲桃紅色唐代襦裙
大唐紈扇仕女・撲蝶：周昉畫意、豐腴之美、薄紗透體、紈扇撲蝶
步輦圖・文成公主：重工吐蕃與唐代融合盛裝、眼神堅毅望向遠方
高陽公主・禁忌之戀：奢華唐宮服、手捧佛經、眼神叛逆而深情
永泰公主・九層石槨：石窟壁畫風、捧物女官裝束、溫柔哀傷
長安夜市・面具少女：元宵燈會、崑崙奴面具摘下一半、巧笑倩兮
大唐點茶娘・煮雪烹茶：紅泥小火爐、綠袖襦裙、低頭專注舀茶湯
西域商隊・琵琶女：駱駝背上、大漠風沙、反彈琵琶、紅紗飛揚
縹緲江仙・霓裳羽衣舞：水霧舞台、極致長袖、飄逸如飛天落入人間
大唐冷宮・白髮宮女：紅牆枯葉、宮服斑駁、白髮訴說玄宗往事
胡騰舞姬・異國金髮：金髮碧眼胡姬、緊身窄袖舞服、金鈴作響
長安春遊・仕女踏青：簪花仕女、手牽紙鳶、草地鶯飛、笑聲銀鈴
大唐禦前・擊鼓女將：巨大戰鼓前、雙手執桴、大紅戰袍、鼓震千軍
梅妃・驚鴻舞盡：一身梅花白裙、身形輕盈如驚鴻、眼神孤高清冷
盛唐入魔・墮天女帝：黑金龍袍、面繪暗黑花鈿、眼神嗜血而尊貴
`.trim().split("\n"),
};

const DEFAULT_MK = {
  hanfu: "oriental",
  dynasty_palace: "gongting",
  tang_grandeur: "gongting",
};

const ROLE_MARKERS = [
  "守護者","朝聖者","女祭司","名伶","名媛","戀人","少女","姑娘","仙子","仙姑","仙女","歌姬","歌后",
  "女王","皇后","王妃","公主","聖女","巫女","魔女","女俠","女將","掌櫃娘","掌權","新娘","祭司","舞者",
  "舞伶","伶人","千金","佳人","仕女","美人魚","御姐","淑女","嫡女","女帝","后","妃","姬","娘","女"
];

const STYLE_TERMS = [
  ["旗袍", "refined qipao styling"],
  ["改良旗袍", "modernized qipao styling"],
  ["漢服", "flowing hanfu layers"],
  ["襦裙", "traditional ruqun silhouette"],
  ["宮服", "formal palace dress"],
  ["韓服", "structured hanbok styling"],
  ["和服", "kimono styling"],
  ["振袖", "furisode kimono styling"],
  ["浴衣", "light yukata styling"],
  ["巫女服", "shrine maiden styling"],
  ["白無垢", "ceremonial white bridal kimono"],
  ["狩衣", "ceremonial shrine robe"],
  ["袴", "hakama styling"],
  ["奧黛", "Ao Dai styling"],
  ["紗麗", "sari styling"],
  ["道袍", "daoist robe styling"],
  ["禮服", "formal gown styling"],
  ["婚紗", "bridal gown styling"],
  ["晚禮服", "evening-gown styling"],
  ["長裙", "long flowing gown"],
  ["洋裝", "tailored dress styling"],
  ["大衣", "tailored coat styling"],
  ["風衣", "structured trench-coat styling"],
  ["斗篷", "cloak or cape styling"],
  ["皮衣", "leather-jacket styling"],
  ["西裝", "tailored suit styling"],
  ["圍裙", "apron-layered styling"],
  ["泳衣", "swimwear styling"],
  ["比基尼", "resort swimwear styling"],
  ["潛水服", "streamlined diving suit"],
  ["戰袍", "battle-robe styling"],
  ["戰甲", "armored styling"],
  ["鎧", "armored styling"],
  ["甲", "armored styling"],
  ["忍者服", "stealth ninja styling"],
  ["女僕裝", "maid-costume styling"],
  ["修女袍", "nun-inspired robe styling"],
  ["校服", "school-uniform styling"],
  ["制服", "school-uniform styling"],
  ["工裝", "utility styling"],
];

const ACCESSORY_TERMS = [
  ["茶盞", "tea cup"],
  ["折扇", "folding fan"],
  ["洋傘", "lace parasol"],
  ["雨傘", "umbrella"],
  ["油紙傘", "oil-paper umbrella"],
  ["權杖", "scepter"],
  ["水鈴", "ritual bell"],
  ["琵琶", "pipa"],
  ["三味線", "shamisen"],
  ["長劍", "long sword"],
  ["長槍", "spear"],
  ["匕首", "dagger"],
  ["經輪", "prayer wheel"],
  ["暖爐", "hand warmer"],
  ["露營燈", "camp lantern"],
  ["天燈", "sky lantern"],
  ["水燈", "floating lantern"],
  ["衝浪板", "surfboard"],
  ["單車", "bicycle"],
  ["相機", "vintage camera"],
  ["煙斗", "pipe prop"],
  ["花冠", "flower crown"],
  ["皇冠", "crown"],
  ["面具", "mask"],
  ["朝珠", "court beads"],
  ["玉兔", "jade rabbit motif"],
  ["蓮花", "lotus prop"],
  ["古箏", "guqin or zither prop"],
  ["毛筆", "brush"],
  ["簡牘", "bamboo slip manuscript"],
  ["吉他", "guitar"],
  ["鼓", "ceremonial drum"],
  ["駿馬", "horse tack detail"],
  ["長弓", "longbow"],
];

function extractCatsBlock(text) {
  const marker = "const CATS = [";
  const start = text.indexOf(marker);
  if (start === -1) throw new Error("CATS declaration not found");
  const open = text.indexOf("[", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escape = false;
  let close = -1;
  for (let i = open; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === quote) {
        inString = false;
      }
      continue;
    }
    if (ch === "'" || ch === "\"") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) throw new Error("CATS closing bracket not found");
  return { start: open, end: close + 1, arrayText: text.slice(open, close + 1) };
}

function normalize(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/[·・．.，,、：:／/（）()\-—]/g, "")
    .toLowerCase();
}

function extractStem(title) {
  const plain = String(title || "").replace(/[·・．.，,、：:／/（）()\-—\s]/g, "");
  for (const marker of ROLE_MARKERS) {
    const idx = plain.indexOf(marker);
    if (idx >= 2) return plain.slice(0, idx);
  }
  return plain.slice(0, Math.min(plain.length, 6));
}

function chooseByHash(seed, variants) {
  return variants[Math.abs(seed) % variants.length];
}

function hashText(value) {
  let hash = 0;
  for (const ch of value) hash = (hash * 33 + ch.charCodeAt(0)) | 0;
  return hash;
}

function nextEntryId(categoryId, entries) {
  const prefix = CATEGORY_PREFIX[categoryId];
  if (!prefix) throw new Error(`Missing id prefix for ${categoryId}`);
  const maxNum = entries
    .map((entry) => {
      const match = String(entry.id || "").match(/_(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .reduce((max, value) => Math.max(max, value), 0);
  return `${prefix}_${String(maxNum + 1).padStart(2, "0")}`;
}

function detectTerms(desc, terms) {
  const hits = [];
  for (const [keyword, label] of terms) {
    if (String(desc).includes(keyword) && !hits.includes(label)) hits.push(label);
  }
  return hits;
}

function buildScene(categoryId, title, sub, descParts) {
  const cue = descParts.slice(0, 2).join(" / ");
  const bases = {
    taiwan_travel: "Taiwan landmark travel portrait setting with strong local atmosphere",
    mountain_sea: "grand mountain or ocean destination setting with large natural scale",
    europe_travel: "European travel portrait setting with readable landmark atmosphere",
    japan_travel: "Japanese travel portrait setting with strong seasonal or urban identity",
    korea_sea: "Korean or Southeast Asian travel portrait setting with vivid cultural context",
    world_travel: "global landmark travel setting with iconic destination identity",
    china_mark: "Chinese landmark travel setting with strong architecture or landscape memory",
    hanfu: "Chinese classical costume setting with poetic story atmosphere",
    dynasty_palace: "imperial Chinese court setting with ceremonial palace context",
    tang_grandeur: "High Tang cultural setting with flourishing imperial atmosphere",
  };
  return `${title}${sub ? `, ${sub}` : ""}, ${bases[categoryId] || "story-rich portrait setting"}, cue details inspired by ${cue}, clear place identity and grounded environmental depth`;
}

function buildOutfit(categoryId, title, desc) {
  const styleHits = detectTerms(desc, STYLE_TERMS).slice(0, 3);
  const accessoryHits = detectTerms(desc, ACCESSORY_TERMS).slice(0, 2);
  const defaults = {
    taiwan_travel: "travel-ready styling with location-appropriate layers",
    mountain_sea: "destination statement styling balanced with realistic outdoor wear",
    europe_travel: "editorial travel styling with refined silhouette control",
    japan_travel: "Japan-inspired travel styling with clear cultural wardrobe cues",
    korea_sea: "regional travel styling matched to tropical, palace, or city context",
    world_travel: "landmark travel styling with memorable destination-specific wardrobe cues",
    china_mark: "Chinese landmark travel styling with culturally grounded wardrobe detail",
    hanfu: "classical hanfu styling with readable sleeve and silhouette layers",
    dynasty_palace: "formal court styling with ceremonial palace layers and controlled ornamentation",
    tang_grandeur: "Tang dynasty styling with rich yet identity-safe costume detail",
  };
  const parts = [];
  if (styleHits.length) parts.push(styleHits.join(", "));
  parts.push(defaults[categoryId] || "portrait styling matched to the scene");
  if (accessoryHits.length) parts.push(`accessories such as ${accessoryHits.join(" and ")}`);
  parts.push(`wardrobe direction inspired by ${title}`);
  return parts.join(", ");
}

function propCompGroup(categoryId) {
  if (["taiwan_travel", "mountain_sea", "europe_travel", "japan_travel", "korea_sea", "world_travel", "china_mark"].includes(categoryId)) return "travel";
  if (["hanfu"].includes(categoryId)) return "hanfu";
  if (["dynasty_palace"].includes(categoryId)) return "palace";
  return "tang";
}

function buildProp(categoryId, entryId) {
  const seed = hashText(`${categoryId}:${entryId}:prop`);
  const groups = {
    travel: [
      "behaving like a real traveler in the location by pausing, walking, or lightly interacting with nearby architecture, landscape, or weather while keeping the face fully readable",
      "using a grounded travel-photo action with relaxed shoulders and a natural body angle, so the place feels lived-in instead of posed generically",
      "letting the destination guide the body language through a calm pause, a small step, or a soft interaction with local details while preserving face-body coherence",
    ],
    hanfu: [
      "choosing a calm story-driven classical action that fits the role and setting while keeping the face-body relationship natural and identity-safe",
      "using a composed three-quarter classical posture with readable sleeves, grounded shoulders, and a clear narrative reason for the hand placement",
      "letting cultural context guide the action through tea, writing, music, ritual, or travel detail instead of relying on a stiff frontal stance",
    ],
    palace: [
      "using a ruler or court figure's action such as holding a decree, receiving an audience, pausing beside a throne axis, or walking through palace space with controlled authority",
      "letting ceremonial status guide the gesture with calm hand placement, stable shoulders, and fully visible facial identity instead of theatrical distortion",
      "framing the subject as a court presence with restrained authority, readable costume logic, and a physically compatible head, neck, and torso relationship",
    ],
    tang: [
      "choosing a Tang-era action tied to music, ceremony, travel, or martial identity while keeping the face open, the neck relaxed, and the shoulders naturally aligned",
      "using role-driven Tang storytelling through court movement, performance readiness, or ritual pause instead of exaggerated twisting or face-obscuring motion",
      "letting the Tang setting shape a poised body angle, sleeve flow, and prop handling while maintaining natural face-body coherence",
    ],
  };
  return chooseByHash(seed, groups[propCompGroup(categoryId)]);
}

function buildComp(categoryId, entryId) {
  const seed = hashText(`${categoryId}:${entryId}:comp`);
  const groups = {
    travel: [
      "vertical travel portrait with clear face, readable body line, and enough environmental space to preserve landmark recognition",
      "vertical environmental portrait, subject naturally anchored in scene depth, face unobstructed, movement implied without distortion",
      "vertical three-quarter travel composition with stable facial readability, coherent body placement, and destination atmosphere preserved behind the subject",
    ],
    hanfu: [
      "vertical full-body or three-quarter hanfu composition, costume layers clearly visible, face unobstructed, and classical atmosphere integrated without hiding anatomy",
      "vertical classical portrait with clear face, elegant body angle, and enough environmental depth to support the character's story",
      "vertical story-led hanfu composition, face readable, body naturally aligned, and period styling legible from head to hem",
    ],
    palace: [
      "vertical regal portrait with strong architectural axis, clear face, stable body silhouette, and ceremonial depth supporting status without overpowering identity",
      "vertical court composition with throne, corridor, or gate structure reinforcing authority while the face remains clearly readable and naturally connected to the body",
      "vertical palace portrait, full styling readable, face unobstructed, and environmental hierarchy supporting a composed sovereign presence",
    ],
    tang: [
      "vertical Tang costume portrait with clear face, readable sleeve movement, and enough scene depth for court or market atmosphere without obscuring the subject",
      "vertical story-led Tang composition, face unobstructed, body naturally aligned, and costume silhouette preserved from head to hem",
      "vertical ceremonial Tang portrait with environment supporting music, ritual, or martial identity while keeping the anatomy grounded and coherent",
    ],
  };
  return chooseByHash(seed, groups[propCompGroup(categoryId)]);
}

function parseLine(line) {
  const [left, right] = String(line).split("：");
  const titlePart = (left || "").trim();
  const descParts = (right || "")
    .split("、")
    .map((part) => part.trim())
    .filter(Boolean);
  const [name, subFromTitle] = titlePart.split("・").map((part) => part.trim());
  const sub = subFromTitle || descParts[0] || "";
  return {
    name: name || titlePart,
    sub,
    titlePart,
    descParts,
    descText: descParts.join("、"),
  };
}

function main() {
  const original = fs.readFileSync(INDEX_PATH, "utf8");
  const catsBlock = extractCatsBlock(original);
  const cats = vm.runInNewContext(`(${catsBlock.arrayText})`);
  const report = [];

  for (const category of cats) {
    const additions = RAW_ADDITIONS[category.id];
    if (!additions) continue;

    const existingNorms = new Set();
    const existingStems = new Set();
    for (const entry of category.entries) {
      existingNorms.add(normalize(entry.name));
      existingNorms.add(normalize(entry.sub));
      existingNorms.add(normalize(`${entry.name}${entry.sub || ""}`));
      existingStems.add(extractStem(entry.name));
    }

    let added = 0;
    let skipped = 0;
    for (const raw of additions) {
      const parsed = parseLine(raw);
      const titleNorm = normalize(parsed.name);
      const subNorm = normalize(parsed.sub);
      const comboNorm = normalize(`${parsed.name}${parsed.sub}`);
      const stem = extractStem(parsed.name);

      if (
        existingNorms.has(titleNorm) ||
        existingNorms.has(subNorm) ||
        existingNorms.has(comboNorm) ||
        existingStems.has(stem)
      ) {
        skipped += 1;
        continue;
      }

      const entryId = nextEntryId(category.id, category.entries);
      const entry = {
        id: entryId,
        name: parsed.name,
        sub: parsed.sub,
        icon: category.icon,
        scene: buildScene(category.id, parsed.name, parsed.sub, parsed.descParts),
        outfit: buildOutfit(category.id, parsed.name, parsed.descText),
        prop: buildProp(category.id, entryId),
        comp: buildComp(category.id, entryId),
      };
      if (DEFAULT_MK[category.id]) entry.mk = DEFAULT_MK[category.id];

      category.entries.push(entry);
      existingNorms.add(titleNorm);
      existingNorms.add(subNorm);
      existingNorms.add(comboNorm);
      existingStems.add(stem);
      added += 1;
    }

    report.push(`${category.id}\t+${added}\tskip=${skipped}\ttotal=${category.entries.length}`);
  }

  const updatedArray = JSON.stringify(cats, null, 2);
  const updated = `${original.slice(0, catsBlock.start)}${updatedArray}${original.slice(catsBlock.end)}`;
  fs.writeFileSync(INDEX_PATH, updated, "utf8");
  console.log(report.join("\n"));
}

main();
