import React, { useEffect, useState } from 'react';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const TeamIdToName = ({teamId}) => {

    useEffect(() => {
        findTeamName(teamId);
    }, []);

    const [teamName, setTeamName] = useState('');

    const findTeamName = e => {
        switch (e) {
        case 5:
            setTeamName('All');
            break;
        case 6:
            setTeamName('SnowMan');
            break;
        case 7:
            setTeamName('関ジャニ∞');
            break;
        case 8:
            setTeamName('SexyZone');
            break;
        case 9:
            setTeamName('TOKIO');
            break;
        case 10:
            setTeamName('V6');
            break;
        case 11:
            setTeamName('嵐');
            break;
        case 12:
            setTeamName('NEWS');
            break;
        case 13:
            setTeamName('Kis-My-Ft2');
            break;
        case 14:
            setTeamName('ABC-Z');
            break;
        case 15:
            setTeamName('ジャニーズWEST');
            break;
        case 16:
            setTeamName('King&Prince');
            break;
        case 17:
            setTeamName('SixTONES');
            break;
        case 18:
            setTeamName('なにわ男子');
            break;
        case 19:
            setTeamName('Hey!Say!JUMP');
            break;
        case 20:
            setTeamName('KAT-TUN');
            break;
        case 21:
            setTeamName('Kinki Kids');
            break;
        default:
            setTeamName('SnowMan');
            break;
        }
    }

  return (
    <p>{teamName}</p>
  );
};

export default TeamIdToName;
