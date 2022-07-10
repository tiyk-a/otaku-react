import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useCallback, useEffect, useState } from 'react';
import { NumberParam, useQueryParam } from 'use-query-params';
import axios from '../axios';
import ItemMList from '../components/ItemMList';
import history from '../history';
import MediaQuery from "react-responsive";

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const Top = () => {
  const [teamId, setTeamId] = useQueryParam('teamId', NumberParam);

  // 商品一覧リストのSTATES
  const [itemList, setItemList] = useState([]);
  const [itemMList, setItemMList] = useState([]);
  const [errJList, setErrJList] = useState([]);
  const [id, setId] = useState('');
  const [menuFlg, setMenuFlg] = useState(false);
  // 未確認データ件数
  const [numbers, setNumbers] = useState({});

  // 商品全件取得
  const getTeamItems = useCallback(async (id) => {
    var path = '';
    var tmpTeamId = null;

    // Top画面リクエストならallメソッドでデータ取ってくる。それ以外はチームのを取って送る
    if (id !== undefined && id !== 5) {
      setId(id);
      tmpTeamId = id;
    } else if (teamId !== undefined || teamId !== 5) {
      setId(teamId);
      tmpTeamId = teamId;
    } else {
      setId(17);
      tmpTeamId = 17;
    }

    path = 'api/' + tmpTeamId;

    await axios
      .get(path)
      .then(response => {
        const i = response.data.i;
        const im = response.data.im;
        const errJ = response.data.errJ;

        // 未確認データ件数
        const numbers = response.data.itemNumberMap;
        
        // item(w/o IM)
        if (i !== null) {
          // imのない未来のilist
          const ilist = [];
        
          i.forEach(item => {

            const tmpMemIdList = [];
            item.memIdList.forEach(rel => {
              tmpMemIdList.push(rel);
            });

            // teamIdListが単にteamEnumから全レコードのidを取ってきている場合、各itemで取得する必要ないのでは
            const ele = {
              id: item.item.item_id,
              title: item.item.title,
              price: item.item.price,
              pubDate: item.item.publication_date,
              wpId: item.item.im_id,
              relList: item.relList,
              relMList: item.relMemList,
              memList: item.memIdList,
            };
            ilist.push(ele);
          });
          setItemList(ilist);
        }

        // IM
        if (im !== null) {
          // 未来のimlist
          const imlist = [];

          im.forEach(itemM => {

            // relListから必要な情報を抜き出す
            var wpId = '';
            itemM.relList.forEach(rel => {
              // wpIdを取得したい
              if (rel.team_id === id) {
                wpId = rel.wp_id;
              }
            });

            const m = {
              id: itemM.im.im_id,
              title: itemM.im.title,
              price: itemM.im.price,
              pubDate: itemM.im.publication_date,
              image: itemM.im.amazon_image,
              wpId: wpId,
              ver: itemM.verList,
              relList: itemM.relList,
              relMList: itemM.relMemList,
              blog_not_updated: itemM.im.blog_not_updated,
            };
          imlist.push(m);
          });
          setItemMList(imlist);
        }

        if (errJ !== null) {
          // errorJsonのリスト
          const errlist = [];
          
          errJ.forEach(j => {
            console.log(j);
            const ele = {
              id: j.errj_id,
              teamId: j.team_id,
              json: j.json,
            };
            errlist.push(ele);
          });
          setErrJList(errlist);
        }

        if (numbers !== null) {
          setNumbers(numbers);
        }
      }).catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  }, []);

  useEffect(() => {

    if (teamId === undefined) {
      setTeamId(5);
    }
    getTeamItems(teamId);
    
  }, [getTeamItems]);

  const handleChange = e => {
    history.push('/?teamId=' + e);
    getTeamItems(e);
  };

  const selected = {
    opacity: 0.5,
  }

  // ハンバーガーメニューをハンドルする
  const toggleMenu = () => {
    if (menuFlg) {
      setMenuFlg(false);
    } else {
      setMenuFlg(true);
    }
  }

  return (
    <div>
      <MediaQuery query="(min-width: 767px)">
        {/* PC */}
        <Btn value="17" onClick={() => handleChange(17)} style={id === 17 ? selected : null}>SixTONES<span className='itemNumber'>{numbers[17]}</span></Btn>
        <Btn value="6" onClick={() => handleChange(6)} style={id === 6 ? selected : null}>SnowMan<span className='itemNumber'>{numbers[6]}</span></Btn>
        <Btn value="16" onClick={() => handleChange(16)} style={id === 16 ? selected : null}>King&Prince<span className='itemNumber'>{numbers[16]}</span></Btn>
        <Btn value="18" onClick={() => handleChange(18)} style={id === 18 ? selected : null}>なにわ男子<span className='itemNumber'>{numbers[18]}</span></Btn>
        <Btn value="8" onClick={() => handleChange(8)} style={id === 8 ? selected : null}>SexyZone<span className='itemNumber'>{numbers[8]}</span></Btn>
        <Btn value="7" onClick={() => handleChange(7)} style={id === 7 ? selected : null}>関ジャニ∞<span className='itemNumber'>{numbers[7]}</span></Btn>
        <Btn value="13" onClick={() => handleChange(13)} style={id === 13 ? selected : null}>Kis-My-Ft2<span className='itemNumber'>{numbers[13]}</span></Btn>
        <Btn value="15" onClick={() => handleChange(15)} style={id === 15 ? selected : null}>ジャニーズWEST<span className='itemNumber'>{numbers[15]}</span></Btn>
        <Btn value="19" onClick={() => handleChange(19)} style={id === 19 ? selected : null}>Hey!Say!JUMP<span className='itemNumber'>{numbers[19]}</span></Btn>
        <Btn value="14" onClick={() => handleChange(14)} style={id === 14 ? selected : null}>ABC-Z<span className='itemNumber'>{numbers[14]}</span></Btn>
        <Btn value="20" onClick={() => handleChange(20)} style={id === 20 ? selected : null}>KAT-TUN<span className='itemNumber'>{numbers[20]}</span></Btn>
        <Btn value="12" onClick={() => handleChange(12)} style={id === 12 ? selected : null}>NEWS<span className='itemNumber'>{numbers[12]}</span></Btn>
        <Btn value="21" onClick={() => handleChange(21)} style={id === 21 ? selected : null}>Kinki Kids<span className='itemNumber'>{numbers[21]}</span></Btn>
        <Btn value="9" onClick={() => handleChange(9)} style={id === 9 ? selected : null}>TOKIO<span className='itemNumber'>{numbers[9]}</span></Btn>
        <Btn value="10" onClick={() => handleChange(10)} style={id === 10 ? selected : null}>V6<span className='itemNumber'>{numbers[10]}</span></Btn>
        <Btn value="11" onClick={() => handleChange(11)} style={id === 11 ? selected : null}>嵐<span className='itemNumber'>{numbers[11]}</span></Btn>
      </MediaQuery>
      <MediaQuery query="(max-width: 519px)">
        {/* SP */}
        <div id="outer-container">
          <div class="hamburger-menu" onClick={toggleMenu}>
            {menuFlg ? (
              ""
            ) : (
              <label for="menu-btn-check" class="menu-btn" onClick={toggleMenu}>
                <span></span>
              </label>
            )}
            {menuFlg ? (
              <div>
                <label for="menu-btn-check" class="menu-btn-hover" onClick={toggleMenu}>
                  <span></span>
                </label>
                <div class="menu-content">
                  <Btn value="17" onClick={() => handleChange(17)} style={id === 17 ? selected : null}>SixTONES<span className='itemNumber'>{numbers[17]}</span></Btn>
                  <Btn value="6" onClick={() => handleChange(6)} style={id === 6 ? selected : null}>SnowMan<span className='itemNumber'>{numbers[6]}</span></Btn>
                  <Btn value="16" onClick={() => handleChange(16)} style={id === 16 ? selected : null}>King&Prince<span className='itemNumber'>{numbers[16]}</span></Btn>
                  <Btn value="18" onClick={() => handleChange(18)} style={id === 18 ? selected : null}>なにわ男子<span className='itemNumber'>{numbers[18]}</span></Btn>
                  <Btn value="8" onClick={() => handleChange(8)} style={id === 8 ? selected : null}>SexyZone<span className='itemNumber'>{numbers[8]}</span></Btn>
                  <Btn value="7" onClick={() => handleChange(7)} style={id === 7 ? selected : null}>関ジャニ∞<span className='itemNumber'>{numbers[7]}</span></Btn>
                  <Btn value="13" onClick={() => handleChange(13)} style={id === 13 ? selected : null}>Kis-My-Ft2<span className='itemNumber'>{numbers[13]}</span></Btn>
                  <Btn value="15" onClick={() => handleChange(15)} style={id === 15 ? selected : null}>ジャニーズWEST<span className='itemNumber'>{numbers[15]}</span></Btn>
                  <Btn value="19" onClick={() => handleChange(19)} style={id === 19 ? selected : null}>Hey!Say!JUMP<span className='itemNumber'>{numbers[19]}</span></Btn>
                  <Btn value="14" onClick={() => handleChange(14)} style={id === 14 ? selected : null}>ABC-Z<span className='itemNumber'>{numbers[14]}</span></Btn>
                  <Btn value="20" onClick={() => handleChange(20)} style={id === 20 ? selected : null}>KAT-TUN<span className='itemNumber'>{numbers[20]}</span></Btn>
                  <Btn value="12" onClick={() => handleChange(12)} style={id === 12 ? selected : null}>NEWS<span className='itemNumber'>{numbers[12]}</span></Btn>
                  <Btn value="21" onClick={() => handleChange(21)} style={id === 21 ? selected : null}>Kinki Kids<span className='itemNumber'>{numbers[21]}</span></Btn>
                  <Btn value="9" onClick={() => handleChange(9)} style={id === 9 ? selected : null}>TOKIO<span className='itemNumber'>{numbers[9]}</span></Btn>
                  <Btn value="10" onClick={() => handleChange(10)} style={id === 10 ? selected : null}>V6<span className='itemNumber'>{numbers[10]}</span></Btn>
                  <Btn value="11" onClick={() => handleChange(11)} style={id === 11 ? selected : null}>嵐<span className='itemNumber'>{numbers[11]}</span></Btn>
                </div>
              </div>
            ) : ("") }
          </div>
        </div>
      </MediaQuery>
      <MediaQuery query="(min-width: 520px) and (max-width: 959px)">
        {/* tablet */}
        <Btn value="17" onClick={() => handleChange(17)} style={id === 17 ? selected : null}>SixTONES<span className='itemNumber'>{numbers[17]}</span></Btn>
        <Btn value="6" onClick={() => handleChange(6)} style={id === 6 ? selected : null}>SnowMan<span className='itemNumber'>{numbers[6]}</span></Btn>
        <Btn value="16" onClick={() => handleChange(16)} style={id === 16 ? selected : null}>King&Prince<span className='itemNumber'>{numbers[16]}</span></Btn>
        <Btn value="18" onClick={() => handleChange(18)} style={id === 18 ? selected : null}>なにわ男子<span className='itemNumber'>{numbers[18]}</span></Btn>
        <Btn value="8" onClick={() => handleChange(8)} style={id === 8 ? selected : null}>SexyZone<span className='itemNumber'>{numbers[8]}</span></Btn>
        <Btn value="7" onClick={() => handleChange(7)} style={id === 7 ? selected : null}>関ジャニ∞<span className='itemNumber'>{numbers[7]}</span></Btn>
        <Btn value="13" onClick={() => handleChange(13)} style={id === 13 ? selected : null}>Kis-My-Ft2<span className='itemNumber'>{numbers[13]}</span></Btn>
        <Btn value="15" onClick={() => handleChange(15)} style={id === 15 ? selected : null}>ジャニーズWEST<span className='itemNumber'>{numbers[15]}</span></Btn>
        <Btn value="19" onClick={() => handleChange(19)} style={id === 19 ? selected : null}>Hey!Say!JUMP<span className='itemNumber'>{numbers[19]}</span></Btn>
        <Btn value="14" onClick={() => handleChange(14)} style={id === 14 ? selected : null}>ABC-Z<span className='itemNumber'>{numbers[14]}</span></Btn>
        <Btn value="20" onClick={() => handleChange(20)} style={id === 20 ? selected : null}>KAT-TUN<span className='itemNumber'>{numbers[20]}</span></Btn>
        <Btn value="12" onClick={() => handleChange(12)} style={id === 12 ? selected : null}>NEWS<span className='itemNumber'>{numbers[12]}</span></Btn>
        <Btn value="21" onClick={() => handleChange(21)} style={id === 21 ? selected : null}>Kinki Kids<span className='itemNumber'>{numbers[21]}</span></Btn>
        <Btn value="9" onClick={() => handleChange(9)} style={id === 9 ? selected : null}>TOKIO<span className='itemNumber'>{numbers[9]}</span></Btn>
        <Btn value="10" onClick={() => handleChange(10)} style={id === 10 ? selected : null}>V6<span className='itemNumber'>{numbers[10]}</span></Btn>
        <Btn value="11" onClick={() => handleChange(11)} style={id === 11 ? selected : null}>嵐<span className='itemNumber'>{numbers[11]}</span></Btn>
      </MediaQuery>
      <div>
        {
          function() {
            return (
              <div>
                <ItemMList itemList={itemList} itemMList={itemMList} teamId={id} errJList={errJList} />
              </div>
            )
          }()
        }
      </div>
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: '#FFF2F2',
  margin: '10px 0',
  color: 'black',
});

export default Top;
