const teamList = [
    {id: 4, name: '未選択'},
    {id: 5, name: 'All'},
    {id: 6, name: 'SnowMan'},
    {id: 7, name: '関ジャニ∞'},
    {id: 8, name: 'SexyZone'},
    {id: 9, name: 'TOKIO'},
    {id: 10, name: 'V6'},
    {id: 11, name: '嵐'},
    {id: 12, name: 'NEWS'},
    {id: 13, name: 'Kis-My-Ft2'},
    {id: 14, name: 'ABC-Z'},
    {id: 15, name: 'ジャニーズWEST'},
    {id: 16, name: 'King&Prince'},
    {id: 17, name: 'SixTONES'},
    {id: 18, name: 'なにわ男子'},
    {id: 19, name: 'Hey!Say!JUMP'},
    {id: 20, name: 'KAT-TUN'},
    {id: 21, name: 'Kinki Kids'}
];

const memberList = [
    {id: 30, name: '未選択', teamId: 4},
    {id: 31, name: '岩本照', teamId: 6},
    {id: 32, name: '深澤辰哉', teamId: 6},
    {id: 33, name: '渡辺翔太', teamId: 6},
    {id: 34, name: '阿部亮平', teamId: 6},
    {id: 35, name: '宮舘涼太', teamId: 6},
    {id: 36, name: '佐久間大介', teamId: 6},
    {id: 37, name: '向井康二', teamId: 6},
    {id: 38, name: '目黒蓮', teamId: 6},
    {id: 39, name: 'ラウール', teamId: 6},
    {id: 40, name: '横山裕', teamId: 7},
    {id: 41, name: '村上信五', teamId: 7},
    {id: 42, name: '丸山隆平', teamId: 7},
    {id: 43, name: '安田章大', teamId: 7},
    {id: 44, name: '大倉忠義', teamId: 7},
    {id: 45, name: '中島健人', teamId: 8},
    {id: 46, name: '菊池風磨', teamId: 8},
    {id: 47, name: '佐藤勝利', teamId: 8},
    {id: 48, name: '松島聡', teamId: 8},
    {id: 49, name: 'マリウス葉', teamId: 8},
    {id: 50, name: 'ジェシー', teamId: 17},
    {id: 51, name: '京本大我', teamId: 17},
    {id: 52, name: '松村北斗', teamId: 17},
    {id: 53, name: '田中樹', teamId: 17},
    {id: 54, name: '高地優吾', teamId: 17},
    {id: 55, name: '森本慎太郎', teamId: 17},
    {id: 56, name: '平野紫耀', teamId: 16},
    {id: 57, name: '永瀬廉', teamId: 16},
    {id: 58, name: '髙橋海人', teamId: 16},
    {id: 59, name: '岸優太', teamId: 16},
    {id: 60, name: '神宮寺勇太', teamId: 16},
    {id: 61, name: '城島茂', teamId: 9},
    {id: 62, name: '国分太一', teamId: 9},
    {id: 63, name: '松岡昌宏', teamId: 9},
    {id: 64, name: '坂本昌行', teamId: 10},
    {id: 65, name: '長野博', teamId: 10},
    {id: 66, name: '井ノ原快彦', teamId: 10},
    {id: 67, name: '森田剛', teamId: 10},
    {id: 68, name: '三宅健', teamId: 10},
    {id: 69, name: '岡田准一', teamId: 10},
    {id: 70, name: '大野智', teamId: 11},
    {id: 71, name: '櫻井翔', teamId: 11},
    {id: 72, name: '相葉雅紀', teamId: 11},
    {id: 73, name: '二宮和也', teamId: 11},
    {id: 74, name: '松本潤', teamId: 11},
    {id: 75, name: '小山慶一郎', teamId: 12},
    {id: 76, name: '増田貴久', teamId: 12},
    {id: 77, name: '加藤シゲアキ', teamId: 12},
    {id: 78, name: '北山宏光', teamId: 13},
    {id: 79, name: '横尾渉', teamId: 13},
    {id: 80, name: '藤ヶ谷太輔', teamId: 13},
    {id: 81, name: '宮田俊哉', teamId: 13},
    {id: 82, name: '玉森裕太', teamId: 13},
    {id: 83, name: '二階堂高嗣', teamId: 13},
    {id: 84, name: '千賀健永', teamId: 13},
    {id: 85, name: '五関晃一', teamId: 14},
    {id: 86, name: '戸塚祥太', teamId: 14},
    {id: 87, name: '塚田僚一', teamId: 14},
    {id: 88, name: '河合郁人', teamId: 14},
    {id: 89, name: '橋本良亮', teamId: 14},
    {id: 90, name: '中間淳太', teamId: 15},
    {id: 91, name: '濱田崇裕', teamId: 15},
    {id: 92, name: '桐山照史', teamId: 15},
    {id: 93, name: '重岡大毅', teamId: 15},
    {id: 94, name: '神山智洋', teamId: 15},
    {id: 95, name: '藤井流星', teamId: 15},
    {id: 96, name: '小瀧望', teamId: 15},
    {id: 97, name: '西畑大吾', teamId: 18},
    {id: 98, name: '大西流星', teamId: 18},
    {id: 99, name: '道枝駿佑', teamId: 18},
    {id: 100, name: '高橋恭平', teamId: 18},
    {id: 101, name: '長尾謙杜', teamId: 18},
    {id: 102, name: '藤原丈一郎', teamId: 18},
    {id: 103, name: '大橋和也', teamId: 18}
];

exports.teamIdToName = function(teamId) {
    var res = teamList.find(t => t.id === teamId);
    if (res === undefined) {
        res = 'Null';
    } else {
        res = res.name;
    }
    return res;
};

exports.nameToTeamId = function(teamName) {
    var res = teamList.find(t => t.name === teamName);
    if (res === undefined) {
        res = 5;
    } else {
        res = res.id;
    }
    return res;
};

exports.getAllTeam = function() {
    return teamList;
}

exports.memberIdToName = function(memberId) {
    var res = memberList.find(m => m.id === memberId);
    if (res === undefined) {
        res = 'Null';
    } else {
        res = res.name;
    }
    return res;
};

exports.nameToMemberId = function(memberName) {
    var res = memberList.find(m => m.name === memberName);
    if (res === undefined) {
        res = 5;
    } else {
        res = res.id;
    }
    return res;
};

exports.getAllMember = function() {
    return memberList;
}

exports.getMemberObjListOfTeam = function(teamIdArg) {
    const tmpList = [];
    memberList.forEach((e) => {
        if (e.teamId === teamIdArg) {
            tmpList.push(e);
        }
    })
    return tmpList;
}

// 引数のmemberIdのteamIdを返します
exports.getTeamIdOfMember = function(memberId) {
    var memObject = memberList.find(m => m.id === memberId);
    return memObject.teamId;
}
