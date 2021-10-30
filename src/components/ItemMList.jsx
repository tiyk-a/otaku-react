import React, {useEffect, useState} from 'react';
import Item from '../components/Item';
import ItemM from '../components/ItemM';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const ItemMList = ({itemList, itemMList, iimList, teamId}) => {
    const moment = require("moment");
    const [date, setDate] = useState('');

    useEffect(() => {
        console.log(itemMList);
        setDate(moment('2020-01-01').format('YYYY-MM-DD'));
    }, [moment]);

    // 入力された検索ワードをSTATEに反映
  const handleChangeDate = e => {
    console.log(e);
    setDate(e);
  };

  return (
    <div className="allItemsList">
      <h3>未チェックItem</h3>
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
      <h3>今後のItemM</h3>
      <p>期間指定</p>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
        <DatePicker
            disableToolbar
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
            disableToolbar
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

export default ItemMList;
