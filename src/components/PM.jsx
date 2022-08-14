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
// import exportFunction from '../functions/TeamIdToName';
import NativeSelect from '@mui/material/NativeSelect';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const PM = ({ pm, teamId }) => {
  var exportFunction = require('../functions/TeamIdToName');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [verList, setVerList] = useState([]);
  const [teamIdList, setTeamIdList] = useState([]);
  const [memIdList, setMemIdList] = useState([]);
  const [allTeamIdList, setAllTeamIdList] = useState([]);
  const [allMemIdList, setAllMemIdList] = useState([]);
  const [id, setId] = useState('');
  const [addPrelFlg, setAddPrelFlg] = useState(false);
  const [editedFlg, setEditedFlg] = useState(false);
  const [showMem, setShowMem] = useState(false);
  const [media, setMedia] = useState(1);

  useEffect(() => {
    isSmartPhone();
    setId(pm.id);
    setTitle(pm.title);
    if (pm.description !== null && pm.description !== undefined) {
      setDescription(pm.description);
    } else {
      setDescription("");
    }
    setTeamIdList(pm.teamArr);
    setMemIdList(pm.memArr);
    setAllTeamIdList(exportFunction.getAllTeam());
    setAllMemIdList(exportFunction.getAllMember());

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
  }, [pm.description, pm.id, pm.teamIdList, pm.memIdList, pm.title, pm.verList]);

  // メディア判別
  const isSmartPhone = () => {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      // SP
      setMedia(2);
    } else {
      setMedia(1);
    }
  }

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
      pm_id: pm.id,
      title: title,
      description: description,
      teamArr: teamIdList.join(','),
      memArr: memIdList.join(','),
      verList: verList
    }

    await axios
    .post(ApiPath.PM + pm.id, data)
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
  };

  const delPm = async () => {
    await axios
    .delete(ApiPath.PM + pm.id)
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

  const handleChangeTeam = e => {
    setTeamIdList(exportFunction.handleChangeTeam(e, teamIdList));
  }

  // 新しいprelを配列に追加します(新規not更新)
  const handleChangeAddPrel = e => {
    setTeamIdList(exportFunction.addTeam(e.target.value, teamIdList));
  }

  const toggleShowMem = () => {
    if (!showMem) {
      setShowMem(true);
    } else {
      setShowMem(false);
    }
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
    setTeamIdList(exportFunction.minusTeam(index, teamIdList));
  }

  // メンバーがprelMに入っていなかったら追加、入っていたら抜く
  const togglePrelM = (memberId) => {
    setMemIdList(exportFunction.toggleMem(memberId, memIdList));
  }

  return (
    <div className={editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"} onClick={toggleSelectedItem}>
      {editedFlg
        ? (<div className="target_pm" id={pm.id} data-teamid={teamId} data-title={title} data-description={description} data-teamarr={teamIdList} data-memarr={memIdList}></div>)
        : (<div id={pm.id} data-teamid={teamId}></div>)}
      <Text>
        <ul style={media === 1 ? row : column}>
          <li>
            <p>pmId: {pm.id}</p>
            {verList !== null && verList !== undefined ? (
              <ul style={media === 1 ? row : column}>
                {verList.map((e, index) => (
                  <li style={media === 1 ? row : column}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
                      <DateTimePicker
                      label="on_air_date"
                      value={e.on_air_date}
                      // onChange={handleChangeDate}
                      format="yyyy/MM/dd HH:mm"
                      />
                    </MuiPickersUtilsProvider>
                    <br />
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
            {function() {
              if (showMem) {
                return (
                  <Btn onClick={toggleShowMem}>Mem編集完了</Btn>
                )
              } else {
                return (
                  <Btn onClick={toggleShowMem}>Mem編集</Btn>
                )
              }
            }()}
            {teamIdList !== null && teamIdList !== undefined ? (
              teamIdList.map((e, index) => (
                <div  style={media === 1 ? row : column}>
                  <NativeSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue=""
                    value={exportFunction.teamIdToName(e) + ":" + index}
                    label="Team"
                    onChange={handleChangeTeam}
                    name={index}
                  >
                    {allTeamIdList !== null && allTeamIdList !== undefined ? (
                      allTeamIdList.map((f, index2) => (
                      <option key={e} value={exportFunction.teamIdToName(f.id) + ":" + index}>
                      {exportFunction.teamIdToName(f.id)}
                      </option>
                      ))
                    ) : (
                      <></>
                    )}
                  </NativeSelect>
                  {e === 4 ? (
                    <RemoveIcon onClick={() => minusPrel(index)} />
                  ) : (null)}
                  {function() {
                    if (showMem) {
                      return (
                        <div style={media === 1 ? row : column} class="width_6rem">
                          {function() {
                            if (allMemIdList !== null && allMemIdList !== undefined) {
                              return (
                                <div>
                                  {allMemIdList.map((g, index3) => (
                                    <div>
                                      {function() {
                                        if (g.teamId === Number(e)) {
                                          if (memIdList.includes(g.id)) {
                                            return (
                                              <div>
                                                <p className="colorRed" onClick={() => togglePrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                              </div>
                                          )
                                          } else {
                                            return (
                                              <div>
                                                <p onClick={() => togglePrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
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
                      )
                    }
                  }()}
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
                  teamIdList.map((f, index4) => (
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
          <li style={media === 1 ? row : column}>
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
  background: '#FFF2F2',
  margin: '10px 0',
  color: 'black',
});

export default PM;

const row = {
  "display" : "flex",
  "flex-direction" : "row"
}

const column = {
  "display" : "flex",
  "flex-direction" :"column"
}

const RemoveIcon = styled(RemoveCircleOutlineIcon)({
  // TODO:高さがselectorsと一緒になるように揃えたい
  cursor: 'pointer',
  '&:hover': {
  opacity: '0.5',
  transition: 'opacity 0.5s',
  },
});
