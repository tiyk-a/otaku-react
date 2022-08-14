import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React from 'react';
import axios from '../axios';
import PM from '../components/PM';
import Program from '../components/Program';
import { ApiPath } from '../constants';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const TvList = ({tvList, pmList, regPmList, teamId}) => {

  // 対象Itemを一括でIM登録します
  const bundlePm = async() => {
    var elems = document.getElementsByClassName("target_p");
    const data = [];

    Array.from(elems).forEach((e) => {
      if (e.dataset.pmid === null || e.dataset.pmid === "") {
        
        // TODO: VERを追加しないといけない！！
        const p = {
          program_id: e.id,
          pm_id: e.dataset.pmid,
          teamId: e.dataset.teamid,
          description: e.dataset.description,
          teamArr: e.dataset.teamarr,
          memArr: e.dataset.memarr,
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
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
          window.location.href = newUrl2;
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
    var res = window.confirm("一括削除しますか？");
    if (res === false) {
      return "";
    }

    var elems = document.getElementsByClassName("target_p");
    const data = [];
    Array.from(elems).forEach((e) => {
      data.push(e.id);
    });

    await axios
      .post(ApiPath.TV + "bundle/del_p", data)
      .then(response => {
        if (response.data) {
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
          window.location.href = newUrl2;
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
      {tvList !== undefined && tvList.length > 0 ? (
        tvList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Program program={e} teamId={teamId} regPmList={regPmList} key={e.id} />
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
