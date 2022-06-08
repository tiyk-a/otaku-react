import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import axios from '../axios';
import ItemMList from '../components/ItemMList';
import { ApiPath } from '../constants';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const ItemM = () => {
  // 商品一覧リストのSTATES
  const [itemList, setItemList] = useState([]);
  const [h2, setH2] = useState('');
  const [id, setId] = useState('');

  // 商品全件取得
  const getTeamItems = useCallback(async (id) => {
    if (id !== undefined) {
      setId(id);
      setButton(id);
    }
    const list = [];
    await axios
      .get(ApiPath.IM + 'team/' + id)
      .then(response => {
        const apiData = response.data;
        apiData.forEach(targetItem => {
          const item = {
            id: targetItem.item_id,
            title: targetItem.title,
            price: targetItem.price,
            pubDate: targetItem.publication_date,
          };
          list.push(item);
        });
        setItemList(list);
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  }, []);

  useEffect(() => {
    getTeamItems(6);
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
        <ItemMList itemList={itemList} teamId={id} />
      </div>
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: '#db36a4',
  margin: '10px 0',
  color: 'black',
});

export default ItemM;
