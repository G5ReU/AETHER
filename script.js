// ==========================================
// 全局状态与配置 (存储在 localStorage)
// ==========================================
let config = JSON.parse(localStorage.getItem('aetherConfig')) || { url: '', key: '', model: '', contextLimit: 10 };
// 新增一个数组，用于保存当前聊天的上下文记忆
let chatSession = []; 
let drawHistory = JSON.parse(localStorage.getItem('aetherHistory')) || []; // 历史记录
let selectedContextIds = []; // 聊天时勾选的历史记录

// ==========================================
// 塔罗牌终极数据库 (78张全套：大阿尔卡纳 + 四元素小阿尔卡纳)
// ==========================================
const TAROT_DATABASE = [
    // --- 大阿尔卡纳 (0-21) ---
    { id: 0, nameZh: "愚者", nameEn: "The Fool", meaningUp: "无限的可能，全新的开始。顺从内心的指引，不要畏惧未知，大胆踏出第一步。", meaningRev: "鲁莽，错失良机。计划可能不够周全，需要三思而后行，避免盲目冒险。" },
    { id: 1, nameZh: "魔术师", nameEn: "The Magician", meaningUp: "创造力与显化。你已具备所需的元素，现在是采取行动、将想法化为现实的绝佳时机。", meaningRev: "能力受阻，沟通不畅。可能存在欺骗，或未发挥出真实潜力，需警惕花言巧语。" },
    { id: 2, nameZh: "女祭司", nameEn: "High Priestess", meaningUp: "直觉与潜意识。向内探寻，倾听灵魂深处的声音，答案自然会浮现。", meaningRev: "直觉被蒙蔽，表面化。忽略了内心的警告，需要重新审视自我，倾听真实感受。" },
    { id: 3, nameZh: "女皇", nameEn: "The Empress", meaningUp: "丰收，母性与孕育。充满爱与美的时期，适合创造、享受生活和关注大自然。", meaningRev: "过度溺爱，失去自我。可能在感情或物质中迷失，或者存在创造力枯竭的困扰。" },
    { id: 4, nameZh: "皇帝", nameEn: "The Emperor", meaningUp: "权威，秩序与结构。你需要建立规则，承担责任，用理性和逻辑掌控局面。", meaningRev: "固执，专制或失去控制。可能过于霸道，或者缺乏纪律导致生活混乱。" },
    { id: 5, nameZh: "教皇", nameEn: "The Hierophant", meaningUp: "信仰，传统与教导。遵循传统价值观，寻求精神导师的指引，或加入某个团体。", meaningRev: "打破常规，叛逆。不再盲从权威，想要寻找属于自己的非传统精神道路。" },
    { id: 6, nameZh: "恋人", nameEn: "The Lovers", meaningUp: "爱，和谐与选择。灵魂的共鸣，或者面临一个需要用真心去抉择的重大十字路口。", meaningRev: "失和，错误的选择。关系中出现裂痕，或者在价值观上产生了难以调和的冲突。" },
    { id: 7, nameZh: "战车", nameEn: "The Chariot", meaningUp: "意志力，胜利与决心。掌控对立的力量，克服困难，勇往直前必能获得成功。", meaningRev: "失控，方向迷失。精力分散或受外部阻力影响，需要重新找回内心的方向盘。" },
    { id: 8, nameZh: "力量", nameEn: "Strength", meaningUp: "温柔与坚韧。真正的力量并非暴力，而是用慈悲、耐心和内在勇气去驯服野兽。", meaningRev: "自我怀疑，软弱。内心的恐惧或愤怒正在占据上风，需要找回自信和自我控制力。" },
    { id: 9, nameZh: "隐士", nameEn: "The Hermit", meaningUp: "孤独与沉思。暂时远离喧嚣，向内寻找灵魂的灯塔，这是一段探寻真理的独处时光。", meaningRev: "逃避现实，孤立。过度封闭自我，可能陷入了偏执，需要适时回到人群中。" },
    { id: 10, nameZh: "命运之轮", nameEn: "Wheel of Fortune", meaningUp: "转变与契机。生命是一个周期，顺应潮流的改变，命运的齿轮正转向好运。", meaningRev: "运气不佳，抗拒改变。暂时的低谷或突如其来的厄运，需要耐心等待周期过去。" },
    { id: 11, nameZh: "正义", nameEn: "Justice", meaningUp: "公平，平衡与因果。你的行为将带来应有的结果，做出客观、理性、合乎道德的决定。", meaningRev: "不公，偏见。可能遭遇不平等待遇，或者对自己/他人过于苛刻，逃避责任。" },
    { id: 12, nameZh: "倒吊人", nameEn: "The Hanged Man", meaningUp: "牺牲，换位思考。暂时停滞，通过放手和改变视角，将获得更深层的精神顿悟。", meaningRev: "无谓的牺牲，钻牛角尖。抗拒顺服，付出了代价却未能得到预期的回报。" },
    { id: 13, nameZh: "死神", nameEn: "Death", meaningUp: "结束与新生。旧事物的彻底终结，为新的开始腾出空间。不要害怕不可避免的转变。", meaningRev: "抗拒改变，停滞不前。对过去的执念阻碍了你的成长，无法彻底割舍导致痛苦延绵。" },
    { id: 14, nameZh: "节制", nameEn: "Temperance", meaningUp: "平衡，调和与疗愈。将不同的元素完美融合，保持情绪的稳定，找到中庸之道。", meaningRev: "失衡，极端。生活节奏被打乱，可能沉溺于某种欲望，需要重新寻找身心的和谐。" },
    { id: 15, nameZh: "恶魔", nameEn: "The Devil", meaningUp: "束缚，诱惑与物质主义。被欲望、不良习惯或有害的关系所困，感觉失去了自由。", meaningRev: "挣脱枷锁，重获自由。看清了虚幻的诱惑，正在摆脱控制，找回自我主导权。" },
    { id: 16, nameZh: "高塔", nameEn: "The Tower", meaningUp: "突变，毁灭与觉醒。建立在虚假基础上的事物轰然倒塌。虽然痛苦，带来了真相与清理。", meaningRev: "避免灾难，或拖延改变。危机已被化解，或者你正在害怕并抗拒必须发生的彻底崩塌。" },
    { id: 17, nameZh: "星星", nameEn: "The Star", meaningUp: "希望，宁静与灵感。度过黑暗后的黎明，宇宙在为你赐福，保持乐观，疗愈正在发生。", meaningRev: "希望落空，悲观绝望。过度消耗了精神，失去了对未来的信念，需要重新寻找人生的光标。" },
    { id: 18, nameZh: "月亮", nameEn: "The Moon", meaningUp: "直觉，迷惘与不安。事情并非表面看起来那样，潜意识的恐惧浮现，需要穿越迷雾。", meaningRev: "云开月明，消除恐惧。真相浮出水面，解开了长久以来的误会或内心的焦虑。" },
    { id: 19, nameZh: "太阳", nameEn: "The Sun", meaningUp: "成功，喜悦与活力。充满温暖与正能量的时期，一切都在向好的方向发展，发光发热。", meaningRev: "暂时阴霾，热情消退。成功被延迟，或者难以感受到当下的快乐，但太阳终会升起。" },
    { id: 20, nameZh: "审判", nameEn: "Judgement", meaningUp: "觉醒，重生与宽恕。听到了灵魂的召唤，过去的业力被清算，准备好迎接更高层次的新生。", meaningRev: "自我怀疑，逃避清算。害怕面对真实的自己或过去的错误，错失了成长的关键机会。" },
    { id: 21, nameZh: "世界", nameEn: "The World", meaningUp: "圆满，达成与旅行。一个循环的完美结束，你已获得了应有的成就，准备开启全新的旅程。", meaningRev: "未竟之事，停滞。即将成功却差了临门一脚，或者被困在某个舒适区无法继续拓展边界。" },

    // --- 权杖 (行动、激情、火元素) ---
    { id: 22, nameZh: "权杖王牌", nameEn: "Ace of Wands", meaningUp: "全新的灵感、激情与行动力。抓住突然迸发的创意。", meaningRev: "缺乏动力，计划延迟，或者灵感未能转化为实际行动。" },
    { id: 23, nameZh: "权杖二", nameEn: "Two of Wands", meaningUp: "规划未来，远见与选择。站在十字路口，准备踏出舒适区。", meaningRev: "犹豫不决，害怕未知。对未来的规划感到迷茫或受限。" },
    { id: 24, nameZh: "权杖三", nameEn: "Three of Wands", meaningUp: "探索，扩展与前瞻。早期的努力开始见效，目光放长远。", meaningRev: "合作受挫，内部延误。目标过大导致眼高手低。" },
    { id: 25, nameZh: "权杖四", nameEn: "Four of Wands", meaningUp: "庆祝，和谐与稳定。达到一个里程碑，享受家庭或团队的欢乐。", meaningRev: "暂时的动荡，庆祝被推迟。家庭或人际关系中出现小摩擦。" },
    { id: 26, nameZh: "权杖五", nameEn: "Five of Wands", meaningUp: "竞争，冲突与意见不合。良性的头脑风暴，或需要克服外部阻力。", meaningRev: "避免冲突，达成妥协。或者内部矛盾加剧，导致内耗。" },
    { id: 27, nameZh: "权杖六", nameEn: "Six of Wands", meaningUp: "胜利，认可与自信。你的努力获得了外界的赞赏和回报。", meaningRev: "名誉受损，缺乏自信。或者胜利是短暂的、虚荣的。" },
    { id: 28, nameZh: "权杖七", nameEn: "Seven of Wands", meaningUp: "防御，坚持与不屈。面临挑战和质疑，但你处于有利位置，必须捍卫立场。", meaningRev: "屈服，不堪重负。感到被压垮，或者放弃了自己的信念。" },
    { id: 29, nameZh: "权杖八", nameEn: "Eight of Wands", meaningUp: "迅捷，行动与好消息。事情正在快速推进，顺流而下。", meaningRev: "延迟，沟通不畅。节奏被打乱，或者行动过于仓促导致失误。" },
    { id: 30, nameZh: "权杖九", nameEn: "Nine of Wands", meaningUp: "疲惫但坚韧，最后的考验。你已经伤痕累累，但只需再坚持一下。", meaningRev: "放弃，过度防御。偏执狂，或者在最后一刻失去了力量。" },
    { id: 31, nameZh: "权杖十", nameEn: "Ten of Wands", meaningUp: "重压，责任与负担。你承担了太多，虽然接近目标但身心俱疲。", meaningRev: "卸下重担，委派任务。或者被压力彻底压垮，必须学会放手。" },
    { id: 32, nameZh: "权杖侍从", nameEn: "Page of Wands", meaningUp: "充满热情的新消息，好奇心。一个自由奔放的新开始。", meaningRev: "三分钟热度，缺乏执行力。或者收到令人失望的消息。" },
    { id: 33, nameZh: "权杖骑士", nameEn: "Knight of Wands", meaningUp: "冲动，活力与冒险精神。行动迅速，充满魅力地追求目标。", meaningRev: "鲁莽，易怒。做事不顾后果，或者承诺无法兑现。" },
    { id: 34, nameZh: "权杖王后", nameEn: "Queen of Wands", meaningUp: "自信，魅力与独立。温暖而充满能量，善于鼓舞他人。", meaningRev: "嫉妒，控制欲。情绪化，或者变得具有攻击性。" },
    { id: 35, nameZh: "权杖国王", nameEn: "King of Wands", meaningUp: "天生的领袖，远见与魄力。果断决策，富有创造力的权威。", meaningRev: "独断专行，霸道。容不下不同意见，或者设定了不切实际的目标。" },

    // --- 圣杯 (情感、关系、水元素) ---
    { id: 36, nameZh: "圣杯王牌", nameEn: "Ace of Cups", meaningUp: "爱，情感的溢出与新关系。灵性与直觉的觉醒。", meaningRev: "情感枯竭，封闭内心。或者感情未能得到回应。" },
    { id: 37, nameZh: "圣杯二", nameEn: "Two of Cups", meaningUp: "契合，平等的伴侣关系与合作。灵魂深处的相互吸引。", meaningRev: "关系失衡，沟通破裂。或者一方付出的感情不对等。" },
    { id: 38, nameZh: "圣杯三", nameEn: "Three of Cups", meaningUp: "欢庆，友谊与社交。与志同道合的人分享快乐时光。", meaningRev: "过度放纵，三人行(感情纠葛)。或者社交圈子变得疏远。" },
    { id: 39, nameZh: "圣杯四", nameEn: "Four of Cups", meaningUp: "冷漠，冥想与错失良机。对外在提议不感兴趣，沉浸在自己的世界里。", meaningRev: "摆脱倦怠，抓住新机会。重新对生活燃起热情。" },
    { id: 40, nameZh: "圣杯五", nameEn: "Five of Cups", meaningUp: "失落，悲伤与执念。只看到失去的部分，忽略了身边还留存的美好。", meaningRev: "接受现实，走出阴霾。原谅过去，开始留意新的希望。" },
    { id: 41, nameZh: "圣杯六", nameEn: "Six of Cups", meaningUp: "怀旧，童真与回忆。来自过去的人或事重新浮现，单纯的快乐。", meaningRev: "沉溺过去，拒绝成长。或者摆脱了过去的阴影，面向未来。" },
    { id: 42, nameZh: "圣杯七", nameEn: "Seven of Cups", meaningUp: "幻想，选择与迷茫。面临众多诱惑，需要看清虚幻与现实的界限。", meaningRev: "看清现实，做出决断。放弃不切实际的白日梦。" },
    { id: 43, nameZh: "圣杯八", nameEn: "Eight of Cups", meaningUp: "追寻，离去与放下。放弃目前不再滋养你的事物，寻找更高的精神满足。", meaningRev: "害怕未知，拒绝离开。在一段不满意的关系或环境中苟延残喘。" },
    { id: 44, nameZh: "圣杯九", nameEn: "Nine of Cups", meaningUp: "满足，愿望达成。物质与情感的双重丰收，令人愉悦的阶段。", meaningRev: "贪婪，自满。表面风光但内心空虚，或者愿望实现后发现并非所想。" },
    { id: 45, nameZh: "圣杯十", nameEn: "Ten of Cups", meaningUp: "圆满，家庭和谐与终极幸福。长久的情感稳定与和平。", meaningRev: "家庭矛盾，关系破裂。价值观的冲突破坏了原本的和谐安宁。" },
    { id: 46, nameZh: "圣杯侍从", nameEn: "Page of Cups", meaningUp: "温柔的消息，直觉与感性。艺术灵感或浪漫的萌芽。", meaningRev: "情感脆弱，逃避现实。或者表现得不成熟、容易受伤害。" },
    { id: 47, nameZh: "圣杯骑士", nameEn: "Knight of Cups", meaningUp: "浪漫，理想主义与追求。跟随内心的指引，富有魅力的邀约。", meaningRev: "情绪化，不切实际。过度敏感，或者在感情中缺乏责任感。" },
    { id: 48, nameZh: "圣杯王后", nameEn: "Queen of Cups", meaningUp: "共情，慈悲与直觉。极具包容力，倾听他人的情感疗愈者。", meaningRev: "情绪泛滥，失去界限。可能过度依赖他人，或者陷入自怜。" },
    { id: 49, nameZh: "圣杯国王", nameEn: "King of Cups", meaningUp: "情绪管理，外交手腕。在情感波澜中保持冷静，成熟的顾问。", meaningRev: "冷酷，压抑情感。或者利用感情操控他人，内心充满不可预知的风浪。" },

    // --- 宝剑 (思想、冲突、风元素) ---
    { id: 50, nameZh: "宝剑王牌", nameEn: "Ace of Swords", meaningUp: "突破，真相与顿悟。理智的清晰切割了迷雾，带来新的思考方式。", meaningRev: "思想混乱，误解真相。使用了错误的言辞伤害他人。" },
    { id: 51, nameZh: "宝剑二", nameEn: "Two of Swords", meaningUp: "僵局，盲目与权衡。逃避做出困难的决定，维持着表面的脆弱平衡。", meaningRev: "面对现实，打破僵局。终于做出了选择，尽管可能伴随痛苦。" },
    { id: 52, nameZh: "宝剑三", nameEn: "Three of Swords", meaningUp: "心痛，悲伤与分离。必须经历的刺痛，通常来源于外界的真相反馈。", meaningRev: "从创伤中疗愈，释放悲伤。或者压抑了痛苦，导致内伤难以愈合。" },
    { id: 53, nameZh: "宝剑四", nameEn: "Four of Swords", meaningUp: "休整，冥想与恢复。在激烈的消耗后，你需要一段安静的时间来积蓄力量。", meaningRev: "精力耗尽，被迫休息。或者结束了闭关，准备重新面对外界的挑战。" },
    { id: 54, nameZh: "宝剑五", nameEn: "Five of Swords", meaningUp: "冲突，不择手段的胜利。损人不利己的争吵，赢得辩论却失去了人心。", meaningRev: "和解，放下分歧。认识到争斗的无意义，开始寻求双赢的局面。" },
    { id: 55, nameZh: "宝剑六", nameEn: "Six of Swords", meaningUp: "渡过难关，渐入佳境。带着悲伤离开糟糕的境地，向着更平静的水域前行。", meaningRev: "难以前行，被过去拖累。无法逃脱困境，或者抗拒不可避免的过渡。" },
    { id: 56, nameZh: "宝剑七", nameEn: "Seven of Swords", meaningUp: "孤军奋战，欺瞒与策略。采用非传统或隐秘的手段解决问题，或者有人在说谎。", meaningRev: "真相大白，骗局被揭穿。或者放弃了小聪明，决定坦诚相待。" },
    { id: 57, nameZh: "宝剑八", nameEn: "Eight of Swords", meaningUp: "自我设限，无力感。被自己的恐惧和负面思想所困，其实解药就在手中。", meaningRev: "打破思维枷锁，重获自由。看清了限制只是幻觉，找到了出路。" },
    { id: 58, nameZh: "宝剑九", nameEn: "Nine of Swords", meaningUp: "焦虑，梦魇与精神内耗。在深夜被无名的恐惧折磨，事情通常没有想象的那么糟。", meaningRev: "寻找客观出路，走出恐惧。或者精神压力达到了极点，需要专业帮助。" },
    { id: 59, nameZh: "宝剑十", nameEn: "Ten of Swords", meaningUp: "彻底崩塌，背叛与终结。最坏的情况已经发生，但这也意味着否极泰来。", meaningRev: "绝处逢生，从废墟中站起。或者拒绝接受失败，持续在受害者心态中挣扎。" },
    { id: 60, nameZh: "宝剑侍从", nameEn: "Page of Swords", meaningUp: "警觉的观察者，求知欲。敏锐的心智，正在收集信息或探索新想法。", meaningRev: "多嘴，流言蜚语。或者行动仓促、缺乏深思熟虑的承诺。" },
    { id: 61, nameZh: "宝剑骑士", nameEn: "Knight of Swords", meaningUp: "迅猛，批判与直言不讳。雷厉风行地追求真理，但有时显得过于锋利。", meaningRev: "刻薄，急躁。因口无遮拦伤害他人，或者在没有方向的情况下横冲直撞。" },
    { id: 62, nameZh: "宝剑王后", nameEn: "Queen of Swords", meaningUp: "理智，独立与清晰的沟通。剥离感情色彩，用极其客观的标准评判事物。", meaningRev: "冷酷无情，愤世嫉俗。过度批判他人，或者用智慧作为防御的武器。" },
    { id: 63, nameZh: "宝剑国王", nameEn: "King of Swords", meaningUp: "绝对的权威，逻辑与公正。用专业的知识和严谨的纪律掌控大局。", meaningRev: "滥用职权，冷血暴君。用智力压制他人，缺乏同理心和人情味。" },

    // --- 星币 (物质、事业、土元素) ---
    { id: 64, nameZh: "星币王牌", nameEn: "Ace of Pentacles", meaningUp: "新机遇，财富与繁荣的开端。切实可行的计划，有潜力的商业或投资机会。", meaningRev: "错失财务良机，计划缺乏根基。或者过度执着于物质而忽视了精神。" },
    { id: 65, nameZh: "星币二", nameEn: "Two of Pentacles", meaningUp: "权衡，灵活与多任务处理。在时间、金钱或多重责任之间保持着微妙的平衡。", meaningRev: "失去平衡，财务超支。时间管理混乱，无法兼顾导致全部搞砸。" },
    { id: 66, nameZh: "星币三", nameEn: "Three of Pentacles", meaningUp: "合作，团队精神与专业技能。不同才能的人汇聚一堂，共同打造卓越的作品。", meaningRev: "团队不和，缺乏协调。或者个人技能不足，导致项目质量低劣。" },
    { id: 67, nameZh: "星币四", nameEn: "Four of Pentacles", meaningUp: "保守，安全感与占有欲。积累了财富但害怕失去，固守现状不愿分享。", meaningRev: "挥霍无度，或者学会慷慨。打破了对物质的病态执着，资源开始流动。" },
    { id: 68, nameZh: "星币五", nameEn: "Five of Pentacles", meaningUp: "匮乏，孤立与财务困难。感到被排斥在温暖之外，物质或精神上的寒冬。", meaningRev: "熬过严冬，经济状况好转。或者终于愿意放下自尊，寻求他人的帮助。" },
    { id: 69, nameZh: "星币六", nameEn: "Six of Pentacles", meaningUp: "慷慨，慈善与能量流动。给予与接受的平衡，你可能会获得资助或成为施助者。", meaningRev: "不平等的施舍，附带条件的礼物。或者有去无回的投资、被他人索取无度。" },
    { id: 70, nameZh: "星币七", nameEn: "Seven of Pentacles", meaningUp: "评估，耐心与等待回报。辛勤耕耘后停下脚步，审视目前的成果和未来方向。", meaningRev: "缺乏耐心，半途而废。或者投入了大量精力却回报甚微，需要止损。" },
    { id: 71, nameZh: "星币八", nameEn: "Eight of Pentacles", meaningUp: "专注，技艺与精益求精。全神贯注于眼前的细节，通过不懈的练习提升自我。", meaningRev: "敷衍了事，缺乏进取心。或者变成了无脑的工作机器，失去了宏观视野。" },
    { id: 72, nameZh: "星币九", nameEn: "Nine of Pentacles", meaningUp: "物质独立，享受奢华与自律。通过自己的努力获得了高品质的独立生活。", meaningRev: "过度消费，表面风光。或者为了物质出卖了灵魂，在奢华中感到无比孤独。" },
    { id: 73, nameZh: "星币十", nameEn: "Ten of Pentacles", meaningUp: "长久财富，家族传承与稳固。丰厚的物质基础和家族企业的繁荣圆满。", meaningRev: "家族纷争，财产纠纷。传统的基石发生动摇，或者为了金钱背叛了亲情。" },
    { id: 74, nameZh: "星币侍从", nameEn: "Page of Pentacles", meaningUp: "务实的学习者，新的财务计划。脚踏实地，渴望通过努力掌握一项新技能。", meaningRev: "拖延症，缺乏常识。或者对金钱的处理非常幼稚，计划流于空谈。" },
    { id: 75, nameZh: "星币骑士", nameEn: "Knight of Pentacles", meaningUp: "稳健前行，勤奋与可靠。不求速度但求质量，按部就班地完成既定目标。", meaningRev: "顽固不化，极端保守。或者生活过于乏味枯燥，像个沉闷的工作狂。" },
    { id: 76, nameZh: "星币王后", nameEn: "Queen of Pentacles", meaningUp: "丰饶，滋养与现实感。善于理财且极具生活品味，能为身边的人提供实质的安全感。", meaningRev: "拜金主义，疏于照顾。或者在财务上过度焦虑，试图用金钱控制他人。" },
    { id: 77, nameZh: "星币国王", nameEn: "King of Pentacles", meaningUp: "商业大亨，繁荣与权威。极具商业头脑和执行力，是物质领域的绝对掌控者。", meaningRev: "贪婪，唯利是图。为了利益可以牺牲一切原则，或者成为了守财奴。" }
];

// ==========================================
// UI 切换与设置模块
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.feature-section').forEach(sec => sec.classList.remove('active-section'));
    document.getElementById(`tab-${tabId}`).classList.add('active-section');
}

function openSettings() {
    document.getElementById('api-url').value = config.url;
    document.getElementById('api-key').value = config.key;
    document.getElementById('api-context-limit').value = config.contextLimit || 10; // 新增这行
    
    // 初始化下拉菜单状态
    const modelSelect = document.getElementById('api-model');
    if (config.model) {
        modelSelect.innerHTML = `<option value="${config.model}">${config.model}</option>`;
    } else {
        modelSelect.innerHTML = `<option value="">请先输入URL和Key，点击上方拉取</option>`;
    }
    
    document.getElementById('settings-modal').style.display = 'flex';
}

function closeSettings() { document.getElementById('settings-modal').style.display = 'none'; }

function saveSettings() {
    config.url = document.getElementById('api-url').value.trim();
    config.key = document.getElementById('api-key').value.trim();
    config.contextLimit = parseInt(document.getElementById('api-context-limit').value) || 10; // 新增这行
    
    // 获取下拉框选中的模型
    const modelSelect = document.getElementById('api-model');
    config.model = modelSelect.value;
    
    localStorage.setItem('aetherConfig', JSON.stringify(config));
    closeSettings();
    alert("设置已保存");
}

// ==========================================
// 塔罗占卜逻辑 (正逆位 + 存历史)
// ==========================================
let currentSpread = '';
let currentDeck = [];
let drawnCards = [];
let expectedCards = 1;

function shuffleDeck() {
    currentDeck = [...TAROT_DATABASE];
    for (let i = currentDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
    }
}

function startTarot(spreadType) {
    currentSpread = spreadType;
    if (spreadType === 'three') expectedCards = 3;
    else if (spreadType === 'cross') expectedCards = 4;
    else expectedCards = 1;
    
    drawnCards = [];
    shuffleDeck();

    // 隐藏设置页和自由桌面，显示固定牌阵桌面
    document.getElementById('setup-screen').style.display = 'none';
    if(document.getElementById('custom-tarot-screen')) {
        document.getElementById('custom-tarot-screen').style.display = 'none';
    }
    document.getElementById('tarot-screen').style.display = 'flex';
    document.getElementById('ai-reading').style.display = 'none';
    document.getElementById('instruction-text').innerText = "深呼吸，触碰前方的卡牌";

    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    
    // 正确的标签定义（只保留这一个）
    const labels = spreadType === 'cross' ? ['现状', '障碍/挑战', '深层过去', '指引/建议'] : ['过去', '现在', '未来'];

    for (let i = 0; i < expectedCards; i++) {
        // ✨ 新增：把 "牌1" 加上去
        const baseLabel = (spreadType === 'three' || spreadType === 'cross') ? labels[i] : '指引';
        const labelText = `牌 ${i + 1} · ${baseLabel}`;
        
        container.innerHTML += `
            <div>
                <div class="card-label">${labelText}</div>
                <div class="card-wrapper" id="card-${i}" onclick="flipCard(${i})">
                    <div class="card-inner">
                        <div class="card-back"><div class="css-diamond"></div></div>
                        <div class="card-front" id="front-${i}">
                            <div class="card-name-en" id="en-${i}"></div>
                            <div class="card-name-zh" id="zh-${i}"></div>
                            <div class="card-status" id="status-${i}"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
} // 👈 就是刚才你不小心把这个大括号给删漏啦！

function flipCard(index) {
    const cardEl = document.getElementById(`card-${index}`);
    if (cardEl.classList.contains('flipped')) return;

    AudioEngine.play('flip'); // ✨ 补上这行：触发翻牌声

    const cardData = currentDeck.pop();
    // 50% 概率正逆位
    const isReversed = Math.random() < 0.5; 
    drawnCards.push({ index, data: cardData, isReversed });

    document.getElementById(`en-${index}`).innerText = cardData.nameEn;
    document.getElementById(`zh-${index}`).innerText = cardData.nameZh;
    
    const statusEl = document.getElementById(`status-${index}`);
    if (isReversed) {
        statusEl.innerText = "逆位";
        document.getElementById(`front-${index}`).classList.add('is-reversed');
    } else {
        statusEl.innerText = "正位";
    }

    cardEl.classList.add('flipped');

    if (drawnCards.length === expectedCards) {
        document.getElementById('instruction-text').innerText = "命运脉络已展开";
        saveToHistory();
        setTimeout(generateLocalReading, 1000);
    }
}

function saveToHistory() {
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        type: 'tarot',   // ✨ 类型标记
        spread: currentSpread === 'single' ? '单牌' : (currentSpread === 'three' ? '三牌阵' : '十字阵'),
        cards: drawnCards.map(c => ({
            position: c.index,
            name: `牌${c.index + 1}: ${c.data.nameZh}`,
            status: c.isReversed ? '逆位' : '正位'
        }))
    };
    drawHistory.unshift(record);
    localStorage.setItem('aetherHistory', JSON.stringify(drawHistory));
}

function generateLocalReading() {
    document.getElementById('ai-reading').style.display = 'block';
    document.getElementById('typewriter-text').innerHTML = '';
    
    let text = "";
    drawnCards.sort((a, b) => a.index - b.index);
    drawnCards.forEach(c => {
        const status = c.isReversed ? "逆位" : "正位";
        const meaning = c.isReversed ? c.data.meaningRev : c.data.meaningUp;
        text += `【${c.data.nameZh} · ${status}】\n${meaning}\n\n`;
    });
    typeWriter(text, 0, 'typewriter-text');
}

function typeWriter(text, i, elementId) {
    const el = document.getElementById(elementId);
    if (i < text.length) {
        el.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
        setTimeout(() => typeWriter(text, i + 1, elementId), 20); // 调快了一点打字速度
    }
}

function resetTarot() {
    document.getElementById('tarot-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'flex';
}

// ==========================================
// 聊天室与 AI 请求逻辑
// ==========================================
function openHistoryModal() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    if(drawHistory.length === 0) {
        list.innerHTML = '<p style="color:var(--text-light); text-align:center;">暂无占卜记录</p>';
    } else {
        drawHistory.forEach(record => {
            // 根据类型决定：标签文字、标签颜色、内容描述
            let tagText, tagColor, desc;
            if (record.type === 'qian') {
                tagText = '抽签';
                tagColor = '#D4A017';   // 金黄
                desc = record.summary;
            } else if (record.type === 'jiao') {
                tagText = '掷筊';
                tagColor = '#C0392B';   // 朱红
                desc = record.summary;
            } else {
                tagText = '塔罗牌';
                tagColor = '#7C5CD4';   // 神秘紫
                desc = record.cards.map(c => `${c.name}(${c.status})`).join(', ');
            }

            list.innerHTML += `
                <label class="history-item">
                    <input type="checkbox" value="${record.id}" class="history-checkbox">
                    <div style="flex:1;">
                        <span class="history-tag" style="background:${tagColor};">${tagText}</span>
                        <strong style="font-size:11px;">${record.date}</strong>
                        <span style="color:var(--text-light); font-size:10px;"> · ${record.spread}</span>
                        <br>
                        <span style="color:var(--text-light); display:block; margin-top:4px;">${desc}</span>
                    </div>
                </label>
            `;
        });
    }
    document.getElementById('history-modal').style.display = 'flex';
}

function closeHistoryModal() { document.getElementById('history-modal').style.display = 'none'; }

function confirmHistorySelection() {
    const checkboxes = document.querySelectorAll('.history-checkbox:checked');
    selectedContextIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    closeHistoryModal();
    if(selectedContextIds.length > 0) {
        addMessage(`已选择 ${selectedContextIds.length} 条历史记录作为背景信息。`, 'context-msg');
    }
}

// ==========================================
// 聊天室与 AI 请求逻辑 (升级版)
// ==========================================

// 支持附加“重新生成”按钮的渲染函数
function addMessage(text, className, allowRegen = false) {
    const box = document.getElementById('chat-history-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${className}`;
    msgDiv.innerText = text;
    
    // 如果是 AI 回复或报错，追加重新生成按钮
    if (allowRegen) {
        const regenBtn = document.createElement('button');
        regenBtn.className = 'regen-btn';
        regenBtn.innerText = '🔄 重新生成';
        regenBtn.onclick = () => {
            msgDiv.remove(); // 移除当前这条失败或不满意的消息
            triggerAIRequest(); // 重新触发请求
        };
        msgDiv.appendChild(regenBtn);
    }
    
    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;
    return msgDiv; // 返回 DOM 节点方便后续操作
}

// 用户点击发送按钮触发
function sendChatMessage() {
    const inputEl = document.getElementById('chat-input');
    const userText = inputEl.value.trim();
    if (!userText) return;

    addMessage(userText, 'user-msg');
    inputEl.value = '';

    let promptContent = userText;
    if (selectedContextIds.length > 0) {
        let historyStr = "【背景信息：用户近期占卜记录】\n";
        selectedContextIds.forEach(id => {
            const record = drawHistory.find(r => r.id === id);
            if(record) {
                if (record.type === 'qian') {
                    historyStr += `[抽签] 时间:${record.date}，${record.summary}\n`;
                } else if (record.type === 'jiao') {
                    historyStr += `[掷筊] 时间:${record.date}，${record.summary}\n`;
                } else {
                    historyStr += `[塔罗牌] 时间:${record.date}，阵型:${record.spread}，牌面:${record.cards.map(c=>c.name+c.status).join(', ')}\n`;
                }
            }
        });
        promptContent = historyStr + "\n用户问题：" + userText + "\n请结合以上占卜结果给出解答。";
        selectedContextIds = [];
    }

    chatSession.push({ role: "user", content: promptContent });
    triggerAIRequest();
}

// 核心请求逻辑 (支持被 sendChatMessage 和 regenBtn 调用)
async function triggerAIRequest() {
    // 检查配置
    if (!config.url || !config.key || !config.model) {
        addMessage("⚠️ 无法连接：请先在「设置」中配置 API 地址、密钥并拉取选择模型。", 'ai-msg error-msg', false);
        return;
    }

    // 截取记忆上下文：限制 AI 读取的历史条数（系统设定 + 截取的聊天记录）
    const limit = config.contextLimit || 10;
    const systemMsg = { role: "system", content: "你是一位精通塔罗牌和心理学的占星师，语气神秘、优雅且充满智慧。每次回答尽量精简深刻。" };
    
    // 从数组末尾截取指定条数，防止上下文过长
    const contextMessages = chatSession.slice(-limit); 
    const payloadMessages = [systemMsg, ...contextMessages];

    const loadingMsg = addMessage("闭上眼睛，正在连接宇宙信号...", 'context-msg');

    try {
        const response = await fetch(`${config.url}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: payloadMessages
            })
        });

        const data = await response.json();
        loadingMsg.remove(); // 移除加载提示
        
        if (response.ok && data.choices && data.choices.length > 0) {
            const aiReply = data.choices[0].message.content;
            // 记录 AI 的回复到记忆数组
            chatSession.push({ role: "assistant", content: aiReply });
            // 显示在 UI，并允许重新生成
            addMessage(aiReply, 'ai-msg', true); 
        } else {
            // ✅ 精准捕获 API 返回的具体错误信息！
            const errorDetail = data.error?.message || data.error?.code || JSON.stringify(data);
            addMessage(`⚠️ 宇宙信号干扰 (API 报错):\n${errorDetail}`, 'ai-msg error-msg', true);
            // 注意：报错时不要把回复 push 进 chatSession，这样重新生成时用的还是刚才的 user 问题
        }
    } catch (error) {
        loadingMsg.remove();
        addMessage(`⚠️ 物质界网络断开:\n${error.message}\n请检查 API 地址是否正确（通常以 /v1 结尾）。`, 'ai-msg error-msg', true);
    }
}
// ==========================================
// 3. API 测试连接逻辑 (新增)
// ==========================================
async function testConnection() {
    const urlInput = document.getElementById('api-url').value.trim();
    const keyInput = document.getElementById('api-key').value.trim();
    const modelInput = document.getElementById('api-model').value.trim();
    const resultBox = document.getElementById('test-result');

    if (!urlInput || !keyInput || !modelInput) {
        resultBox.style.color = 'red';
        resultBox.innerText = '⚠️ 请先填写完整的 URL、Key 和模型名称';
        return;
    }

    // 设置状态为测试中
    resultBox.style.color = 'var(--text-light)';
    resultBox.innerText = '⏳ 正在与宇宙连接中 (测试请求)...';

    try {
        const response = await fetch(`${urlInput}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${keyInput}`
            },
            body: JSON.stringify({
                model: modelInput,
                // 发送一个极简的提示词测试连通性，限制 token 避免消耗
                messages: [{ role: "user", content: "请只回复数字 1" }],
                max_tokens: 5
            })
        });

        const data = await response.json();

        if (response.ok && data.choices) {
            resultBox.style.color = 'green';
            resultBox.innerText = '✅ 连接成功！频率与宇宙共振。';
        } else {
            resultBox.style.color = 'red';
            resultBox.innerText = `❌ 错误: ${data.error?.message || '服务器返回异常，请检查 Key 或模型名'}`;
        }
    } catch (error) {
        resultBox.style.color = 'red';
        resultBox.innerText = `❌ 网络错误: ${error.message} (请检查URL是否正确)`;
    }
}
// ==========================================
// 4. 拉取 API 模型列表 (GET /models)
// ==========================================
async function fetchModels() {
    const urlInput = document.getElementById('api-url').value.trim();
    const keyInput = document.getElementById('api-key').value.trim();
    const resultBox = document.getElementById('test-result');
    const modelSelect = document.getElementById('api-model');

    if (!urlInput || !keyInput) {
        resultBox.style.color = 'red';
        resultBox.innerText = '⚠️ 无法拉取：请先填写 URL 和 Key';
        return;
    }

    resultBox.style.color = 'var(--text-light)';
    resultBox.innerText = '⏳ 正在向宇宙发送探测信号 (获取模型列表)...';
    modelSelect.innerHTML = '<option value="">拉取中...</option>';

    try {
        // 标准兼容 OpenAI 的模型获取接口
        const response = await fetch(`${urlInput}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${keyInput}`
            }
        });

        const data = await response.json();

        if (response.ok && data.data) {
            modelSelect.innerHTML = ''; // 清空下拉框
            
            // 遍历并填充模型列表
            data.data.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.id;
                modelSelect.appendChild(option);
            });
            
            // 如果之前有保存过模型，尝试自动选中它
            if (config.model && data.data.some(m => m.id === config.model)) {
                modelSelect.value = config.model;
            }
            
            resultBox.style.color = 'green';
            resultBox.innerText = `✅ 成功探测到 ${data.data.length} 个模型维度`;
        } else {
            resultBox.style.color = 'red';
            resultBox.innerText = `❌ 拉取失败: ${data.error?.message || '请检查 URL 或 Key 是否正确'}`;
            modelSelect.innerHTML = '<option value="">拉取失败</option>';
        }
    } catch (error) {
        resultBox.style.color = 'red';
        resultBox.innerText = `❌ 网络错误: ${error.message} (检查URL是否包含 /v1)`;
        modelSelect.innerHTML = '<option value="">拉取失败</option>';
    }
}
// ==========================================
// 5. 自由摆阵 (拖拽与手动翻牌引擎)
// ==========================================
let highestZIndex = 10; 
let customDrawnCards = []; // 记录自由模式抽的牌

function startCustomTarot() {
    currentSpread = 'custom';
    customDrawnCards = [];
    shuffleDeck(); // 洗牌
    
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('tarot-screen').style.display = 'none';
    document.getElementById('custom-tarot-screen').style.display = 'flex';
    document.getElementById('custom-table').innerHTML = ''; // 清空桌面
    
    // ✨ 新增这行：每次进自由摆阵，确保解牌面板是隐藏的
    document.getElementById('custom-detail-panel').classList.remove('show'); 
}
// 当用户在牌堆上按下时触发，生成一张跟随手指的卡牌
function spawnDraggableCard(e) {
    if (currentDeck.length === 0) {
    AudioEngine.play('draw'); // ✨ 触发抽牌声
        alert("牌堆已空，无法再抽牌。");
        return;
    }
    
    const table = document.getElementById('custom-table');
    const tableRect = table.getBoundingClientRect();
    
    // 从牌堆拿走一张牌
    const cardData = currentDeck.pop();
    const isReversed = Math.random() < 0.5;
    const cardIndex = customDrawnCards.length;
    
    customDrawnCards.push({ index: cardIndex, data: cardData, isReversed: isReversed, flipped: false });

    // 创建 DOM 元素 (复用之前的 3D 翻转结构)
    const cardEl = document.createElement('div');
    cardEl.className = 'draggable-card-wrapper';
    cardEl.id = `custom-card-${cardIndex}`;
        cardEl.innerHTML = `
        <div class="card-inner" id="custom-inner-${cardIndex}">
            <div class="card-back"><div class="css-diamond"></div></div>
            <div class="card-front ${isReversed ? 'is-reversed' : ''}">
                <div class="card-seq">牌 ${cardIndex + 1}</div> <!-- ✨ 新增这行标号 -->
                <div class="card-name-zh">${cardData.nameZh}</div>
                <div class="card-status">${isReversed ? '逆位' : '正位'}</div>
            </div>
        </div>
    `;
    
    table.appendChild(cardEl);
    
    // 初始化卡牌位置 (居中偏下)
    let currentX = tableRect.width / 2 - 40;
    let currentY = tableRect.height - 150;
    cardEl.style.left = `${currentX}px`;
    cardEl.style.top = `${currentY}px`;
    cardEl.style.zIndex = ++highestZIndex;

    // 绑定拖拽与点击事件
    attachDragAndFlipLogic(cardEl, cardIndex);
}

// 物理交互核心逻辑
function attachDragAndFlipLogic(cardEl, index) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;
    
    // 指针按下 (兼容触摸与鼠标)
    cardEl.onpointerdown = (e) => {
        e.preventDefault();
        isDragging = true;
        cardEl.setPointerCapture(e.pointerId); // 锁定指针
        cardEl.style.zIndex = ++highestZIndex; // 置顶
        
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseFloat(cardEl.style.left) || 0;
        initialTop = parseFloat(cardEl.style.top) || 0;
    };

    // 指针移动
    cardEl.onpointermove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        cardEl.style.left = `${initialLeft + dx}px`;
        cardEl.style.top = `${initialTop + dy}px`;
    };

    // 指针抬起
    cardEl.onpointerup = (e) => {
        if (!isDragging) return;
        isDragging = false;
        cardEl.releasePointerCapture(e.pointerId);

        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        
        // 判定：如果移动距离非常小 (小于 5 像素)，说明是“点击”操作，执行翻牌
        // 判定：如果移动距离非常小 (小于 5 像素)，说明是“点击”操作，执行翻牌
        if (dx < 5 && dy < 5) {
            const cardObj = customDrawnCards.find(c => c.index === index);
            
            // 每次点击任何牌，先把可能开着的面板隐藏
            if (!cardObj.flipped) {
                AudioEngine.play('flip');         // 播放声音
                cardEl.classList.add('flipped');  // 触发翻转动画
                cardObj.flipped = true;           // 记录状态
                // 配合翻转动画的时长，等牌翻过来一半的时候，文字面板优雅浮现
                setTimeout(() => {
                    showCustomCardDetail(cardObj);
                }, 400); 
            } else {
                // 如果已经是翻开的牌，直接浮现面板
                showCustomCardDetail(cardObj);
            }
        }
    };
}

// 保存自由牌阵到历史记录
function saveCustomHistory() {
    if (customDrawnCards.length === 0) {
        alert("桌面上还没有牌！");
        return;
    }
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        type: 'tarot',   // ✨ 类型标记
        spread: '自由摆阵',
        cards: customDrawnCards.map(c => ({
            position: c.index,
            name: `牌${c.index + 1}: ${c.data.nameZh}`,
            status: c.isReversed ? '逆位' : '正位'
        }))
    };
    drawHistory.unshift(record);
    localStorage.setItem('aetherHistory', JSON.stringify(drawHistory));
    alert("牌阵已保存！你可以前往「解牌」室发送给 AI 进行深度解读。");
}
// 升级重置逻辑，让所有界面都能退回主菜单
function resetTarot() {
    document.getElementById('tarot-screen').style.display = 'none';
    document.getElementById('custom-tarot-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'flex';
}
// 唯美悬浮面板控制
function showCustomCardDetail(cardObj) {
    const panel = document.getElementById('custom-detail-panel');
    const titleEl = document.getElementById('custom-detail-title');
    const descEl = document.getElementById('custom-detail-desc');

    const status = cardObj.isReversed ? '逆位' : '正位';
    const meaning = cardObj.isReversed ? cardObj.data.meaningRev : cardObj.data.meaningUp;

    // 先移除类名，重置动画
    panel.classList.remove('show');
    
    // 延迟一瞬间更新内容并浮现，制造平滑的视觉过渡
    setTimeout(() => {
        titleEl.innerText = `✦ 牌 ${cardObj.index + 1} · ${cardObj.data.nameZh} (${status}) ✦`;
        descEl.innerText = meaning;
        AudioEngine.play('chime'); // ✨ 触发风铃声
        panel.classList.add('show');
    }, 50); 
}
// 一键清空自由桌面并重新洗牌
function clearCustomTable() {
    // 1. 防误触：如果桌面上已经有牌了，弹窗确认
    if (customDrawnCards.length > 0) {
        if (!confirm("这将会清空桌面上的所有卡牌，并重新洗牌。确认要重新开始吗？")) {
            return; // 用户点击取消，直接停止
        }
    }

    // 2. 清空桌面的卡牌 DOM 元素
    document.getElementById('custom-table').innerHTML = '';
    
    // 3. 隐藏可能还亮着的解牌面板
    document.getElementById('custom-detail-panel').classList.remove('show');
    
    // 4. 清空已抽卡牌的记录，并让宇宙重新洗牌
    customDrawnCards = [];
    shuffleDeck(); 
}
// ==========================================
// 6. 纯代码音效引擎 (Web Audio API，解决 iOS 无声问题)
// ==========================================
const AudioEngine = {
    ctx: null,
    init() {
        // 解锁苹果 iOS 的音频限制
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    play(type) {
        this.init();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        
        if (type === 'draw') {
            // 抽牌声：短促的低频滑动声 (模拟纸张摩擦)
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
            gain.gain.setValueAtTime(0.4, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'flip') {
            // 翻牌声：清脆的短音
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.exponentialRampToValueAtTime(50, t + 0.15);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.15);
        } else if (type === 'chime') {
            // 解析面板浮现：空灵的魔法风铃声 (多重和弦)
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                let osc = this.ctx.createOscillator();
                let gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, t);
                // 制造阶梯式的风铃拨弦感
                gain.gain.linearRampToValueAtTime(0.1, t + 0.05 + i * 0.08); 
                gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.08);
                osc.stop(t + 1.5);
            });
        }
    }
};

// 暴力解锁 iOS 音频限制：同时监听触摸和点击
const unlockAudio = () => { 
    AudioEngine.init(); 
    document.body.removeEventListener('touchstart', unlockAudio);
    document.body.removeEventListener('click', unlockAudio);
};
document.body.addEventListener('touchstart', unlockAudio, { once: true });
document.body.addEventListener('click', unlockAudio, { once: true });

// ==========================================
// 7. 一键生成海报 (截图黑科技)
// ==========================================
function exportImage() {
    const targetElement = document.getElementById('custom-tarot-screen');
    
    // 隐藏不想被截进去的元素（比如底部的牌堆提示）
    const deckArea = document.getElementById('deck-area');
    deckArea.style.display = 'none';
    
    // 弹出提示
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "⏳ 正在凝结画面...";

    // 稍微延迟一下，确保 UI 更新后再截图
    setTimeout(() => {
        html2canvas(targetElement, {
            backgroundColor: '#FAF9F6', // 使用咱们的极简背景色
            scale: 2, // 提高清晰度，适合视网膜屏幕
            useCORS: true // 允许跨域
        }).then(canvas => {
            // 恢复隐藏的元素
            deckArea.style.display = 'flex';
            btn.innerText = originalText;

            // 将 canvas 转化为图片并触发下载
            const link = document.createElement('a');
            link.download = `AETHER_Tarot_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            deckArea.style.display = 'flex';
            btn.innerText = originalText;
            alert("生成海报失败，请稍后再试。");
        });
    }, 100);
}
// ==========================================
// 8. 界面主题与 3D 星盘物理引擎
// ==========================================

// --- 黑夜模式切换 ---
function toggleTheme() {
    const root = document.documentElement;
    const btn = document.getElementById('theme-btn');
    AudioEngine.play('chime'); // 切换时播放空灵音效
    
    if (root.getAttribute('data-theme') === 'dark') {
        root.removeAttribute('data-theme');
        btn.innerText = '🌙';
        localStorage.setItem('aetherTheme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
        btn.innerText = '☀️';
        localStorage.setItem('aetherTheme', 'dark');
    }
}

// 初始化时读取本地主题
if (localStorage.getItem('aetherTheme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-btn').innerText = '☀️';
}

// --- 3D 星盘生成与陀螺仪物理 ---
const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const planets = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇'];

// 在环上均匀排列符号的函数
function populateRing(ringId, symbols, radius) {
    const ring = document.getElementById(ringId);
    if(!ring) return;
    ring.innerHTML = '';
    const angleStep = 360 / symbols.length;
    for (let i = 0; i < symbols.length; i++) {
        const symbolEl = document.createElement('div');
        symbolEl.className = 'astro-symbol';
        symbolEl.innerText = symbols[i];
        // 用极坐标计算每个符号的位置
        const radian = (i * angleStep) * (Math.PI / 180);
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        symbolEl.style.left = `calc(50% + ${x}px - 8px)`;
        symbolEl.style.top = `calc(50% + ${y}px - 10px)`;
        ring.appendChild(symbolEl);
    }
}

// 渲染符号 (外环半径 140，中环 98，内环 56)
setTimeout(() => {
    populateRing('ring-zodiac', zodiacSigns, 140);
    populateRing('ring-houses', ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'], 98);
    populateRing('ring-planets', planets, 56);
}, 500);

// --- 触摸拖拽 3D 旋转视角 ---
const wrapper = document.getElementById('astrolabe-wrapper');
const astrolabe = document.getElementById('astrolabe');
let isAstroDragging = false;
let astroStartX, astroStartY;
let currentRotX = 60; // 默认倾斜 60 度
let currentRotZ = 0;

if(wrapper) {
    wrapper.addEventListener('pointerdown', (e) => {
        isAstroDragging = true;
        astroStartX = e.clientX;
        astroStartY = e.clientY;
        wrapper.setPointerCapture(e.pointerId);
    });

    wrapper.addEventListener('pointermove', (e) => {
        if (!isAstroDragging) return;
        const deltaX = e.clientX - astroStartX;
        const deltaY = e.clientY - astroStartY;
        
        // 根据手指滑动改变 X轴(倾斜) 和 Z轴(自转)
        let newRotX = currentRotX - deltaY * 0.5;
        let newRotZ = currentRotZ + deltaX * 0.5;
        
        // 限制翻转角度，防止翻过去
        if(newRotX < 0) newRotX = 0; 
        if(newRotX > 85) newRotX = 85;

        astrolabe.style.transform = `rotateX(${newRotX}deg) rotateZ(${newRotZ}deg)`;
    });

    wrapper.addEventListener('pointerup', (e) => {
        if(!isAstroDragging) return;
        isAstroDragging = false;
        wrapper.releasePointerCapture(e.pointerId);
        
        // 记录最后的位置
        const deltaX = e.clientX - astroStartX;
        const deltaY = e.clientY - astroStartY;
        currentRotX = Math.max(0, Math.min(85, currentRotX - deltaY * 0.5));
        currentRotZ = currentRotZ + deltaX * 0.5;
    });
}
// --- AI 星象解码大师 ---
async function generateAstroReading() {
    const time = document.getElementById('astro-time').value;
    const city = document.getElementById('astro-city').value.trim();
    
    if (!time || !city) {
        alert("⚠️ 星辰找不到你的坐标，请输入出生时间和城市！");
        return;
    }
    if (!config.url || !config.key || !config.model) {
        alert("⚠️ 尚未连接宇宙信号！请先在右上角「设置」中配置好 AI API 接口。");
        return;
    }

    const btn = document.getElementById('astro-btn');
    const resultBox = document.getElementById('astro-result');
    const textEl = document.getElementById('astro-typewriter');
    
    // 播放魔法音效并显示加载状态
    AudioEngine.play('chime');
    btn.innerText = "⏳ 正在链接阿卡西记录...";
    btn.disabled = true;
    resultBox.style.display = 'block';
    textEl.innerHTML = "正在解析星辰的密语...\n(这可能需要几秒钟)";

    // ✨ 为占星定制的极品 Prompt (提示词)
    const sysMsg = { 
        role: "system", 
        content: "你是一位精通古典占星与现代心理学的神秘学大师。根据用户提供的出生时间与地点，用极其优雅、诗意、充满灵性的语言，为他们简要解析命盘核心特质（假设其大致的日、月、升星座能量，重在心理疗愈与灵魂指引，无需绝对物理精确）。字数控制在400字内，分段输出，并在最后附上一句专属的宇宙寄语。" 
    };
    const userMsg = { 
        role: "user", 
        content: `我降生于 ${time}，坐标是 ${city}。请大师为我解读星空赋予我的使命与性格特质。` 
    };

    try {
        const response = await fetch(`${config.url}/chat/completions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${config.key}` 
            },
            body: JSON.stringify({ 
                model: config.model, 
                messages: [sysMsg, userMsg] 
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.choices) {
            textEl.innerHTML = ''; // 清空等待提示
            // 复用塔罗牌的“打字机特效”打印出结果
            typeWriter(data.choices[0].message.content, 0, 'astro-typewriter');
        } else {
            textEl.innerHTML = `⚠️ 星象仪受干扰: ${data.error?.message || '未知错误'}`;
        }
    } catch (err) {
        textEl.innerHTML = `⚠️ 物质界网络断开: ${err.message}`;
    }
    
    // 恢复按钮
    btn.innerText = "✦ 重新凝结星盘 ✦";
    btn.disabled = false;
}
// ==========================================
// 9. 宇宙频率合成引擎 (声学物理修复版)
// ==========================================
let bgmPlayer = new Audio(); 
let activeSynthNodes = [];   

function openMeditationPanel() {
    document.getElementById('meditation-modal').style.display = 'flex';
}
function closeMeditationPanel() {
    document.getElementById('meditation-modal').style.display = 'none';
}

// 物理超度版停止功能 (苹果原生时间轴切断法)
function stopAudio() {
    bgmPlayer.pause();
    bgmPlayer.removeAttribute('src');
    bgmPlayer.load();
    
    if (AudioEngine.ctx && activeSynthNodes.length > 0) {
        const t = AudioEngine.ctx.currentTime;
        activeSynthNodes.forEach(node => {
            try {
                if (node.gain) {
                    // 撤销之前的音量计划，并在 0.1 秒内迅速衰减至 0（绝对不产生电流声）
                    node.gain.cancelScheduledValues(t);
                    node.gain.setTargetAtTime(0, t, 0.1); 
                } else if (node.stop) {
                    // 原生定时停止，抛弃不可靠的 setTimeout
                    node.stop(t + 0.5); 
                }
            } catch (e) {
                // 防止玄学报错
            }
        });
        activeSynthNodes = []; 
    }
    document.querySelectorAll('.audio-btn').forEach(btn => btn.classList.remove('active'));
}

// 纯代码合成冥想声波！(手机扬声器特化版)
function playPresetAudio(type, btnElement) {
    stopAudio(); 
    document.querySelectorAll('.audio-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    AudioEngine.init();
    const ctx = AudioEngine.ctx;
    const t = ctx.currentTime;

    if (type === 'hypnotic') {
        // 🌌 深度催眠脑波：频率提升到 320Hz，完美适配手机外放
        const osc1 = ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 320;
        const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 324; // 4Hz 催眠差值
        const drone = ctx.createOscillator(); drone.type = 'triangle'; drone.frequency.value = 160; 
        
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 600;
        drone.connect(filter);

        const gain = ctx.createGain(); gain.gain.value = 0;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 3);

        osc1.connect(gain); osc2.connect(gain); filter.connect(gain); gain.connect(ctx.destination);
        osc1.start(t); osc2.start(t); drone.start(t);
        
        activeSynthNodes.push(osc1, osc2, drone, gain);

    } else if (type === 'noise') {
        // 🌧️ 潜意识白噪：加重振幅，放宽低通滤波，制造出明显的呼啸感
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = (Math.random() * 2 - 1) * 0.8; }
        
        const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true;
        
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1200; 

        const gain = ctx.createGain(); gain.gain.value = 0;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 3);

        noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        noise.start(t);
        
        activeSynthNodes.push(noise, gain);

    } else if (type === 'bowl') {
        // 🥣 脉轮颂钵：提升至 F4 音阶 (349Hz)，增强环绕颤音
        const bowl = ctx.createOscillator(); bowl.type = 'sine'; bowl.frequency.value = 349.23; 
        const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 1.5; 
        
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.5; 
        lfo.connect(lfoGain);

        const mainGain = ctx.createGain(); mainGain.gain.value = 0;
        mainGain.gain.setValueAtTime(0, t);
        mainGain.gain.linearRampToValueAtTime(0.6, t + 3);

        lfoGain.connect(mainGain.gain); 
        bowl.connect(mainGain); mainGain.connect(ctx.destination);
        
        bowl.start(t); lfo.start(t);
        activeSynthNodes.push(bowl, lfo, mainGain);
    }
}

// 播放自定义链接
function playCustomAudio() {
    let url = document.getElementById('custom-audio-url').value.trim();
    if (!url) return;
    const neteaseMatch = url.match(/id=(\d+)/) || url.match(/^(\d+)$/);
    if (neteaseMatch) url = `https://music.163.com/song/media/outer/url?id=${neteaseMatch[1]}.mp3`;

    stopAudio(); 
    bgmPlayer.src = url;
    bgmPlayer.load();
    bgmPlayer.play().catch(e => alert("苹果安全机制拦截，建议使用预设的【冥想合成声波】。"));
}
// ==========================================
// 10. 摇签筒 求签引擎
// ==========================================
const QIAN_DATABASE = [
    { level: "上上签", poem: "天开地辟结良缘\n日吉时良万事全\n若得此签非小可\n人行中正帝王宣", desc: "大吉之兆。万事顺遂，所求皆得。只要你行事光明磊落、心存正念，必有贵人相助，前程一片光明。" },
    { level: "上吉签", poem: "营谋望事在春前\n相欠之中尚未全\n至意频频祈圣力\n荣华富贵福绵绵", desc: "吉。目前所谋之事虽尚有欠缺，但只要诚心坚持，时机一到便会圆满。富贵荣华，指日可待。" },
    { level: "中吉签", poem: "宝剑出匣耀光明\n在匣全然不惹尘\n今得贵人提携引\n马到成功在此行", desc: "中吉。你如同藏于匣中的宝剑，才华暂未显露。如今贵人将至，大胆出击，必能马到成功。" },
{ level: "中平签", poem: "看君来问心中事\n积善之家庆有余\n时运未亨且守旧\n待时而动免忧虑", desc: "平稳。当下时运未到通达之时，宜静守本分，多行善事。切莫躁进，待时机成熟再行动，可免忧虑。" },
    { level: "上吉签", poem: "一轮明月照天庭\n万里无云四海清\n忽遇一片云霭起\n登时阴影黑朦朦", desc: "吉中带提醒。目前局面清朗顺利，但需提防突如其来的小波折。保持警觉，乌云终会散去，重见光明。" },
    { level: "中吉签", poem: "莫听闲言与是非\n晨昏只好念阿弥\n若将先世根基倒\n竹篮提水几时盈", desc: "中吉。莫被外界流言扰乱心神，专注自身根本。守住根基踏实经营，方能避免徒劳无功。" },
    { level: "上上签", poem: "金乌西坠兔东升\n日夜循环至古今\n谁道天高难叫问\n须知天理藐然明", desc: "大吉。天理昭彰，循环有序。你心中的疑问终将得到上天回应，公道自在人心，无需忧惧。" },
    { level: "下下签", poem: "君今庚甲未亨通\n且向江头作钓翁\n玉兔渐东升海上\n待看明月正天中", desc: "暂为下签，需耐心。眼下时运受阻，宜如垂钓者般沉住气。困境只是暂时，光明会如东升的明月般如约而至。" },
    { level: "中平签", poem: "宽心且守暂时危\n切莫忧煎信祸非\n忍耐数年门户改\n时来终遇得明医", desc: "平。当前虽处困境，但切勿过度忧虑。忍耐与坚持是良药，熬过这段，自有转机与良人相助。" },
    { level: "上吉签", poem: "好将心地力耕耘\n彼此身心皆有春\n造化弄人君莫叹\n两家谋望两相成", desc: "吉。用心经营你所珍视的人与事，付出终有回报。莫怨命运，双方齐心，所愿皆可成就。" },
    { level: "中吉签", poem: "石藏无价玉和珍\n只为时乖在路边\n好把石头磨琢看\n何愁不遇做高官", desc: "中吉。你本是璞玉，只是暂未遇良机。沉下心来打磨自己，是金子终会发光，何愁前程？" },
    { level: "上上签", poem: "君家何事苦匆匆\n马上当头喜气浓\n一旦云开见明月\n谋财谋事尽亨通", desc: "大吉。不必焦虑奔忙，喜事就在眼前。拨云见月之时，无论求财求事，皆能畅通无阻。" },
    { level: "中平签", poem: "勤耕力作莫蹉跎\n衣食随时安乐窝\n纵使经商收倍利\n不如逐分积成多", desc: "平稳安康。脚踏实地、勤恳积累是你的福气所在。不必贪图暴利，细水长流方能积少成多。" },
    { level: "下签", poem: "病中若得苦心劳\n到底完全总未遭\n去后不须回头问\n切恐他时事又遭", desc: "下签，宜谨慎。近期诸事易反复劳神，切忌瞻前顾后、犹豫不决。下决定后便果断前行，避免再生枝节。" },
    { level: "上吉签", poem: "登山涉水正天寒\n兄弟同行那畏难\n临到面前为运至\n贵人接引上金鞍", desc: "吉。前路虽有艰险寒冷，但有同伴相助则无所畏惧。坚持到底，贵人将助你一臂之力，登上高位。" },
    { level: "中吉签", poem: "一年作事急如飞\n君尔何须问吉凶\n祸福分明天数定\n何须问我此根宗", desc: "中吉。这一年你行动迅捷、成果可期。吉凶自有天定，与其反复问卜，不如把握当下、全力以赴。" },
    { level: "上上签", poem: "鲸鱼未化守江湖\n未许升腾离碧波\n异日运通雷雨至\n禹门一跳过龙门", desc: "大吉之兆。你如蛰伏的鲸鱼，正积蓄力量。一旦时运来临、风雷际会，必能一跃龙门，扶摇直上。" },
    { level: "中平签", poem: "幼年争斗为家财\n手足如同陌路开\n如今劝你和为贵\n莫待时迟空自哀", desc: "平，重在和睦。莫为利益伤了亲近之人的情分。以和为贵，及时修复关系，否则错过便追悔莫及。" },
    { level: "上吉签", poem: "锦上添花色色新\n运来谁不识斯文\n一朝雨露成功后\n富贵荣华万象新", desc: "吉。好运连连，喜上加喜。当下正是你大展身手之时，一番努力之后，将迎来焕然一新的富贵景象。" },
    { level: "中吉签", poem: "于今此景正当时\n看看欲吐百花魁\n若能遇得春色到\n一洒清香满世人", desc: "中吉。你正处于绽放前夕，如含苞待放的花魁。只要春风一到，你的才华与魅力将惊艳所有人。" },
    { level: "下签", poem: "庸医如何敢妄行\n炼丹学到老君门\n金丹一粒人难买\n不如修身养自心", desc: "下签，宜内省。莫向外强求难得之物，盲目行事易出差错。回归本心、修身养性，才是当下最好的良方。" },
    { level: "上上签", poem: "一木开花便结实\n开枝散叶满堂红\n人间富贵天来定\n何用区区作小工", desc: "大吉。开花即结果，繁荣昌盛、子孙满堂之象。福气由天注定，你的格局远大，无需拘泥于眼前小事。" },
    { level: "中平签", poem: "欲求胜事可非常\n争奈亲姻日暂忙\n到头竹篮提水事\n力心空费枉徒劳", desc: "平，需调整方向。所求之事看似美好，却因诸多牵绊难以成就。审视方法是否得当，避免白费力气。" },
    { level: "上吉签", poem: "万里晴空一镜悬\n光明清彻照无偏\n谁知此景为君兆\n福禄绵绵自有缘", desc: "吉。如万里晴空、明镜高悬，前景一片光明公正。这正是为你而来的好兆头，福禄绵延，皆是良缘。" },
    { level: "中吉签", poem: "君今百事且随缘\n水到渠成天自全\n但改新衣过旧岁\n更须方寸好为人", desc: "中吉。凡事随缘，水到渠成。辞旧迎新之际，端正心念、与人为善，福报自会降临。" }
];

let currentQian = null;
let isShaking = false;

function shakeQian() {
    if (isShaking) return; // 防止连点
    isShaking = true;

    const tube = document.getElementById('qian-tube');
    const tip = document.getElementById('qian-tip');
    const result = document.getElementById('qian-result');

    // 先把上一次结果藏起来
    result.style.display = 'none';
    tip.innerText = "签筒摇动中... 命运正在显现";

    // 播放摇签的"竹签碰撞"声
    AudioEngine.play('draw');
    tube.classList.add('shaking');

    // 摇晃动画结束后，弹出签
    setTimeout(() => {
        tube.classList.remove('shaking');
        AudioEngine.play('chime'); // 出签的清脆声

        // 随机抽一支签
        const idx = Math.floor(Math.random() * QIAN_DATABASE.length);
        currentQian = { ...QIAN_DATABASE[idx], num: idx + 1 };  // ✨ 记住签号
        const qianNum = idx + 1;

        document.getElementById('qian-num').innerText = `第 ${qianNum} 签`;
        document.getElementById('qian-level').innerText = currentQian.level;
        document.getElementById('qian-poem').innerText = currentQian.poem;
        document.getElementById('qian-desc').innerText = currentQian.desc;

        tip.innerText = "诚心所至，签文已现";
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });

        isShaking = false;
    }, 600);
}

function resetQian() {
    document.getElementById('qian-result').style.display = 'none';
    document.getElementById('qian-tip').innerText = "轻触签筒摇出你的命运之签";
    document.getElementById('qian-tube').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 把当前签文带到 AI 解牌室
function askQianToAI() {
    if (!currentQian) return;
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        type: 'qian',
        spread: `第${currentQian.num}签`,
        summary: `${currentQian.level}，签文：${currentQian.poem.replace(/\n/g, '，')}。白话签解：${currentQian.desc}`
    };
    drawHistory.unshift(record);
    localStorage.setItem('aetherHistory', JSON.stringify(drawHistory));
    alert("✦ 此签已存入「解牌」室历史 ✦\n前往解牌室点 📎 勾选它，就能写下你想问的话，让 AI 结合签文解答。");
}
// ==========================================
// 11. 掷圣杯 引擎
// ==========================================
let isThrowing = false;
let currentJiao = null;

function throwJiao() {
    if (isThrowing) return; // 防止动画期间连点
    isThrowing = true;

    AudioEngine.play('draw'); // 抛出的声音
    document.getElementById('jiao-result').style.display = 'none';
    document.getElementById('jiao-tip').innerText = "圣杯飞旋，神明聆听中...";

    const blocks = [
        document.querySelector('#jiao-1 .jiao-block'),
        document.querySelector('#jiao-2 .jiao-block')
    ];

    // 每个杯子各自随机：round=凸面朝上, flat=平面朝上
    const faces = blocks.map(() => Math.random() < 0.5 ? 'round' : 'flat');

    blocks.forEach((block, i) => {
        // 重置动画（强制浏览器重新播放）
        block.classList.remove('jiao-throwing');
        void block.offsetWidth; // 触发重排，这一步是关键

        // 随机转 2 或 3 整圈，再加上最终落地的那一面
        const spins = (2 + Math.floor(Math.random() * 2)) * 360;
        const landing = faces[i] === 'round' ? 0 : 180; // 凸面朝上=0, 平面朝上=180
        block.style.setProperty('--end-rot', `${spins + landing}deg`);

        block.classList.add('jiao-throwing');
    });

    // 动画结束后定格 + 出结果
    setTimeout(() => {
        AudioEngine.play('flip'); // 落地"咔哒"声
        showJiaoResult(faces);
        isThrowing = false;
    }, 1250);
}

function showJiaoResult(faces) {
    const flatCount = faces.filter(f => f === 'flat').length;
    let name, desc;

    if (flatCount === 1) {
        // 一平一凸
        name = "聖 筊";
        desc = "一平一凸，圣杯成对。神明应允你所求之事，可安心前行。这是最吉的答覆，代表「是、同意、可行」。心之所向，皆有回应。";
    } else if (flatCount === 2) {
        // 两个平面
        name = "笑 筊";
        desc = "双平面朝上，神明含笑不语。或是所问之事尚不清晰，或是时机未到。请沉淀心绪、把问题想得更具体些，再诚心掷一次。";
    } else {
        // 两个凸面
        name = "陰 筊";
        desc = "双凸面朝上，神明轻轻摇首。此事暂不宜，或答案为「否」。莫要强求，不妨换个角度重新请示，或静待更合适的时机降临。";
    }

    currentJiao = { name, desc };
    document.getElementById('jiao-result-name').innerText = name;
    document.getElementById('jiao-result-desc').innerText = desc;
    document.getElementById('jiao-tip').innerText = "神明已应，圣杯落定";

    const r = document.getElementById('jiao-result');
    r.style.display = 'block';
    AudioEngine.play('chime');
    r.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 把掷筊结果带到 AI 解牌室
function askJiaoToAI() {
    if (!currentJiao) return;
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        type: 'jiao',
        spread: '掷筊',
        summary: `掷出【${currentJiao.name}】：${currentJiao.desc}`
    };
    drawHistory.unshift(record);
    localStorage.setItem('aetherHistory', JSON.stringify(drawHistory));
    alert("✦ 此卦已存入「解牌」室历史 ✦\n前往解牌室点 📎 勾选它，就能写下你想问的话，让 AI 结合卦象解答。");
}