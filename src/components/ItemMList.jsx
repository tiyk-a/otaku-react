import React, {useEffect, useState} from 'react';
import { Button, Input } from '@material-ui/core';
import Item from '../components/Item';
import ItemM from '../components/ItemM';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';
import axios from '../axios';
import { ApiPath } from '../constants';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import MediaQuery from "react-responsive";

/**
 *商品リストコンポーネント
 *
 * @param {array} itemList
 * @returns jsx
 */
const ItemMList = ({itemList, itemMList, teamId, errJList}) => {
  var exportFunction = require('../functions/TeamIdToName');
  
  const moment = require("moment");
  const [date, setDate] = useState('');
  const [imId, setImId] = useState(0);
  const [imKey, setImKey] = useState('');
  const [imSearchRes, setImSearchRes] = useState([]);
  const [otherImTitle, setOtherImTitle] = useState("");
  const [dispCal, setDispCal] = useState(false);

  /**
   * 
   */
  useEffect(() => {
    setDate(moment('2020-01-01').format('YYYY/MM/DD'));
  }, [moment]);

  /**
   * 日付を更新する
   * 
   * @param {*} e 
   */
  const handleChangeDate = e => {
    setDate(e);
  };

  /**
   * 一括IM登録
   */
  const bundleItem = async() => {
    var elems = document.getElementsByClassName("target_item");
    const data = [];

    Array.from(elems).forEach((e) => {
      if (e.dataset.imid === null || e.dataset.imid === "0") {
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
        
        // teamIdってなってるところをarrにせねば。+mem
        const item = {
          item_id: e.id,
          im_id: e.dataset.imid,
          teamId: e.dataset.teamid,
          teamArr: e.dataset.teamarr,
          memArr: e.dataset.memarr,
          title: e.dataset.title,
          publication_date: e.dataset.date,
          amazon_image: e.dataset.image,
          del_flg: false,
          vers: verArr,
          note: e.dataset.note,
        }
        data.push(item);
      }
    });

    await axios
      .post(ApiPath.IM + "bundle/new", data)
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

  /**
   * 対象Itemを一括でIM設定します
   */
  const bundleItemManage2 = async() => {
    const data = [];
    const itemIdList = document.getElementsByName("add_item");

    if (imId === 0) {
      window.alert("IMを選択してください！");
    } else {
      for (let i = 0; i < itemIdList.length; i++) {
        if (itemIdList[i].checked) {
          const e = document.getElementById(itemIdList[i].value);
          const item = {
            item_id: e.id,
            im_id: imId,
            teamId: e.dataset.teamid
          }
          data.push(item);
        }
      }
      await axios
      .post(ApiPath.IM + "bundle/chk", data)
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
  }

  /**
   * 対象Itemを一括でIM削除します
   * TODO: そしたらフロントもそれに合わせる。何回もリクエスト送りたくない。
   * 画面更新したくないからelementをhiddenにする
   */
  const bundleDel = async() => {
    const itemList = document.getElementsByClassName("target_item");

    if (itemList.length === 0) {
      window.alert("IMを選択してください！");
    } else {
      const data = [];
      Array.from(itemList).forEach((e) => {
        data.push(e.id);
      });

      await axios
        .post(ApiPath.ITEM + "bundle/del", data)
        .then(response => {
          // 処理終わった要素は非表示にするよ
          Array.from(itemList).forEach((e) => {
            var elem = document.getElementById(e.id);
            // HTML構造にとっても依存！！
            elem.parentElement.parentElement.innerHTML = "<div></div>";
          });
        })
        .catch(error => {
          if (error.code === "ECONNABORTED") {
            window.alert("タイムアウトしました");
          }
        });
    }
  }

  /**
   * 対象IMを一括で更新します
   */
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

      // teamarr, memarrを入れる
      const im = {
        im_id: e.id,
        title: e.dataset.title,
        publication_date: e.dataset.date,
        amazon_image: e.dataset.image,
        del_flg: false,
        vers: verArr,
        teamArr: e.dataset.teamarr,
        memArr: e.dataset.memarr,
      } 
      data.push(im);
    });

    await axios
      .post(ApiPath.IM + "bundle/upd", data)
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

  /**
   * 対象IMを一括でアマゾンアイキャッチ設定します
   */
  const bundleIMEyeCatch = async() => {
    var elems = document.getElementsByClassName("target_im");
    const data = [];
    Array.from(elems).forEach((e) => {
      data.push(e.id);
    });

    await axios
      .post(ApiPath.IM + "eyeBundle", data)
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

  /**
   * IMキーを変更する
   * 
   * @param {*} e 
   */
  const handleChangeImKey = e => {
    const txt = e.target.value;
    setImKey(txt);
  };

  /**
   * キーワードよりimを検索する
   * 
   * @param {*} e 
   */
  const searchImByKw = (e) => {
    if (e.keyCode === 13) {
      searchOtherIm(imKey);
      setImKey("");
    }
  }

  /**
   * DBからIM検索
   * 
   * @param {} key 
   */
  const searchOtherIm = async (key) => {
    await axios
      .get(ApiPath.IM + 'search?key=' + key)
      .then(response => {
        setImSearchRes(response.data);
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

  /**
   * IMタイトルを変更する
   * 
   * @param {*} e 
   */
  const handleChangeIMTitle = e => {
    const txt = e.target.value;
    // setImTitle(txt);
    setOtherImTitle(txt);
    itemMList.forEach(im => {
      if (im.title === txt) {
        setImId(im.id);
      }
    });
  };

  /**
   * OtherImTitleを変更する
   * 
   * @param {*} e 
   */
  const handleChangeOtherIMTitle = e => {
    var txt = null;
    if (e.target.value !== "0") {
      txt = e.target.value;
    }

    setOtherImTitle(txt);
    var searchResFlg = false;

    // searchresの場合、そこからIDとか取って入れてあげる
    imSearchRes.forEach(item => {
      if (item.title === txt) {
        setImId(item.im_id);
        searchResFlg = true;
      }
    });

    // imの場合、IMからIDとか取って入れてあげる
    if (!searchResFlg) {
      if (txt === null) {
        setImId(0);
      } else {
        itemMList.forEach(im => {
          if (im.title === txt) {
            setImId(im.id);
          }
        });
      }
    }
  };

  /**
   * カレンダー表示・非表示切り替え
   */
  const toggleCalendar = () => {
    if (dispCal) {
      setDispCal(false);
    } else {
      setDispCal(true);
    }
  }

  return (
    <div className="allItemsList">
      <MediaQuery query="(min-width: 767px)">
        {/* PC */}
        <h3>未チェックItem</h3>
        <Button className="button-pink" onClick={bundleItem}>登録</Button>
        <Button className="button-pink" onClick={bundleItemManage2}>設定</Button>
        <Button className="button-pink" onClick={bundleDel}>削除</Button>
        <FormControl fullWidth>
          <p>IM検索: {imId}</p>
          <Input
            type="text"
            name="IM search"
            value={imKey}
            onChange={handleChangeImKey}
            placeholder="im keyword"
            className="titleInput"
            onKeyDown={searchImByKw}
          />
          {imSearchRes.length > 0 ? (
            <NativeSelect
              labelId="demo-simple-select-label"
              id="other-team-im"
              defaultValue=""
              value={otherImTitle}
              label="IM候補"
              onChange={handleChangeOtherIMTitle}
            >
              {imSearchRes.map((e, index) => (
                <option key={index} value={e.title}>
                  {e.title}
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
              value={otherImTitle}
              label="IM候補"
              // onChange={handleChangeIMTitle}
              onChange={handleChangeOtherIMTitle}
            >
              {itemMList.length > 0 ? (
                itemMList.map((e, index) => (
                <option key={index} value={e.title}>
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
        </FormControl>
      </MediaQuery>
      <MediaQuery query="(max-width: 519px)">
        {/* SP */}
        <h3>未チェックItem</h3>
        <Button className="button-pink" onClick={bundleItem}>登録</Button>
        <Button className="button-pink" onClick={bundleItemManage2}>設定</Button>
        <FormControl fullWidth>
          <p>IM検索: {imId}</p>
          <Input
            type="text"
            name="IM search"
            value={imKey}
            onChange={handleChangeImKey}
            placeholder="im keyword"
            className="titleInput"
            onKeyDown={searchImByKw}
          />
          {imSearchRes.length > 0 ? (
            <NativeSelect
              labelId="demo-simple-select-label"
              id="other-team-im"
              defaultValue=""
              value={otherImTitle}
              label="IM候補"
              onChange={handleChangeOtherIMTitle}
            >
              {imSearchRes.map((e, index) => (
                <option key={index} value={e.title}>
                  {e.title}
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
              value={otherImTitle}
              label="IM候補"
              // onChange={handleChangeIMTitle}
              onChange={handleChangeOtherIMTitle}
            >
              {itemMList.length > 0 ? (
                itemMList.map((e, index) => (
                <option key={index} value={e.title}>
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
        </FormControl>
      </MediaQuery>
      <MediaQuery query="(min-width: 520px) and (max-width: 959px)">
        {/* TB */}
        {/* <TbHeader styles={styles} /> */}
      </MediaQuery>
      {itemList !== undefined && itemList.length > 0 ? (
        itemList.map((e, index) => (
          <div className="itemBox" key={index}>
            <Item item={e} teamId={teamId} />
          </div>
        ))
      ) : (
        <div>
          <h3>未チェックItemが見つかりませんでした:({itemList.length}</h3>
        </div>
      )}
      <MediaQuery query="(min-width: 767px)">
        {/* PC */}
        <h3>未チェックItem
          <Button className="button-pink" onClick={bundleItem}>登録</Button>
          <Button className="button-pink" onClick={bundleItemManage2}>設定</Button>
          <FormControl fullWidth>
            <p>IM検索: {imId}</p>
            <Input
              type="text"
              name="IM search"
              value={imKey}
              onChange={handleChangeImKey}
              placeholder="im keyword"
              className="titleInput"
              onKeyDown={searchImByKw}
            />
            {imSearchRes.length > 0 ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="other-team-im"
                defaultValue="他チームID"
                value={otherImTitle}
                label="他チームID"
                onChange={handleChangeOtherIMTitle}
              >
              {imSearchRes.map((e, index) => (
                <option key={index} value={e.title}>
                  {e.title}
                </option>
              ))}
              </NativeSelect>
            ) : (
              ""
            )}
          </FormControl>
        </h3>
      </MediaQuery>
      <MediaQuery query="(max-width: 519px)">
        {/* SP */}
        <h3>未チェックItem
          <Button className="button-pink" onClick={bundleItem}>登録</Button>
          <Button className="button-pink" onClick={bundleItemManage2}>設定</Button>
          <FormControl fullWidth>
            <p>IM検索: {imId}</p>
            <Input
              type="text"
              name="IM search"
              value={imKey}
              onChange={handleChangeImKey}
              placeholder="im keyword"
              className="titleInput"
              onKeyDown={searchImByKw}
            />
            {imSearchRes.length > 0 ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="other-team-im"
                defaultValue="他チームID"
                value={otherImTitle}
                label="他チームID"
                onChange={handleChangeOtherIMTitle}
              >
              {imSearchRes.map((e, index) => (
                <option key={index} value={e.title}>
                  {e.title}
                </option>
              ))}
              </NativeSelect>
            ) : (
              ""
            )}
          </FormControl>
        </h3>
      </MediaQuery>
      <MediaQuery query="(min-width: 520px) and (max-width: 959px)">
        {/* TB */}
        {/* <TbHeader styles={styles} /> */}
      </MediaQuery>
      <h3>ErrorJson</h3>
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
      <h3>今後のIM<Button className="button-pink" onClick={bundleIM}>一括処理</Button> <Button className="button-pink" onClick={bundleIMEyeCatch}>一括アイキャッチ</Button></h3>
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
        <div>
          {itemMList.map((e, index) => (
            <div className="itemBox" key={index}>
              <ItemM item={e} teamId={teamId} />
            </div>
          ))}
          <Button className="button-pink" onClick={toggleCalendar}>カレンダー</Button>
          <div class="responsiveCal">
            {dispCal ? (
                <div>
                  <div dangerouslySetInnerHTML={{__html: exportFunction.getCal(teamId)}}></div>
                </div>
              ) : (
                <></>
              )
            }
          </div>
        </div>
      ):(
        <div className="responsiveCal">
          <div dangerouslySetInnerHTML={{__html: exportFunction.getCal(teamId)}}></div>
        </div>
      )}
    </div>
  );
};

export default ItemMList;
