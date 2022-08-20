import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import axios from '../axios';
import ItemList from '../components/ItemList';
import { ApiPath } from '../constants';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const Item = () => {
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
      .get(ApiPath.ITEM + 'team/' + id)
      .then(response => {
        const apiData = response.data;
        apiData.forEach(targetItem => {
          const item = {
            id: targetItem.item_id,
            title: targetItem.title,
            price: targetItem.price,
            pubDate: targetItem.publication_date,
            masterId: targetItem.item_m_id,
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
        <Button className="button-pink" value="17" onClick={() => handleChange(17)}>SixTONES</Button>
        <Button className="button-pink" value="6" onClick={() => handleChange(6)}>SnowMan</Button>
        <Button className="button-pink" value="7" onClick={() => handleChange(7)}>関ジャニ∞</Button>
        <Button className="button-pink" value="8" onClick={() => handleChange(8)}>SexyZone</Button>
        <Button className="button-pink" value="9" onClick={() => handleChange(9)}>TOKIO</Button>
        <Button className="button-pink" value="10" onClick={() => handleChange(10)}>V6</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(11)}>嵐</Button>
        <Button className="button-pink" value="12" onClick={() => handleChange(12)}>NEWS</Button>
        <Button className="button-pink" value="13" onClick={() => handleChange(13)}>Kis-My-Ft2</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(14)}>ABC-Z</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(15)}>ジャニーズWEST</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(16)}>King&Prince</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(17)}>SixTONES</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(18)}>なにわ男子</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(19)}>Hey!Say!JUMP</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(20)}>KAT-TUN</Button>
        <Button className="button-pink" value="11" onClick={() => handleChange(21)}>Kinki Kids</Button>
        <h2>{h2}</h2>
        <ItemList itemList={itemList} teamId={id} />
      </div>
    </div>
  );
};

export default Item;
