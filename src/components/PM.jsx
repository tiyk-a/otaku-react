import { Box, Button, TextField, Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
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
  const [addTeamFlg, setAddTeamFlg] = useState(false);
  const [editedFlg, setEditedFlg] = useState(false);
  const [showMem, setShowMem] = useState(false);
  const [media, setMedia] = useState(1);

  /**
   * 
   */
  useEffect(() => {
    isSmartPhone();
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
  }, [pm.description, pm.teamIdList, pm.memIdList, pm.title, pm.verList]);

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
   * 編集した・しないtoggle
   */
  const toggleEditedFlg = () => {
    if (editedFlg) {
      setEditedFlg(false);
    } else {
      setEditedFlg(true);
    }
  }

  /**
   * 既存商品の更新
   */
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

  /**
   * PM削除
   */
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

  /**
   * 各要素が入力されたらSTATEをアップデート
   * @param {*} e 
   */
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

  /**
   * Indexのteamを変更
   * @param {*} e 
   */
  const changeTeamByIndex = e => {
    setTeamIdList(exportFunction.changeTeamByIndex(e, teamIdList));
  }

  /**
   * 新しいTeamを追加します(新規not更新)
   * @param {*} e 
   */
  const addTeam = e => {
    setTeamIdList(exportFunction.addTeam(e.target.value, teamIdList));
  }

  /**
   * Member表示・非表示toggle
   */
  const toggleShowMem = () => {
    if (!showMem) {
      setShowMem(true);
    } else {
      setShowMem(false);
    }
  }

  /**
   * Teamを追加する
   */
  const toggleAddTeam = () => {
    if (addTeamFlg) {
      setAddTeamFlg(false);
    } else {
      setAddTeamFlg(true);
    }
  }

  /**
   * そのチームを抜きます
   * @param {*} index 
   */
  const minusTeam = (index) => {
    setTeamIdList(exportFunction.minusTeam(index, teamIdList));
  }

  /**
   * メンバーが入っていなかったら追加、入っていたら抜く
   * @param {*} memberId 
   */
  const toggleMem = (memberId) => {
    setMemIdList(exportFunction.toggleMem(memberId, memIdList));
  }

  return (
    <div className={editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"} onClick={toggleEditedFlg}>
      {editedFlg
        ? (<div className="target_pm" id={pm.id} data-teamid={teamId} data-title={title} data-description={description} data-teamarr={teamIdList} data-memarr={memIdList}></div>)
        : (<div id={pm.id} data-teamid={teamId}></div>)}
      <Text>
        <ul className={media === 1 ? "row" : "column"}>
          <li>
            <p>pmId: {pm.id}</p>
            <p>{pm.date}</p>
            {verList !== null && verList !== undefined ? (
              <ul className={media === 1 ? "row" : "column"}>
                {verList.map((e, index) => (
                  <li className={media === 1 ? "row" : "column"}>
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
                  <Button className="button-pink" onClick={toggleShowMem}>Mem編集完了</Button>
                )
              } else {
                return (
                  <Button className="button-pink" onClick={toggleShowMem}>Mem編集</Button>
                )
              }
            }()}
            {teamIdList !== null && teamIdList !== undefined ? (
              teamIdList.map((e, index) => (
                <div  className={media === 1 ? "row" : "column"}>
                  <NativeSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue=""
                    value={exportFunction.teamIdToName(e) + ":" + index}
                    label="Team"
                    onChange={changeTeamByIndex}
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
                    <p onClick={() => minusTeam(index)} > - </p>
                  ) : (null)}
                  {function() {
                    if (showMem) {
                      return (
                        <div className={media === 1 ? "row" : "column"} class="width_6rem">
                          {function() {
                            if (allMemIdList !== null && allMemIdList !== undefined) {
                              return (
                                <div>
                                  {allMemIdList.map((g, index3) => (
                                    <div>
                                      {function() {
                                        if (g.teamId === Number(e)) {
                                          if (memIdList.includes(g.id) || memIdList.includes(g.id.toString())) {
                                            return (
                                              <div>
                                                <p className="colorRed" onClick={() => toggleMem(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                              </div>
                                          )
                                          } else {
                                            return (
                                              <div>
                                                <p onClick={() => toggleMem(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
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
            {addTeamFlg ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={exportFunction.teamIdToName(4)}
                label="Age"
                onChange={addTeam}
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
              <Button className="button-pink" onClick={toggleAddTeam}>+Team</Button>
            )}
          </li>
          <li className={media === 1 ? "row" : "column"}>
            <Button className="button-pink" onClick={updPm}>更新</Button>
            <Button className="button-pink" onClick={delPm}>DELETE</Button>
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

export default PM;
