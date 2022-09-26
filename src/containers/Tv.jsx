import { Button } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { NumberParam, useQueryParam } from 'use-query-params';
import axios from '../axios';
import TvList from '../components/TvList';
import { ApiPath } from '../constants';
import history from '../history';
import MediaQuery from "react-responsive";

/**
 * TVトップページコンテナ
 *
 */
const All = () => {
  // TV一覧リストのSTATES
  const [tvList, setTvList] = useState([]);
  const [pmList, setPmList] = useState([]);
  const [teamId, setTeamId] = useQueryParam('teamId', NumberParam);
  const [id, setId] = useState('');
  const [menuFlg, setMenuFlg] = useState(false);

  // 未確認データ件数
  const [numbers, setNumbers] = useState({});

  // TV全件取得
  const getAllTv = useCallback(async (id) => {

    var tmpTeamId = null;
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

    setTvList([]);
    const list = [];
    const pmlist = [];
    await axios
      .get(ApiPath.TV + tmpTeamId)
      .then(response => {
        const pList = response.data.p;
        pList.forEach(data => {
          const pData = data.program;
          const program = {
            id: pData.program_id,
            title: pData.title,
            description: pData.description,
            url: pData.url,
            date: pData.on_air_date,
            station_id: pData.station_id,
            station_name: data.station_name,
            teamArr: stringToArr(pData.teamArr),
            memArr: stringToArr(pData.memArr),
            relPmList: data.relPmList,
          };
          list.push(program);
        });

        list.sort(function(first, second){
          if (first.id > second.id){
            return -1;
          }else if (first.id < second.id){
            return 1;
          }else{
            return 0;
          }
        });
        setTvList(list);

        const pmList = response.data.pm;
        pmList.forEach(data => {
          const pData = data.pm;
          const pm = {
            id: pData.pm_id,
            title: pData.title,
            description: pData.description,
            date: pData.on_air_date,
            teamArr: stringToArr(pData.teamArr),
            memArr: stringToArr(pData.memArr),
            stationArr: stringToArr(pData.stationArr),
            verList: data.verList,
          };
          pmlist.push(pm);
        });

        pmlist.sort(function(first, second){
          if (first.id > second.id){
            return -1;
          }else if (first.id < second.id){
            return 1;
          }else{
            return 0;
          }
        });
        setPmList(pmlist);

        // 未確認データ件数
        var tvCount = 0;
        if (response.data.pnumberMap !== undefined) {
          var map = {};
          Object.keys(response.data.pnumberMap).forEach(function (key) {
            tvCount = tvCount + response.data.pnumberMap[key];
            map[key] = response.data.pnumberMap[key];
          });
          setNumbers(map);
        }

        // 1件以上未確認ITEMがあれば数をヘッダーに表示してあげる
        if (tvCount > 0) {
          var elem = document.getElementsByClassName('header-pm');
          // HTML構造にとっても依存！！
          elem[0].innerHTML = "<p>PM <span class='itemNumber'>" + tvCount + "</span></p>";
        }

        // 1件以上未確認ITEM件数があれば数をヘッダーに表示してあげる
        if (response.data.itemCount !== undefined && response.data.tvCount > 0) {
          var elem = document.getElementsByClassName('header-im');
          // HTML構造にとっても依存！！
          elem[0].innerHTML = "<p>IM <span class='itemNumber'>" + response.data.itemCount + "</span></p>";
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
   }, [teamId]);

  useEffect(() => {
    getAllTv(5);
  }, [getAllTv]);

  const handleChange = e => {
    setTeamId(e);
    setId(e);
    history.push('/tv?teamId=' + e);
    getAllTv(e);
  };

  // ハンバーガーメニューをハンドルする
  const toggleMenu = () => {
    if (menuFlg) {
      setMenuFlg(false);
    } else {
      setMenuFlg(true);
    }
  }

  const stringToArr = (str) => {
    if (str === null || str === undefined) {
      return [];
    }
    
    var tmpArr = str.split(",");
    if (tmpArr.includes("")) {
      tmpArr.splice(tmpArr.indexOf(""), 1);
    }
    return tmpArr;
  }

  return (
    <div>
      <MediaQuery query="(min-width: 767px)">
        {/* PC */}
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="6" onClick={() => handleChange(6)}>SnowMan<span className='itemNumber'>{numbers[6] > 0 ? numbers[6] : ""}</span></Button>
        <Button className={id === 7 ? "selected button-pink" : "button-pink"} value="7" onClick={() => handleChange(7)}>関ジャニ∞<span className='itemNumber'>{numbers[7] > 0 ? numbers[7] : ""}</span></Button>
        <Button className={id === 8 ? "selected button-pink" : "button-pink"} value="8" onClick={() => handleChange(8)}>SexyZone<span className='itemNumber'>{numbers[8] > 0 ? numbers[8] : ""}</span></Button>
        <Button className={id === 9 ? "selected button-pink" : "button-pink"} value="9" onClick={() => handleChange(9)}>TOKIO<span className='itemNumber'>{numbers[9] > 0 ? numbers[9] : ""}</span></Button>
        <Button className={id === 10 ? "selected button-pink" : "button-pink"} value="10" onClick={() => handleChange(10)}>V6<span className='itemNumber'>{numbers[10] > 0 ? numbers[10] : ""}</span></Button>
        <Button className={id === 11 ? "selected button-pink" : "button-pink"} value="11" onClick={() => handleChange(11)}>嵐<span className='itemNumber'>{numbers[11] > 0 ? numbers[11] : ""}</span></Button>
        <Button className={id === 12 ? "selected button-pink" : "button-pink"} value="12" onClick={() => handleChange(12)}>NEWS<span className='itemNumber'>{numbers[12] > 0 ? numbers[12] : ""}</span></Button>
        <Button className={id === 13 ? "selected button-pink" : "button-pink"} value="13" onClick={() => handleChange(13)}>Kis-My-Ft2<span className='itemNumber'>{numbers[13] > 0 ? numbers[13] : ""}</span></Button>
        <Button className={id === 14 ? "selected button-pink" : "button-pink"} value="14" onClick={() => handleChange(14)}>ABC-Z<span className='itemNumber'>{numbers[14] > 0 ? numbers[14] : ""}</span></Button>
        <Button className={id === 15 ? "selected button-pink" : "button-pink"} value="15" onClick={() => handleChange(15)}>ジャニーズWEST<span className='itemNumber'>{numbers[15] > 0 ? numbers[15] : ""}</span></Button>
        <Button className={id === 16 ? "selected button-pink" : "button-pink"} value="16" onClick={() => handleChange(16)}>King&Prince<span className='itemNumber'>{numbers[16] > 0 ? numbers[16] : ""}</span></Button>
        <Button className={id === 17 ? "selected button-pink" : "button-pink"} value="17" onClick={() => handleChange(17)}>SixTONES<span className='itemNumber'>{numbers[17] > 0 ? numbers[17] : ""}</span></Button>
        <Button className={id === 18 ? "selected button-pink" : "button-pink"} value="18" onClick={() => handleChange(18)}>なにわ男子<span className='itemNumber'>{numbers[18] > 0 ? numbers[18] : ""}</span></Button>
        <Button className={id === 19 ? "selected button-pink" : "button-pink"} value="19" onClick={() => handleChange(19)}>Hey!Say!JUMP<span className='itemNumber'>{numbers[19] > 0 ? numbers[19] : ""}</span></Button>
        <Button className={id === 20 ? "selected button-pink" : "button-pink"} value="20" onClick={() => handleChange(20)}>KAT-TUN<span className='itemNumber'>{numbers[20] > 0 ? numbers[20] : ""}</span></Button>
        <Button className={id === 21 ? "selected button-pink" : "button-pink"} value="21" onClick={() => handleChange(21)}>Kinki Kids<span className='itemNumber'>{numbers[21] > 0 ? numbers[21] : ""}</span></Button></MediaQuery>
      <MediaQuery query="(max-width: 519px)">
        {/* SP */}
        <div id="outer-container">
          <div class="hamburger-menu" onClick={toggleMenu}>
            {menuFlg ? (
              ""
            ) : (
              <label for="menu-Button-check" class="menu-Button" onClick={toggleMenu}>
                <span></span>
              </label>
            )}
            {menuFlg ? (
              <div>
                <label for="menu-Button-check" class="menu-Button-hover" onClick={toggleMenu}>
                  <span></span>
                </label>
                <div class="menu-content">
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="6" onClick={() => handleChange(6)}>SnowMan<span className='itemNumber'>{numbers[6] > 0 ? numbers[6] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="7" onClick={() => handleChange(7)}>関ジャニ∞<span className='itemNumber'>{numbers[7] > 0 ? numbers[7] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="8" onClick={() => handleChange(8)}>SexyZone<span className='itemNumber'>{numbers[8] > 0 ? numbers[8] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="9" onClick={() => handleChange(9)}>TOKIO<span className='itemNumber'>{numbers[9] > 0 ? numbers[9] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="10" onClick={() => handleChange(10)}>V6<span className='itemNumber'>{numbers[10] > 0 ? numbers[10] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="11" onClick={() => handleChange(11)}>嵐<span className='itemNumber'>{numbers[11] > 0 ? numbers[11] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="12" onClick={() => handleChange(12)}>NEWS<span className='itemNumber'>{numbers[12] > 0 ? numbers[12] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="13" onClick={() => handleChange(13)}>Kis-My-Ft2<span className='itemNumber'>{numbers[13] > 0 ? numbers[13] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="14" onClick={() => handleChange(14)}>ABC-Z<span className='itemNumber'>{numbers[14] > 0 ? numbers[14] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="15" onClick={() => handleChange(15)}>ジャニーズWEST<span className='itemNumber'>{numbers[15] > 0 ? numbers[15] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="16" onClick={() => handleChange(16)}>King&Prince<span className='itemNumber'>{numbers[16] > 0 ? numbers[16] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="17" onClick={() => handleChange(17)}>SixTONES<span className='itemNumber'>{numbers[17] > 0 ? numbers[17] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="18" onClick={() => handleChange(18)}>なにわ男子<span className='itemNumber'>{numbers[18] > 0 ? numbers[18] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="19" onClick={() => handleChange(19)}>Hey!Say!JUMP<span className='itemNumber'>{numbers[19] > 0 ? numbers[19] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="20" onClick={() => handleChange(20)}>KAT-TUN<span className='itemNumber'>{numbers[20] > 0 ? numbers[20] : ""}</span></Button>
                  <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="21" onClick={() => handleChange(21)}>Kinki Kids<span className='itemNumber'>{numbers[21] > 0 ? numbers[21] : ""}</span></Button>
                </div>
              </div>
            ) : ("") }
          </div>
        </div>
      </MediaQuery> 
      <MediaQuery query="(min-width: 520px) and (max-width: 959px)">
        {/* tablet */}
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="6" onClick={() => handleChange(6)}>SnowMan<span className='itemNumber'>{numbers[6] > 0 ? numbers[6] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="7" onClick={() => handleChange(7)}>関ジャニ∞<span className='itemNumber'>{numbers[7] > 0 ? numbers[7] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="8" onClick={() => handleChange(8)}>SexyZone<span className='itemNumber'>{numbers[8] > 0 ? numbers[8] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="9" onClick={() => handleChange(9)}>TOKIO<span className='itemNumber'>{numbers[9] > 0 ? numbers[9] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="10" onClick={() => handleChange(10)}>V6<span className='itemNumber'>{numbers[10] > 0 ? numbers[10] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="11" onClick={() => handleChange(11)}>嵐<span className='itemNumber'>{numbers[11] > 0 ? numbers[11] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="12" onClick={() => handleChange(12)}>NEWS<span className='itemNumber'>{numbers[12] > 0 ? numbers[12] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="13" onClick={() => handleChange(13)}>Kis-My-Ft2<span className='itemNumber'>{numbers[13] > 0 ? numbers[13] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="14" onClick={() => handleChange(14)}>ABC-Z<span className='itemNumber'>{numbers[14] > 0 ? numbers[14] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="15" onClick={() => handleChange(15)}>ジャニーズWEST<span className='itemNumber'>{numbers[15] > 0 ? numbers[15] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="16" onClick={() => handleChange(16)}>King&Prince<span className='itemNumber'>{numbers[16] > 0 ? numbers[16] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="17" onClick={() => handleChange(17)}>SixTONES<span className='itemNumber'>{numbers[17] > 0 ? numbers[17] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="18" onClick={() => handleChange(18)}>なにわ男子<span className='itemNumber'>{numbers[18] > 0 ? numbers[18] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="19" onClick={() => handleChange(19)}>Hey!Say!JUMP<span className='itemNumber'>{numbers[19] > 0 ? numbers[19] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="20" onClick={() => handleChange(20)}>KAT-TUN<span className='itemNumber'>{numbers[20] > 0 ? numbers[20] : ""}</span></Button>
        <Button className={id === 6 ? "selected button-pink" : "button-pink"} value="21" onClick={() => handleChange(21)}>Kinki Kids<span className='itemNumber'>{numbers[21] > 0 ? numbers[21] : ""}</span></Button>
      </MediaQuery>
      <div>
        <TvList tvList={tvList} pmList={pmList} teamId={teamId} />
      </div>
    </div>
  );
};

export default All;
