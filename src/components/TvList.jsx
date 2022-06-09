import React from 'react';
import PM from '../components/PM';
import Program from '../components/Program';
import axios from '../axios';
import { ApiPath } from '../constants';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import exportFunctionRel from '../functions/RelManage';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const TvList = ({tvList, pmList, teamId}) => {

  // 対象Itemを一括でIM登録します
  const bundlePm = async() => {
    var elems = document.getElementsByClassName("target_p");
    const data = [];

    Array.from(elems).forEach((e) => {
      if (e.dataset.pmid === null || e.dataset.pmid == "") {
        // const verArr = [];
        // if (e.dataset.verarr !== undefined && e.dataset.verarr !== null) {
        //   var arr = e.dataset.verarr.split(",");
        //   var i = 0;
        //   while (arr[i]!== undefined) {
        //     var innerArr = [];
        //     innerArr = [arr[i], arr[i+1], arr[i+2]];
        //     verArr.push(innerArr);
        //     i = i + 3;
        //   }
        // }

        const prel = [];
        if (e.dataset.prel !== undefined && e.dataset.prel !== null) {
          var arrPrel = e.dataset.prel.split(",");
          var j = 0;
          while (arrPrel[j]!== undefined && arrPrel[j+1]!== undefined && arrPrel[j+2]!== undefined) {
            prel.push([Number(arrPrel[j]), Number(arrPrel[j+1]), Number(arrPrel[j+2])]);
            j = j + 3;
          }
        }

        var prelDistinct = exportFunctionRel.getDistinctRel(prel);
        console.log(prel);

        const prelm = [];
        if (e.dataset.prelm !== undefined && e.dataset.prelm !== null) {
          var arrPrelM = e.dataset.prelm.split(",");
          var k = 0;
          while (arrPrel[j]!== undefined && arrPrel[j+1]!== undefined && arrPrel[j+2]!== undefined) {
            prelm.push([Number(arrPrelM[k]), Number(arrPrelM[k+1]), Number(arrPrelM[k+2])]);
            k = k + 3;
          }
        }
        var prelMDistinct = exportFunctionRel.getDistinctRel(prelm);
        
        const p = {
          program_id: e.id,
          pm_id: e.dataset.pmid,
          teamId: e.dataset.teamid,
          pmrel: prel,
          pmrelm: prelm,
          title: e.dataset.title,
          // on_air_date: e.dataset.date,
          del_flg: false,
          // verlist: e.dataset.verlist,
        }
        data.push(p);
      }
    });

    console.log(data);
    await axios
      .post(ApiPath.PM + "bundle/new", data)
      .then(response => {
        if (response.data) {
          if (teamId !== null && teamId !== undefined && !window.location.href.includes("teamId=")) {
            window.location.href = window.location.href + "?teamId=" + teamId;
          } else {
            window.location.href = window.location.href;
          }
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
          } else {
            window.location.href = window.location.href;
          }
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
            <Program program={e} teamId={teamId} key={e.id} />
          </div>
        ))
      ) : (
        <div>
          <h1>TVデータが見つかりませんでした:(</h1>
        </div>
      )}
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
  background: '#db36a4',
  color: 'black',
});

export default TvList;
