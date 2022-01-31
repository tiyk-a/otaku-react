import React, {useEffect, useState} from 'react';
import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import Item from '../components/Item';
import ItemM from '../components/ItemM';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';
import ItemForm from '../containers/ItemForm';
import axios from '../axios';
import { ApiPath } from '../constants';
import exportFunctionRel from '../functions/RelManage';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const ItemMList = ({itemList, itemMList, iimList, teamId, errJList}) => {
  const moment = require("moment");
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(moment('2020-01-01').format('YYYY-MM-DD'));
  }, [moment]);

  // 入力された検索ワードをSTATEに反映
  const handleChangeDate = e => {
      setDate(e);
  };

  // 対象Itemを一括でIM登録します
  const bundleItem = async() => {
    var elems = document.getElementsByClassName("target_item");
    const data = [];

    Array.from(elems).forEach((e) => {
      if (e.dataset.imid === null) {
        const verArr = [];
        if (e.dataset.verarr !== undefined && e.dataset.verarr !== null) {
          var arr = e.dataset.verarr.split(",");
          var i = 0;
          while (arr[i]!== undefined) {
            var innerArr = [];
            innerArr = [arr[i], arr[i+1], arr[i+2]];
            verArr.push(innerArr);
            i = i + 3;
          }
        }

        const irel = [];
        if (e.dataset.irel !== undefined && e.dataset.irel !== null) {
          var arrIrel = e.dataset.irel.split(",");
          var j = 0;
          while (arrIrel[j]!== undefined) {
            irel.push(arrIrel[j], arrIrel[j+1], arrIrel[j+2]);
            j = j + 3;
          }
        }

        var irelDistinct = exportFunctionRel.getDistinctRel(irel);

        const irelm = [];
        if (e.dataset.irelm !== undefined && e.dataset.irelm !== null) {
          var arrIrelM = e.dataset.irelm.split(",");
          var k = 0;
          while (arrIrelM[k]!== undefined) {
            irelm.push(arrIrelM[k], arrIrelM[k+1], arrIrelM[k+2]);
            k = k + 3;
          }
        }

        var irelMDistinct = exportFunctionRel.getDistinctRel(irelm);
        
        const item = {
          item_id: e.id,
          im_id: e.dataset.imid,
          teamId: e.dataset.teamid,
          imrel: irelDistinct,
          imrelm: irelMDistinct,
          title: e.dataset.title,
          wp_id: "",
          publication_date: e.dataset.date,
          amazon_image: e.dataset.image,
          del_flg: false,
          vers: verArr,
        }
        data.push(item);
      }
    });

    await axios
      .post(ApiPath.IM + "bundle/new", data)
      .then(response => {
        if (response.data) {
          window.location.reload();
        } else {
          window.alert("登録エラーです");
          console.log(response);
        }
      })
      .catch(error => {});
  }

  // 対象Itemを一括でIM設定します
  const bundleItemManage = async() => {
    var elems = document.getElementsByClassName("target_item");
    const data = [];

    Array.from(elems).forEach((e) => {  
      if (e.dataset.imid !== null) {
        const item = {
          item_id: e.id,
          im_id: e.dataset.imid,
          teamId: e.dataset.teamid
        }
        data.push(item);
      }
    });

    await axios
      .post(ApiPath.IM + "bundle/chk", data)
      .then(response => {
        if (response.data) {
          window.location.reload();
        } else {
          window.alert("登録エラーです");
          console.log(response);
        }
      })
      .catch(error => {});
  }

  // 対象IMを一括で更新します
  const bundleIM = async() => {
    var elems = document.getElementsByClassName("target_im");
    const data = [];
    Array.from(elems).forEach((e) => {
      const verArr = [];
      if (e.dataset.verarr !== undefined && e.dataset.verarr !== null) {
        var arr = e.dataset.verarr.split(",");
        var i = 0;
        while (arr[i]!== undefined) {
          var innerArr = [];
          innerArr = [arr[i], arr[i+1], arr[i+2]];
          verArr.push(innerArr);
          i = i + 3;
        }
      }

      const imrel = [];
      if (e.dataset.imrel !== undefined && e.dataset.imrel !== null) {
        var arr = e.dataset.imrel.split(",");
        var i = 0;
        while (arr[i]!== undefined) {
          imrel.push(arr[i], arr[i+1], arr[i+2]);
          i = i + 3;
        }
      }

      const imrelm = [];
      if (e.dataset.imrelm !== undefined && e.dataset.imrelm !== null) {
        var arr = e.dataset.imrelm.split(",");
        var i = 0;
        while (arr[i]!== undefined) {
          imrelm.push(arr[i], arr[i+1], arr[i+2]);
          i = i + 3;
        }
      }

      const im = {
        im_id: e.id,
        title: e.dataset.title,
        wp_id: e.dataset.wpid,
        publication_date: e.dataset.date,
        amazon_image: e.dataset.image,
        del_flg: false,
        vers: verArr,
        imrel: imrel,
        imrelm: imrelm
      } 
      data.push(im);
    });

    await axios
      .post(ApiPath.IM + "bundle/upd", data)
      .then(response => {
        if (response.data) {
          window.location.reload();
        } else {
          window.alert("登録エラーです");
          console.log(response);
        }
      })
      .catch(error => {});
  }

  return (
    <div className="allItemsList">
      <h3>未チェックItem<Btn onClick={bundleItem}>一括登録</Btn>
        <br />
        <Btn onClick={bundleItemManage}>一括設定</Btn>
      </h3>
      {itemList !== undefined && itemList.length > 0 ? (
        itemList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Item item={e} teamId={teamId} itemMList={itemMList} />
          </div>
        ))
      ) : (
        <div>
          <h1>未チェックItemが見つかりませんでした:(</h1>
        </div>
      )}
      <h3>ErrorJson</h3>
      <ItemForm teamIdObj={teamId} />
      {errJList !== undefined && errJList.length > 0 ? (
        errJList.map((e, index) => (
          <div className="itemBox" key={index}>
            <p>ErrorJsonId：{e.id} TeamId: {e.teamId}
            <br />
            {e.json}
            </p>
          </div>
        ))
      ) : (
        <div>
          <h1>ErrorJsonはなし</h1>
        </div>
      )}
      <h3>今後のItemM<Btn onClick={bundleIM}>一括処理</Btn></h3>
      <p>期間指定</p>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
        <DatePicker
            variant="inline"
            inputVariant="standard"
            format="yyyy/MM"
            id="date"
            value={date}
            onChange={handleChangeDate}
            className="dateForm"
            autoOk={true}
            />
        <DatePicker
            variant="inline"
            inputVariant="standard"
            format="yyyy/MM"
            id="date"
            value={date}
            onChange={handleChangeDate}
            className="dateForm"
            autoOk={true}
            />
        </MuiPickersUtilsProvider>
        {itemMList !== undefined && itemMList.length > 0 ? (
            itemMList.map((e, index) => (
            <div className="itemBox" key={index}>
                <ItemM item={e} teamId={teamId} />
            </div>
            ))
        ) : (
            <div>
            <h1>今後のItemMが見つかりませんでした:(</h1>
            </div>
        )}
      <h3>チェック済み今後のItem</h3>
      <p>今表示なし</p>
      {/* {iimList !== undefined && iimList.length > 0 ? (
        iimList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Item item={e} teamId={teamId} />
          </div>
        ))
      ) : (
        <div>
          <h1>IMデータが見つかりませんでした:(</h1>
          <a href="/new">新しく商品を登録する？</a>
        </div>
      )} */}
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  color: 'black',
});
export default ItemMList;
