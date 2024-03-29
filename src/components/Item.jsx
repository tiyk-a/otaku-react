import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, Input } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import styled from '@material-ui/styles/styled';
import NativeSelect from '@mui/material/NativeSelect';
import jaLocale from 'date-fns/locale/ja';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const Item = ({ item, teamId }) => {
  var exportFunction = require('../functions/TeamIdToName');

  const moment = require("moment");
  const [id, setId] = useState('');
  const [imId, setImId] = useState('');
  const [date, setDate] = useState('');
  const [amazon_image, setAmazon_image] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [tmpVer, setTmpVer] = useState('');
  const [verArr, setVerArr] = useState([]);
  const [editedFlg, setEditedFlg] = useState(false);
  const [teamIdList, setTeamIdList] = useState([]);
  const [memIdList, setMemIdList] = useState([]);
  const [allTeamIdList, setAllTeamIdList] = useState([]);
  const [allMemIdList, setAllMemIdList] = useState([]);
  const [addIrelFlg, setAddIrelFlg] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [dispDetail, setDispDetail] = useState(false);
  const [media, setMedia] = useState(1);

  /**
   * 
   */
  useEffect(() => {
    // メディア判定
    isSmartPhone();

    setId(item.id);
    setDate(moment(item.pubDate).format('YYYY/MM/DD'));
    setImId(0);
    setTitle(item.title);
    setTeamIdList(item.teamArr);
    setMemIdList(item.memArr);
    setAllTeamIdList(exportFunction.getAllTeam());
    setAllMemIdList(exportFunction.getAllMember());
  }, [item, item.id, item.pubDate, item.title, item.teamArr, item.memArr, moment]);

  /**
   * メディア判別
   */
  const isSmartPhone = () => {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      // SP
      setMedia(2);
    } else {
      setMedia(1);
    }
  }

  /**
   * IMを登録する
   */
  const registerIM = async () => {
    if (teamId !== undefined) {
      if (imId === 0) {
        setImId(undefined);
      }

      const data = {
        item_id: id,
        im_id: imId,
        teamArr: teamIdList.join(','),
        memArr: memIdList.join(','),
        title: title,
        publication_date: date,
        amazon_image: amazon_image,
        del_flg: false,
        vers: verArr,
        note: note,
      }

      await axios
        .post(ApiPath.IM, data)
        .then(response => {
          if (response.data) {
            var tmpUrl = window.location.href;
            var newUrl = tmpUrl.replace("http://localhost:3000/", "");
            var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
            window.location.href = newUrl2;
          } else {
            window.alert("更新エラーです");
          }
        })
        .catch(error => {
          if (error.code === "ECONNABORTED") {
            window.alert("タイムアウトしました");
          }
        });
    }
  };

  /**
   * 日付を更新
   * 
   * @param {*} e 
   */
  const handleChangeDate = e => {
    setDate(moment(e).format('YYYY/MM/DD'));
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  /**
   * タイトル更新
   * 
   * @param {*} e 
   */
  const handleChangeTitle = e => {
    const txt = e.target.value;
    setTitle(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  /**
   * note更新
   * 
   * @param {*} e 
   */
  const handleChangeNote = e => {
    const txt = e.target.value;
    setNote(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  /**
   * アマゾン画像更新
   * 
   * @param {*} e 
   */
  const handleChangeAmazonImage = e => {
    setAmazon_image(e.target.value);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  }

  /**
   * ver配列追加
   * 
   * @param {*} e 
   */
  const addVerArr = e => {
    if (e.keyCode === 13) {
      setVerArr([...verArr, [null, tmpVer, null]]);
      setTmpVer('');
    }
  }

  /**
   * IMを削除する
   */
  const delIm = async () => {
    if (teamId !== undefined) {
      await axios
        .delete(ApiPath.ITEM + id)
        .then(response => {
          // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
          if (response.data) {
            var tmpUrl = window.location.href;
            var newUrl = tmpUrl.replace("http://localhost:3000/", "");
            var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
            window.location.href = newUrl2;
          } else {
            window.alert("削除エラーです");
            console.log(response);
          }
        })
        .catch(error => {
          if (error.code === "ECONNABORTED") {
            window.alert("タイムアウトしました");
          }
        });
    }
  };

  /**
   * indexのチームを変更する
   * 
   * @param {*} e 
   */
  const changeTeamByIndex = e => {
    setTeamIdList(exportFunction.changeTeamByIndex(e, teamIdList));
  }

  /**
   * チームを追加する
   * 
   * @param {*} e 
   */
  const handleChangeAddIrel = e => {
    setTeamIdList(exportFunction.addTeam(e.target.value, teamIdList));
  }

  /**
   * チームを削除する
   * 
   * @param {*} index 
   */
  const minusIrel = (index) => {
    setTeamIdList(exportFunction.minusTeam(index, teamIdList));
  }

  /**
   * verを追加する
   * 
   * @param {*} e 
   */
  const handleAddVer = e => {
    const txt = e.target.value;
    setTmpVer(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  /**
   * verを変更する
   * 
   * @param {*} e 
   */
  const handleVerArr = e => {
    var newVar = e.target.value;
    var index = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...verArr];
    // 2. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[index] = [null, newVar, null];
    // 3. Set the state to our new copy
    setVerArr(vers);
  }

  /**
   * fct_chkを更新する
   * 
   * @param {*} e 
   */
  const updFctChk = async (e) => {
    if (imId === null || imId === undefined || imId === 0) {
    } else {
      await axios
        .get(ApiPath.IM + "chk?itemId=" + id + "&imId=" + imId)
        .then(response => {
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          var newUrl2 = newUrl.replace("http://chiharu-front.herokuapp.com/", "");
          window.location.href = newUrl2;
        })
        .catch(error => {
          if (error.code === "ECONNABORTED") {
            window.alert("タイムアウトしました");
          }
        });
    }
  }

  /**
   * チーム追加toggle
   */
  const toggleAddTeamFlg = () => {
    if (addIrelFlg) {
      setAddIrelFlg(false);
    } else {
      setAddIrelFlg(true);
    }
  }

  /**
   * メンバーtoggle
   * @param {*} memberId 
   */
  const toggleIrelM = (memberId) => {
    setMemIdList(exportFunction.toggleMem(memberId, memIdList));
  }

  /**
   * チーム一括選択toggle
   */
  const toggleSelectedItem = () => {
    if (editedFlg) {
      setEditedFlg(false);
      setIsChecked(false);
    } else {
      setEditedFlg(true);
      setIsChecked(true);
    }
  }

  /**
   * 詳細表示・非表示切り替え
   */
  const toggleDispDetail = () => {
    if (dispDetail) {
      setDispDetail(false);
    } else {
      setDispDetail(true);
    }
  }

  return (
    <div className={item.masterId !== null && item.masterId !== undefined ? "postedStyle itemContainer": editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"} onClick={toggleSelectedItem}>
      {editedFlg
        ? (<div className="target_item" id={item.id} data-imid={imId} data-teamid={teamId} data-title={title} data-date={date} data-image={amazon_image} data-teamarr={teamIdList} data-memarr={memIdList} data-verarr={verArr} data-note={note}></div>)
        : (<div id={item.id} data-teamid={teamId}></div>)}
      <Text>
        <ul className={media === 1 ? "row" : "column"}>
          <input type="checkbox" className="hiddenCheckBox" name="add_item" checked={isChecked} value={id} />
          <li className={media === 1 ? "textBoxTitle" : "textBoxTitleSp"}>
            <Input
            type="text"
            name="IM register"
            value={title}
            onChange={handleChangeTitle}
            placeholder="imId"
            className="titleInput"
            />
            <br />
            <Input
              type="text"
              name="amazon image"
              value={amazon_image}
              onChange={handleChangeAmazonImage}
              placeholder="amazon_image"
              className="titleInput"
            />
            <br />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
              <DatePicker
                variant="inline"
                inputVariant="standard"
                format="yyyy/MM/dd"
                id="date"
                label="発売日"
                value={date}
                onChange={handleChangeDate}
                className="dateForm"
                autoOk={true}
              />
            </MuiPickersUtilsProvider>
            <Button className="button-pink" onClick={toggleDispDetail}>詳細表示</Button>
            <p className={dispDetail ? ("") : ("hidden")}>ItmId•{item.id}</p>
          </li>
          <li className={media === 1 ? null : "column"}>
            {teamIdList !== null && teamIdList !== undefined ? (
              teamIdList.map((e, index) => (
                <div className={media === 1 ? "row" : "column"}>
                  <NativeSelect
                    labelId="demo-simple-select-label"
                    id={e}
                    defaultValue=""
                    value={exportFunction.teamIdToName(e) + ":" + index}
                    label="Team"
                    onChange={changeTeamByIndex}
                    name={index}
                  >
                  {allTeamIdList !== null && allTeamIdList !== undefined ? (
                    allTeamIdList.map((f, index2) => (
                      // optionの中は選択された時に持っていくvalue
                      <option key={e} value={exportFunction.teamIdToName(f.id) + ":" + index}>
                        {/* ここは選択肢として表示される文言 */}
                        {exportFunction.teamIdToName(f.id)}
                      </option>
                      ))
                  ) : (
                    <></>
                  )}
                  </NativeSelect>
                  {e === 4 ? (
                    <p onClick={() => minusIrel(index)} > - </p>
                  ) : (null)
                  }
                  <div class="flex_column width_6rem">
                    {function() {
                      if (allMemIdList !== null && allMemIdList !== undefined) {
                        return (
                          <div>
                            {allMemIdList.map((g, index) => (
                              <div>
                                {function() {
                                  if (g.teamId === Number(e)) {
                                    if (memIdList.includes(g.id) || memIdList.includes(g.id.toString())) {
                                      return (
                                        <div>
                                          <p className="colorRed" onClick={() => toggleIrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                        </div>
                                      )
                                    } else {
                                      return (
                                        <div>
                                          <p onClick={() => toggleIrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                        </div>
                                      )
                                    }
                                  }
                                }()}
                              </div>
                            ))}
                          </div>
                        )
                      }
                    }()}
                  </div>
                </div>
                ))
              ) : (
                <></>
              )
            }
            {addIrelFlg ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={exportFunction.teamIdToName(4)}
                label="Age"
                onChange={handleChangeAddIrel}
                name="tmpIrel"
              >
              {allTeamIdList !== null && allTeamIdList !== undefined ? (
                allTeamIdList.map((f, index2) => (
                  <option key={4} value={exportFunction.teamIdToName(f.id)}>
                    {exportFunction.teamIdToName(f.id)}
                  </option>
                  ))
              ) : (
                <></>
              )}
              </NativeSelect>
            ) : (
              <Button className="button-pink" onClick={toggleAddTeamFlg}>+Team</Button>
            )}
            <br />
            {item.masterId !== null && item.masterId !== undefined ? (item.masterId) : ("")}
          </li>
          <li className={media === 1 ? "textBox" : "textBoxSp"}>
            <Input
              type="text"
              name="ver"
              value={tmpVer}
              onChange={handleAddVer}
              placeholder="バージョン(記号x,Enterで追加)"
              className="titleInput"
              onKeyDown={addVerArr}
            />
            {verArr.length > 0 ? (
              verArr.map((e, index) => (
                <div className="itemBox" key={index}>
                  <Input
                    type="text"
                    name={index}
                    value={e[1]}
                    onChange={handleVerArr}
                    placeholder="ver"
                    className="titleInput"
                  />
                </div>
              ))
              ):("")
            }
            <p>{item.url}</p>
            <br />
            <Input
            type="text"
            name="短文商品ポイント"
            value={note}
            onChange={handleChangeNote}
            placeholder="短文商品ポイント"
            className="titleInput"
            />
          </li>
        </ul>
      </Text>
    </div>
  );
};

/**
 * UI(文章系をまとめるBOX)
 *
 */
const Text = styled(Box)({
  padding: '10px',
});

export default Item;
