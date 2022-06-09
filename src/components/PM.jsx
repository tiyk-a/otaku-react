import { Box, Button, TextField, Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import jaLocale from 'date-fns/locale/ja';
import exportFunction from '../functions/TeamIdToName';
import NativeSelect from '@mui/material/NativeSelect';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const PM = ({ pm, teamId }) => {
  const moment = require("moment");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // const [date, setDate] = useState('');
  const [pmrel, setPmrel] = useState([]);
  const [pmrelM, setPmrelM] = useState([]);
  const [verList, setVerList] = useState([]);
  const [teamIdList, setTeamIdList] = useState([]);
  const [id, setId] = useState('');
  const [pmId, setPmId] = useState('');
  const [addPrelFlg, setAddPrelFlg] = useState(false);
  // [{teamId,memList,redMemList},{teamId,memList,redMemList}]
  const [pmrelObj, setPmrelObj] = useState([]);
  const [editedFlg, setEditedFlg] = useState(false);

  useEffect(() => {
    setId(pm.id);
    setTitle(pm.title);
    if (pm.description !== null && pm.description !== undefined) {
      setDescription(pm.description);
    } else {
      setDescription("");
  }
  
  // setDate(moment(pm.date).format('YYYY-MM-DD HH:mm'));
  const outerArr = [];
  if (pm.pmrelList !== null && pm.pmrelList.length > 0) {
    pm.pmrelList.forEach((e) => {
      const innerArr = [];
      innerArr.push(e.pm_rel_id, e.pm_id, e.team_id);
      outerArr.push(innerArr);
    });
    setPmrel(outerArr);
  }

  const outerArrM = [];
  if (pm.pmrelMList !== null && pm.pmrelMList.length > 0) {
    pm.pmrelMList.forEach((e) => {
      const innerArrM = [];
      innerArrM.push(e.pm_rel_mem_id, e.pm_rel_id, e.member_id);
      outerArrM.push(innerArrM);
    });
    setPmrelM(outerArrM);
  }

  const outerArrV = [];
  if (pm.verList !== null && pm.verList.length > 0) {
    pm.verList.forEach((e) => {
      const innerArrV = {
        v_id: e.pm_v_id,
        on_air_date: e.on_air_date,
        station_name: e.station_name,
        del_flg: e.del_flg
      };
      outerArrV.push(innerArrV);
    });
    setVerList(outerArrV);
  }

  setTeamIdList(exportFunction.getAllTeam());
  insertPrelObj(outerArr, outerArrM);
  }, []);

  // Item一括選択のためにboxを押したら選択/解除する
  const toggleSelectedItem = () => {
    if (editedFlg) {
      setEditedFlg(false);
      // setIsChecked(false);
    } else {
      setEditedFlg(true);
      // setIsChecked(true);
    }
  }

  // 既存商品の更新
  const updPm = async() => {
    const data = {
      id: pm.id,
      title: title,
      description: description,
      pmrel: pmrel,
      pmrelm: pmrelM,
      verList: verList
    }

    await axios
    .post(ApiPath.PM + pm.id, data)
    .then(response => {
      if (response.data) {
        window.location.reload();
      } else {
      window.alert("更新エラーです");
      }
    })
    .catch(error => {
      if (error.code === "ECONNABORTED") {
        window.alert("タイムアウトしました");
      }
    });
  };

  const delPm = async () => {
    await axios
    .delete(ApiPath.PM + pm.id)
    .then(response => {
      // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
      if (response.data) {
        window.location.reload();
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
  };

  // 入力された日付を反映
  // const handleChangeDate = e => {
  //   // values[0]=pm_v_id, values[1]=on_air_date
  //   console.log(e);
  //   // var values = e.split(',');
  //   const newDate = moment(e).format('YYYY-MM-DD HH:mm');
  //   console.log(newDate);
  //   // let tmpList = [verList];
  //   // tmpList.forEach((e) => {
  //   //   if (e.v_id === values[0]) {
  //   //     e.on_air_date = values[1];
  //   //   }
  //   // });
  //   // setVerList(tmpList);
  // };

  // 各要素が入力されたらSTATEをアップデート
  const handleChange = e => {
    const txt = e.target.value;

    switch (e.target.name) {
    case 'p_name':
      setTitle(txt);
      break;
    case 'description':
      setDescription(txt);
      break;
    default:
      break;
    }
  };

  const handleChangePrel = e => {
    // var prelId = e.target.name;
    var pmrelId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...pmrel];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[pmrelId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToTeamId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[pmrelId] = [ver[0], ver[1], ver[2]];
    // 5. Set the state to our new copy
    setPmrel(vers);
    insertPrelObj(vers, pmrelM);
  }

  // 新しいprelを配列に追加します(新規not更新)
  const handleChangeAddPrel = e => {
    const teamIdTmp = exportFunction.nameToTeamId(e.target.value);
    let vers = [...pmrel];
    // [prelId, programId, teamId]
    vers.push([null, id, teamIdTmp]);
    setPmrel(vers);
    setAddPrelFlg(false);
    insertPrelObj(vers, pmrelM);
  }

  const toggleAddPrelFlg = () => {
    if (addPrelFlg) {
      setAddPrelFlg(false);
    } else {
      setAddPrelFlg(true);
    }
  }

  // そのチームをprelから抜きます
  const minusPrel = (index) => {
    let vers = [...pmrel];
    // prelが最低1つあれば削除可能
    if (vers.length > 1) {
      vers.splice(index, 1);
    }
    setPmrel(vers);
  }

  // メンバーがprelMに入っていなかったら追加、入っていたら抜く
  const togglePrelM = (memberId) => {
    let vers = [...pmrelM];
    let ver2 = vers.filter(rel => rel[2] !== memberId);

    if (vers.length === ver2.length) {
      ver2.push([null, null, memberId, 0]);
    }
    setPmrelM(ver2);
    insertPrelObj(pmrel, ver2);
  }

  // member関連objectを全て設定
  // [{teamId,memList,redMemList},{teamId,memList,redMemList}]
  const insertPrelObj = (prel, prelM) => {
    var allMemList = exportFunction.getAllMember();

    // このprogramが持ってるteamidlistを作る
    var tmpTeamIdList = [];

    if (prel !== null && prel !== undefined && prel.length > 0) {
      prel.forEach((rel) => {
        if (!tmpTeamIdList.includes(rel[2])) {
          tmpTeamIdList.push(rel[2]);
        }
      });

    var objArr = [];
    // programが持ってるteamIdを全部オブジェクトに突っ込む
    tmpTeamIdList.forEach((teamId) => {
      var addFlg = true;
      objArr.forEach((obj) => {
        if (obj.teamId === teamId) {
          addFlg = false;
        }
      });

      if (addFlg && teamId !== undefined) {
        var mList = [];
        allMemList.forEach((g, index) => {
          if (g.teamId === teamId) {
            mList.push(g.id);
          }
        });

        var elem = {
          teamId : teamId,
          list : mList,
          redList : []
        };
        objArr.push(elem);
      }
    });

    if (prelM !== null && prelM !== undefined) {
      prelM.forEach((relM) => {
        var elem = {};
        var index_obj_var = null;
        objArr.forEach((obj, index_obj) => {
          var tId = exportFunction.getTeamIdOfMember(relM[2]);
          if (obj.teamId === tId) {
            elem = obj;
            index_obj_var = index_obj;
          }
        });

        if (!isEmpty(elem)) {
          var list = elem.list;
          var index = list.indexOf(relM[2]);
          var redList = elem.redList;    

          if (index > -1) {
            list.splice(index, 1);
          }

          if (!redList.includes(relM[2])) {
            redList.push(relM[2]);
          }

          elem.teamId = elem.teamId;
          elem.list = list;
          elem.redList = redList;
          objArr[index_obj_var] = elem;
        }
      });
      setPmrelObj(objArr);
    }
    }
  }

  const isEmpty = (obj) => {
    return !Object.keys(obj).length;
  }

  return (
    <div className={editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"} onClick={toggleSelectedItem}>
      {editedFlg
        ? (<div className="target_pm" id={pm.id} data-teamid={teamId} data-title={title} data-prel={pmrel} data-prelm={pmrelM}></div>)
        : (<div id={pm.id} data-teamid={teamId}></div>)}
      <Text>
        <ul>
          <li className="textBoxTitle">
            <p>pmId: {pm.id}</p>
            <Input
              type="text"
              name="p_name"
              value={title}
              onChange={handleChange}
              placeholder="title"
              className="titleInput"
            />
            <NativeSelect
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              // value={exportFunction.teamIdToName(e[2])}
              label="PM"
              // onChange={handleChange}
              // name={index}
            >
              {/* {pmSearchRes.map((e, index) => ( */}
                <option key={0} value={0}>
                  {0}
                </option>
              {/* ))} */}
            </NativeSelect>
            <TextField
              required
              name="description"
              label="description"
              value={description}
              onChange={handleChange}
              fullWidth={true}
              multiline={true}
              minRows={3}
              maxRows={5}
            />
          </li>
          <li>
            {verList !== null && verList !== undefined ? (
              <ul>
                {verList.map((e, index) => (
                  <li className='flex_row'>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
                      <DateTimePicker
                      label="on_air_date"
                      value={e.on_air_date}
                      // onChange={handleChangeDate}
                      format="yyyy-MM-dd HH:mm"
                      />
                    </MuiPickersUtilsProvider>
                    <Input
                      type="text"
                      name="station_name"
                      value={e.station_name}
                      onChange={handleChange}
                      placeholder="station"
                      className="titleInput"
                    />
                </li>
                ))}
              </ul>
            ) : ("")}
          </li>
          <li>
            {pmrel !== null && pmrel !== undefined ? (
              pmrel.map((e, index) => (
                <div class="flex_row">
                  <NativeSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue=""
                    value={exportFunction.teamIdToName(e[2])}
                    label="Age"
                    onChange={handleChangePrel}
                    name={index}
                  >
                    {teamIdList !== null && teamIdList !== undefined ? (
                      teamIdList.map((f, index) => (
                      <option key={e[2]} value={exportFunction.teamIdToName(f.id)}>
                      {exportFunction.teamIdToName(f.id)}
                      </option>
                      ))
                    ) : (
                      <></>
                    )}
                  </NativeSelect>
                  {e[2] === 4 ? (
                    <RemoveIcon onClick={() => minusPrel(index)} />
                  ) : (null)}
                  <div class="flex_column width_6rem">
                    {function() {
                      if (pmrelObj !== null && pmrelObj !== undefined) {
                        return (
                          <div>
                            {pmrelObj.map((g, index) => (
                              <div>
                                {function() {
                                  if (g.teamId === e[2]) {
                                    return (
                                      <div>
                                        {g.list.map((l, i) => (
                                          <p onClick={() => togglePrelM(l)}>{exportFunction.memberIdToName(l)}</p>
                                        ))}
                                        {g.redList.map((l, i) => (
                                          <p className="colorRed" onClick={() => togglePrelM(l)}>{exportFunction.memberIdToName(l)}</p>
                                        ))}
                                      </div>
                                    )
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
            )}
            {addPrelFlg ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={exportFunction.teamIdToName(4)}
                label="Age"
                onChange={handleChangeAddPrel}
                name="tmpPrel"
              >
                {teamIdList !== null && teamIdList !== undefined ? (
                  teamIdList.map((f, index) => (
                    <option key={4} value={exportFunction.teamIdToName(f.id)}>
                      {exportFunction.teamIdToName(f.id)}
                    </option>
                  ))
                ) : (
                  <></>
                )}
              </NativeSelect>
            ) : (
              <Btn onClick={toggleAddPrelFlg}>+prel</Btn>
            )}
          </li>
          <li className='flex_column'>
            <Btn onClick={updPm}>更新</Btn>
            <Btn onClick={delPm}>DELETE</Btn>
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

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: '#db36a4',
  margin: '10px 0',
  color: 'black',
});

export default PM;

const RemoveIcon = styled(RemoveCircleOutlineIcon)({
  // TODO:高さがselectorsと一緒になるように揃えたい
  cursor: 'pointer',
  '&:hover': {
  opacity: '0.5',
  transition: 'opacity 0.5s',
  },
});
