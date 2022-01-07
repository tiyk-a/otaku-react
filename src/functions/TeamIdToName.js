exports.teamIdToName = function(teamId) {

    var result = '';

    switch (teamId) {
        case 5:
            result = 'All';
            break;
        case 6:
            result = 'SnowMan';
            break;
        case 7:
            result = '関ジャニ∞';
            break;
        case 8:
            result = 'SexyZone';
            break;
        case 9:
            result = 'TOKIO';
            break;
        case 10:
            result = 'V6';
            break;
        case 11:
            result = '嵐';
            break;
        case 12:
            result = 'NEWS';
            break;
        case 13:
            result = 'Kis-My-Ft2';
            break;
        case 14:
            result = 'ABC-Z';
            break;
        case 15:
            result = 'ジャニーズWEST';
            break;
        case 16:
            result = 'King&Prince';
            break;
        case 17:
            result = 'SixTONES';
            break;
        case 18:
            result = 'なにわ男子';
            break;
        case 19:
            result = 'Hey!Say!JUMP';
            break;
        case 20:
            result = 'KAT-TUN';
            break;
        case 21:
            result = 'Kinki Kids';
            break;
        default:
            result = 'noid:' + teamId;
            break;
        }
    return result;
};

exports.nameToTeamId = function(teamName) {

    var result = '';

    switch (teamName) {
        case 'All':
            result = 5;
            break;
        case 'SnowMan':
            result = 6;
            break;
        case '関ジャニ∞':
            result = 7;
            break;
        case 'SexyZone':
            result = 8;
            break;
        case 'TOKIO':
            result = 9;
            break;
        case 'V6':
            result = 10;
            break;
        case '嵐':
            result = 11;
            break;
        case 'NEWS':
            result = 12;
            break;
        case 'Kis-My-Ft2':
            result = 13;
            break;
        case 'ABC-Z':
            result = 14;
            break;
        case 'ジャニーズWEST':
            result = 15;
            break;
        case 'King&Prince':
            result = 16;
            break;
        case 'SixTONES':
            result = 17;
            break;
        case 'なにわ男子':
            result = 18;
            break;
        case 'Hey!Say!JUMP':
            result = 19;
            break;
        case 'KAT-TUN':
            result = 20;
            break;
        case 'Kinki Kids':
            result = 21;
            break;
        default:
            result = 0;
            break;
        }
    return result;
};
