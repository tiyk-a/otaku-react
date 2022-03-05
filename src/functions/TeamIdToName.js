const teamList = [
    {id: 4, name: '未選択', cal: '<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FTokyo&showTitle=1&title=%E5%85%A8%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97%E4%BA%88%E5%AE%9A&src=b2Y1bnE5bzlnNGs1cGoxMWJ2dDFycjUxNjhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=cGpsb2pzbXBpNnZqaG11NHYzdmU2YTVqbG9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MW1vbDRhcjcwbjljaDQ3MzdyZzhzNmJzM2tAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=OTN2NDJqZDNtNXRrZjJlN2s0MmZhMWlkMzRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MTZvMm1yZ2pmc2NwdGk0cGliOXN0bWEwYjhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bjM1ZnJzY2o2ZHMxcDZuZm9wa2RvNjB2bWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=dnVuaDZzNmYzbjVlbWluMmtiM2NndjEyNzhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=a21pa2oxaXVzZDNqOHJxdXRhNDBhZHFqZWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=a2FuNzFycm1iNDJsMm1oMXFucDVicjFoYjBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=Z2ZiNnJzOTE0MHRkN2V0bWJ1cDRxZXU5NWNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ampyN250bTcyYmhtMmtwbXU3aW00cDhkZTBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=aml2Zm5kYjV0bDJqaHJpZTNqajBtZzNyZjRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW5mNjQ3cTBrYTJpamozNW45aWJ2bWRiYmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=aWNvNHQ5bWxoOWZkNHNtYzQ3cHRmMmczaDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZmRiNGw1YXA0YzkwYWxhdHZpa3FxcDZkZm9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MXNiOGZiMG5sdTJsN3Q4aGMxZnNuY2F1MmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23A79B8E&color=%234285F4&color=%238E24AA&color=%23F4511E&color=%23D81B60&color=%23B39DDB&color=%23B39DDB&color=%23B39DDB&color=%239E69AF&color=%23AD1457&color=%23795548&color=%237986CB&color=%23F6BF26&color=%23EF6C00&color=%23B39DDB&color=%23C0CA33" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 5, name: 'All', cal: '<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FTokyo&showTitle=1&title=%E5%85%A8%E3%82%B0%E3%83%AB%E3%83%BC%E3%83%97%E4%BA%88%E5%AE%9A&src=b2Y1bnE5bzlnNGs1cGoxMWJ2dDFycjUxNjhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=cGpsb2pzbXBpNnZqaG11NHYzdmU2YTVqbG9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MW1vbDRhcjcwbjljaDQ3MzdyZzhzNmJzM2tAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=OTN2NDJqZDNtNXRrZjJlN2s0MmZhMWlkMzRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MTZvMm1yZ2pmc2NwdGk0cGliOXN0bWEwYjhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bjM1ZnJzY2o2ZHMxcDZuZm9wa2RvNjB2bWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=dnVuaDZzNmYzbjVlbWluMmtiM2NndjEyNzhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=a21pa2oxaXVzZDNqOHJxdXRhNDBhZHFqZWtAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=a2FuNzFycm1iNDJsMm1oMXFucDVicjFoYjBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=Z2ZiNnJzOTE0MHRkN2V0bWJ1cDRxZXU5NWNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ampyN250bTcyYmhtMmtwbXU3aW00cDhkZTBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=aml2Zm5kYjV0bDJqaHJpZTNqajBtZzNyZjRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW5mNjQ3cTBrYTJpamozNW45aWJ2bWRiYmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=aWNvNHQ5bWxoOWZkNHNtYzQ3cHRmMmczaDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZmRiNGw1YXA0YzkwYWxhdHZpa3FxcDZkZm9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=MXNiOGZiMG5sdTJsN3Q4aGMxZnNuY2F1MmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23A79B8E&color=%234285F4&color=%238E24AA&color=%23F4511E&color=%23D81B60&color=%23B39DDB&color=%23B39DDB&color=%23B39DDB&color=%239E69AF&color=%23AD1457&color=%23795548&color=%237986CB&color=%23F6BF26&color=%23EF6C00&color=%23B39DDB&color=%23C0CA33" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 6, name: 'SnowMan', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=gfb6rs9140td7etmbup4qeu95c%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 7, name: '関ジャニ∞', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=1sb8fb0nlu2l7t8hc1fsncau2g%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 8, name: 'SexyZone', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=kmikj1iusd3j8rquta40adqjek%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 9, name: 'TOKIO', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=jjr7ntm72bhm2kpmu7im4p8de0%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 10, name: 'V6', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=jivfndb5tl2jhrie3jj0mg3rf4%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 11, name: '嵐', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=fdb4l5ap4c90alatvikqqp6dfo%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 12, name: 'NEWS', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=vunh6s6f3n5emin2kb3cgv1278%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 13, name: 'Kis-My-Ft2', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=n35frscj6ds1p6nfopkdo60vmk%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 14, name: 'ABC-Z', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=of5nq9o9g4k5pj11bvt1rr5168%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 15, name: 'ジャニーズWEST', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=ico4t9mlh9fd4smc47ptf2g3h8%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 16, name: 'King&Prince', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=93v42jd3m5tkf2e7k42fa1id34%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 17, name: 'SixTONES', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=kan71rrmb42l2mh1qnp5br1hb0%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 18, name: 'なにわ男子', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=enf647q0ka2ijj35n9ibvmdbbg%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 19, name: 'Hey!Say!JUMP', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=pjlojsmpi6vjhmu4v3ve6a5jlo%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 20, name: 'KAT-TUN', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=1mol4ar70n9ch4737rg8s6bs3k%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'},
    {id: 21, name: 'Kinki Kids', cal: '<iframe src="https://calendar.google.com/calendar/embed?src=16o2mrgjfscpti4pib9stma0b8%40group.calendar.google.com&ctz=Asia%2FTokyo" style="border: 0" width="800" height="600" frameborder="0" scrolling="no"></iframe>'}
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
    {id: 103, name: '大橋和也', teamId: 18},
    {id: 104, name: '山田涼介', teamId: 19},
    {id: 105, name: '知念侑李', teamId: 19},
    {id: 106, name: '中島裕翔', teamId: 19},
    {id: 107, name: '有岡大貴', teamId: 19},
    {id: 108, name: '高木雄也', teamId: 19},
    {id: 109, name: '伊野尾慧', teamId: 19},
    {id: 110, name: '八乙女光', teamId: 19},
    {id: 111, name: '薮宏太', teamId: 19},
    {id: 112, name: '亀梨和也', teamId: 20},
    {id: 113, name: '上田竜也', teamId: 20},
    {id: 114, name: '中丸雄一', teamId: 20},
    {id: 115, name: '堂本光一', teamId: 21},
    {id: 116, name: '堂本剛', teamId: 21}
];

exports.teamIdToName = function(teamId) {
    if (typeof teamId === 'string') {
        teamId = Number(teamId)
    }
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
    if (typeof memberId === 'string') {
        memberId = Number(memberId)
    }

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

// カレンダーhtmlを返します
exports.getCal = function(teamId) {
    var teamObject = teamList.find(t => t.id === teamId);
    return teamObject.cal;
}
