import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import axios from '../axios';
import Loading from '../components/Loading';
import TvList from '../components/TvList';
import { ApiPath } from '../constants';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const All = () => {
  // TV一覧リストのSTATES
  const [tvList, setTvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [h2, setH2] = useState('');

  // TV全件取得
  const getAllTv = useCallback(async (id) => {
    if (id !== undefined) {
        setButton(id);
    }
    const list = [];
    await axios
      .get(ApiPath.TV + 'team/' + id + '?limit=20')
      .then(response => {
        const apiData = response.data;
        apiData.forEach(targetItem => {
          const program = {
            id: targetItem.program_id,
            title: targetItem.title,
            description: targetItem.description,
            date: targetItem.on_air_date,
          };
          list.push(program);
        });
        setTvList(list);
        // setIsLoading(false);
      })
      .catch(error => {console.log("TV koko")});
   }, []);

  useEffect(() => {
    getAllTv(6);
    setIsLoading(false);
  }, [getAllTv]);

  const handleChange = e => {
    getAllTv(e);
  };

  const setButton = e => {
    switch (e) {
      case 6:
        setH2('SnowMan');
        break;
      case 7:
        setH2('関ジャニ∞');
        break;
      case 8:
        setH2('SexyZone');
        break;
      case 9:
        setH2('TOKIO');
        break;
      case 10:
        setH2('V6');
        break;
      case 11:
        setH2('嵐');
        break;
      case 12:
        setH2('NEWS');
        break;
      case 13:
        setH2('Kis-My-Ft2');
        break;
      case 14:
        setH2('ABC-Z');
        break;
      case 15:
        setH2('ジャニーズWEST');
        break;
      case 16:
        setH2('King&Prince');
        break;
      case 17:
        setH2('SixTONES');
        break;
      case 18:
        setH2('なにわ男子');
        break;
      case 19:
        setH2('Hey!Say!JUMP');
        break;
      case 20:
        setH2('KAT-TUN');
        break;
      case 21:
        setH2('Kinki Kids');
        break;
      default:
        setH2('SnowMan');
        break;
    }
  }

  return (
    <div>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <Btn value="17" onClick={() => handleChange(17)}>SixTONES</Btn>
          <Btn value="6" onClick={() => handleChange(6)}>SnowMan</Btn>
          <Btn value="7" onClick={() => handleChange(7)}>関ジャニ∞</Btn>
          <Btn value="8" onClick={() => handleChange(8)}>SexyZone</Btn>
          <Btn value="9" onClick={() => handleChange(9)}>TOKIO</Btn>
          <Btn value="10" onClick={() => handleChange(10)}>V6</Btn>
          <Btn value="11" onClick={() => handleChange(11)}>嵐</Btn>
          <Btn value="12" onClick={() => handleChange(12)}>NEWS</Btn>
          <Btn value="13" onClick={() => handleChange(13)}>Kis-My-Ft2</Btn>
          <Btn value="11" onClick={() => handleChange(14)}>ABC-Z</Btn>
          <Btn value="11" onClick={() => handleChange(15)}>ジャニーズWEST</Btn>
          <Btn value="11" onClick={() => handleChange(16)}>King&Prince</Btn>
          <Btn value="11" onClick={() => handleChange(17)}>SixTONES</Btn>
          <Btn value="11" onClick={() => handleChange(18)}>なにわ男子</Btn>
          <Btn value="11" onClick={() => handleChange(19)}>Hey!Say!JUMP</Btn>
          <Btn value="11" onClick={() => handleChange(20)}>KAT-TUN</Btn>
          <Btn value="11" onClick={() => handleChange(21)}>Kinki Kids</Btn>
          <h2>{h2}</h2>
          <TvList tvList={tvList} />
        </div>
      )}
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'white',
});

export default All;