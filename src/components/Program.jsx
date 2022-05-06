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
const Program = ({ program, teamId }) => {
  const moment = require("moment");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [prel, setPrel] = useState([]);
  const [prelM, setPrelM] = useState([]);
  const [teamIdList, setTeamIdList] = useState([]);
  const [id, setId] = useState('');
  const [addPrelFlg, setAddPrelFlg] = useState(false);
  // [{teamId,memList,redMemList},{teamId,memList,redMemList}]
  const [prelObj, setPrelObj] = useState([]);

  useEffect(() => {
    setId(program.id);
    setTitle(program.title);
    if (program.description !== null && program.description !== undefined) {
      setDescription(program.description);
    } else {
      setDescription("");
    }
    
    setDate(moment(program.date).format('YYYY-MM-DD HH:mm'));
    const outerArr = [];
    program.prelList.forEach((e) => {
      const innerArr = [];
      innerArr.push(e.p_rel_id, e.program_id, e.team_id);
      outerArr.push(innerArr);
    });
    setPrel(outerArr);

    const outerArrM = [];
    program.prelMList.forEach((e) => {
      const innerArrM = [];
      innerArrM.push(e.p_rel_mem_id, e.p_rel_id, e.member_id);
      outerArrM.push(innerArrM);
    });
    setPrelM(outerArrM);

    setTeamIdList(exportFunction.getAllTeam());
    insertPrelObj(outerArr, outerArrM);
  }, []);

  // 既存商品の更新
  const updTv = async() => {
    const data = {
      id: program.id,
      title: title,
      description: description,
      on_air_date: date,
      prel: prel,
      prelM: prelM
    }

    await axios
      .post(ApiPath.TV + teamId + '/' + program.id, data)
      .then(response => {
        if (response.data) {
          window.location.reload();
        } else {
          window.alert("更新エラーです");
        }
      })
      .catch(error => {});
  };

  const delTv = async () => {
    await axios
      .delete(ApiPath.TV + program.id)
      .then(response => {
        // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
        if (response.data) {
          window.location.reload();
        } else {
          window.alert("削除エラーです");
          console.log(response);
        }
      })
      .catch(error => {});
  };

  // 入力された日付をSTATEに反映
  const handleChangeDate = e => {
    const newDate = moment(e).format('YYYY-MM-DD HH:mm');
    setDate(newDate);
  };

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
    var prelId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...prel];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[prelId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToTeamId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[prelId] = [ver[0], ver[1], ver[2]];
    // 5. Set the state to our new copy
    setPrel(vers);
    insertPrelObj(vers, prelM);
  }

  // 新しいprelを配列に追加します(新規not更新)
  const handleChangeAddPrel = e => {
    const teamIdTmp = exportFunction.nameToTeamId(e.target.value);
    let vers = [...prel];
    // [prelId, programId, teamId]
    vers.push([null, id, teamIdTmp]);
    setPrel(vers);
    setAddPrelFlg(false);
    insertPrelObj(vers, prelM);
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
    let vers = [...prel];
    // prelが最低1つあれば削除可能
    if (vers.length > 1) {
      vers.splice(index, 1);
    }
    setPrel(vers);
  }

  // メンバーがprelMに入っていなかったら追加、入っていたら抜く
  const togglePrelM = (memberId) => {
    let vers = [...prelM];
    let ver2 = vers.filter(rel => rel[2] !== memberId);

    if (vers.length === ver2.length) {
      ver2.push([null, null, memberId, 0]);
    }
    setPrelM(ver2);
    insertPrelObj(prel, ver2);
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
        setPrelObj(objArr);
      }
    }
  }

  const isEmpty = (obj) => {
    return !Object.keys(obj).length;
  }

  return (
    <div className="itemContainer">
      <Text>
        <ul>
          <li>
            <p>pId</p>
            {program.id}
          </li>
          <li>
            {prel !== null && prel !== undefined ? (
              prel.map((e, index) => (
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
                  ) : (null)
                  }
                  <div class="flex_column width_6rem">
                    {function() {
                      if (prelObj !== null && prelObj !== undefined) {
                        return (
                          <div>
                            {prelObj.map((g, index) => (
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
            <br />
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
              <DateTimePicker
                label="on_air_date"
                value={date}
                onChange={handleChangeDate}
                format="yyyy-MM-dd HH:mm"
              />
            </MuiPickersUtilsProvider>
          </li>
          <li className="textBoxTitle">
            <Input
              type="text"
              name="p_name"
              value={title}
              onChange={handleChange}
              placeholder="title"
              className="titleInput"
            />
          </li>
          <li className="textBox">
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
            <Btn onClick={updTv}>更新</Btn>
            <Btn onClick={delTv}>DELETE</Btn>
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

export default Program;

const RemoveIcon = styled(RemoveCircleOutlineIcon)({
  // TODO:高さがselectorsと一緒になるように揃えたい
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.5',
    transition: 'opacity 0.5s',
  },
});
