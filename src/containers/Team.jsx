import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import axios from '../axios';
import ItemList from '../components/ItemList';
import Loading from '../components/Loading';
import { ApiPath } from '../constants';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const Team = () => {
  // 商品一覧リストのSTATES
  const [itemList, setItemList] = useState([]);
  const [h2, setH2] = useState('');
  const [teamId, setTeamId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 商品全件取得
  const getTeamItems = useCallback(async (id) => {
    if (id !== undefined) {
        setTeamId(id);
        setButton(id);
    }
    const list = [];
    await axios
      .get(ApiPath.IM + 'team/' + id + '?limit=20')
      .then(response => {
        const apiData = response.data;
        apiData.forEach(targetItem => {
          const item = {
            id: targetItem.item_m_id,
            title: targetItem.title,
            description: targetItem.item_caption,
            price: targetItem.price,
            pubDate: targetItem.publication_date,
          };
          list.push(item);
        });
        setItemList(list);
      })
      .catch(error => {console.log("IM koko")});
  }, []);

  useEffect(() => {
    getTeamItems(6);
    setIsLoading(false);
  }, [getTeamItems]);

  const handleChange = e => {
    getTeamItems(e);
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
      case 17:
        setH2('SixTONES');
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
          <h2>{h2}</h2>
          <ItemList itemList={itemList} teamId={teamId} />
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

export default Team;