import React, {useState} from 'react';
import { Button, Input } from '@material-ui/core';
import PM from '../components/PM';
import Program from '../components/Program';
import axios from '../axios';
import { ApiPath } from '../constants';
import styled from '@material-ui/styles/styled';
import NativeSelect from '@mui/material/NativeSelect';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const TvList = ({tvList, pmList, teamId, candPmList}) => {

  const [pmSearchRes, setPmSearchRes] = useState([]);
  const [otherPmTitle, setOtherPmTitle] = useState("");
  const [pmId, setPmId] = useState(0);
  const [pmKey, setPmKey] = useState('');

  /**
   * DBからPM検索
   * 
   * @param {} key 
   */
  const searchOtherPm = async (key) => {
    await axios
      .get(ApiPath.PM + 'search?key=' + key)
      .then(response => {
        setPmSearchRes(response.data);
        if (response.data.length === 0) {
          window.alert("0 data hit :(");
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  }

  const handleChangeOtherPMTitle = e => {
    var txt = null;
    if (e.target.value !== "0") {
      txt = e.target.value;
    }

    setPmId(txt);
    var searchResFlg = false;

    // searchresの場合、そこからIDとか取って入れてあげる
    pmSearchRes.forEach(pm => {
      if (pm.pm_id === txt) {
        setOtherPmTitle(pm.title);
        searchResFlg = true;
      }
    });

    // pmの場合、PMからIDとか取って入れてあげる
    if (!searchResFlg) {
      if (txt === null) {
        setPmId(0);
      } else {
        pmList.forEach(pm => {
          if (pm.pm_id === txt) {
            setPmId(txt);
            setOtherPmTitle(pm.title);
          }
        });
      }
    }
  };

  const searchPmByKw = (e) => {
    if (e.keyCode === 13) {
      searchOtherPm(pmKey);
      setPmKey("");
    }
  }

  const handleChangePmKey = e => {
    const txt = e.target.value;
    setPmKey(txt);
  };

  // 対象Itemを一括でIM登録します
  const bundlePm = async() => {
    var elems = document.getElementsByClassName("target_p");
    const data = [];

    Array.from(elems).forEach((e) => {
      if (e.dataset.pmid === null || e.dataset.pmid === "") {

        const prel = [];
        if (e.dataset.prel !== undefined && e.dataset.prel !== null) {
          var arrPrel = e.dataset.prel.split(",");
          var j = 0;
          while (arrPrel[j]!== undefined && arrPrel[j+1]!== undefined && arrPrel[j+2]!== undefined) {
            prel.push([Number(arrPrel[j]), Number(arrPrel[j+1]), Number(arrPrel[j+2])]);
            j = j + 4;
          }
        }

        const prelm = [];
        if (e.dataset.prelm !== undefined && e.dataset.prelm !== null) {
          var arrPrelM = e.dataset.prelm.split(",");
          var k = 0;
          while (arrPrel[j]!== undefined && arrPrel[j+1]!== undefined && arrPrel[j+2]!== undefined) {
            prelm.push([Number(arrPrelM[k]), Number(arrPrelM[k+1]), Number(arrPrelM[k+2])]);
            k = k + 4;
          }
        }
        
        const p = {
          program_id: e.id,
          pm_id: e.dataset.pmid,
          teamId: e.dataset.teamid,
          description: e.dataset.description,
          pmrel: prel,
          pmrelm: prelm,
          title: e.dataset.title,
          // on_air_date: e.dataset.date,
          del_flg: false,
        }
        data.push(p);
      }
    });

    await axios
      .post(ApiPath.PM + "bundle/new", data)
      .then(response => {
        if (response.data) {
          if (teamId !== null && teamId !== undefined && !window.location.href.includes("teamId=")) {
            window.location.href = window.location.href + "?teamId=" + teamId;
          }
          //  else {
          //   window.location.href = window.location.href;
          // }
        } else {
          window.alert("登録エラーです");
          console.log(response);
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  }

  // 対象Pを一括で削除します
  const bundleDelP = async() => {
    window.alert("一括削除しますか？");
    var elems = document.getElementsByClassName("target_p");
    const data = [];
    Array.from(elems).forEach((e) => {
      data.push(e.id);
    });

    await axios
      .post(ApiPath.TV + "bundle/del_p", data)
      .then(response => {
        if (response.data) {
          if (teamId !== null && teamId !== undefined && !window.location.href.includes("teamId=")) {
            window.location.href = window.location.href + "?teamId=" + teamId;
          }
          //  else {
          //   window.location.href = window.location.href;
          // }
        } else {
          window.alert("登録エラーです");
          console.log(response);
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
  }

  return (
    <div className="allItemsList">
      <h2>Program <Btn onClick={bundlePm}>一括登録</Btn> <Btn onClick={bundleDelP}>一括削除</Btn></h2>
      <p>PM検索: {pmId}</p>
      <p>まだ検索しかできません</p>
      <Input
        type="text"
        name="PM search"
        value={pmKey}
        onChange={handleChangePmKey}
        placeholder="pm keyword"
        className="titleInput"
        onKeyDown={searchPmByKw}
      />
      {pmSearchRes.length > 0 ? (
        <NativeSelect
          labelId="demo-simple-select-label"
          id="other-team-im"
          defaultValue=""
          value={otherPmTitle}
          label="PM候補"
          onChange={handleChangeOtherPMTitle}
        >
          {pmSearchRes.map((e, index) => (
            <option key={index} value={e.pm_id}>
              {e.title} 📺 {e.description}
            </option>
          ))}
          <option key={0} value={0}>
            N/A
          </option>
        </NativeSelect>
      ) : (
        <NativeSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          defaultValue=""
          value={otherPmTitle}
          label="PM候補"
          onChange={handleChangeOtherPMTitle}
        >
          {pmList.length > 0 ? (
            pmList.map((e, index) => (
            <option key={index} value={e.pm_id}>
              {e.title}
            </option>
          ))) : (
            ""
          )}
          <option key={0} value={0}>
            N/A
          </option>
        </NativeSelect>
      )}
      {tvList !== undefined && tvList.length > 0 ? (
        tvList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Program program={e} teamId={teamId} key={e.id} candPmList={candPmList} />
          </div>
        ))
      ) : (
        <div>
          <h1>TVデータが見つかりませんでした:(</h1>
        </div>
      )}
      <Btn onClick={bundlePm}>一括登録</Btn> <Btn onClick={bundleDelP}>一括削除</Btn>
      <h2>PM</h2>
      {pmList !== undefined && pmList.length > 0 ? (
        pmList.map((e, index) => (
          <div className="itemBox" key={index}>
            <PM pm={e} teamId={teamId} key={e.id} />
          </div>
        ))
      ) : (
        <div>
          <h1>PM見つかりませんでした:(</h1>
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
  background: '#FFF2F2',
  color: 'black',
});

export default TvList;
