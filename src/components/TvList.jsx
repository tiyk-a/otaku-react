import React from 'react';
import PM from '../components/PM';
import Program from '../components/Program';
import axios from '../axios';
import { ApiPath } from '../constants';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const TvList = ({tvList, pmList, teamId}) => {

  // // 対象Itemを一括でIM登録します
  // const bundleItem = async() => {
  //   var elems = document.getElementsByClassName("target_item");
  //   const data = [];

  //   Array.from(elems).forEach((e) => {
  //     if (e.dataset.imid === null) {
  //       const verArr = [];
  //       if (e.dataset.verarr !== undefined && e.dataset.verarr !== null) {
  //         var arr = e.dataset.verarr.split(",");
  //         var i = 0;
  //         while (arr[i]!== undefined) {
  //           var innerArr = [];
  //           innerArr = [arr[i], arr[i+1], arr[i+2]];
  //           verArr.push(innerArr);
  //           i = i + 3;
  //         }
  //       }

  //       const irel = [];
  //       if (e.dataset.irel !== undefined && e.dataset.irel !== null) {
  //         var arrIrel = e.dataset.irel.split(",");
  //         var j = 0;
  //         while (arrIrel[j]!== undefined) {
  //           irel.push(arrIrel[j], arrIrel[j+1], arrIrel[j+2]);
  //           j = j + 3;
  //         }
  //       }

  //       var irelDistinct = exportFunctionRel.getDistinctRel(irel);

  //       const irelm = [];
  //       if (e.dataset.irelm !== undefined && e.dataset.irelm !== null) {
  //         var arrIrelM = e.dataset.irelm.split(",");
  //         var k = 0;
  //         while (arrIrelM[k]!== undefined) {
  //           irelm.push(arrIrelM[k], arrIrelM[k+1], arrIrelM[k+2]);
  //           k = k + 3;
  //         }
  //       }

  //       var irelMDistinct = exportFunctionRel.getDistinctRel(irelm);
        
  //       const item = {
  //         item_id: e.id,
  //         im_id: e.dataset.imid,
  //         teamId: e.dataset.teamid,
  //         imrel: irelDistinct,
  //         imrelm: irelMDistinct,
  //         title: e.dataset.title,
  //         wp_id: "",
  //         publication_date: e.dataset.date,
  //         amazon_image: e.dataset.image,
  //         del_flg: false,
  //         vers: verArr,
  //       }
  //       data.push(item);
  //     }
  //   });

  //   await axios
  //     .post(ApiPath.IM + "bundle/new", data)
  //     .then(response => {
  //       if (response.data) {
  //         window.location.reload();
  //       } else {
  //         window.alert("登録エラーです");
  //         console.log(response);
  //       }
  //     })
  //     .catch(error => {
  //       if (error.code === "ECONNABORTED") {
  //         window.alert("タイムアウトしました");
  //       }
  //     });
  // }

  // // 対象Itemを一括でIM設定します
  // const bundleItemManage2 = async() => {
  //   const data = [];
  //   const itemIdList = document.getElementsByName("add_item");

  //   if (imId === 0) {
  //     window.alert("IMを選択してください！");
  //   } else {
  //     for (let i = 0; i < itemIdList.length; i++) {
  //       if (itemIdList[i].checked) {
  //         const e = document.getElementById(itemIdList[i].value);
  //         const item = {
  //           item_id: e.id,
  //           im_id: imId,
  //           teamId: e.dataset.teamid
  //         }
  //         data.push(item);
  //       }
  //     }
  //     await axios
  //     .post(ApiPath.IM + "bundle/chk", data)
  //     .then(response => {
  //       if (response.data) {
  //         window.location.reload();
  //       } else {
  //         window.alert("登録エラーです");
  //         console.log(response);
  //       }
  //     })
  //     .catch(error => {
  //       if (error.code === "ECONNABORTED") {
  //         window.alert("タイムアウトしました");
  //       }
  //     });
  //   }
  // }

  // 対象Pを一括で削除します
  const bundleP = async() => {
    var elems = document.getElementsByClassName("target_p");
    const data = [];
    Array.from(elems).forEach((e) => {
      data.push(e.id);
    });

    await axios
      .post(ApiPath.TV + "bundle/del_p", data)
      .then(response => {
        if (response.data) {
          window.location.reload();
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
      <h2>Program <Btn onClick={bundleP}>一括削除</Btn></h2>
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
