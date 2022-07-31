import { Input, Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import NativeSelect from '@mui/material/NativeSelect';
import exportFunction from '../functions/TeamIdToName';
import FormControl from '@mui/material/FormControl';

/**
 * レギュラーPM
 *
 * @returns jsx
 */
const RegPmUpdate = ({regPmList}) => {

  const [regPm, setRegPm] = useState('');
  const [displayForm, setDisplayForm] = useState(false);
  const [teamArr, setTeamArr] = useState([]);
  const [memArr, setMemArr] = useState([]);
  const [teamAllMem, setTeamAllMem] = useState([]);
  const [id, setId] = useState('');
  const [teamIdList, setTeamIdList] = useState([]);
  const [addTeamFlg, setAddTeamFlg] = useState(false);
  const [staKey, setStaKey] = useState('');
  const [staSearchRes, setStaSearchRes] = useState([]);
  const [staList, setStaList] = useState([]);

  useEffect(() => {
    setTeamIdList(exportFunction.getAllTeam());
  }, []);

  /**
   * handleChange
   * 
   * @param {*} e 
   */
  const handleChange = e => {
    const txt = e.target.value;

    switch (e.target.name) {
      case 'regPm':
        setRegPm(txt);
        break;
      case 'staKey':
        setStaKey(txt);
        break;
      default:
        break;
    }
  };

  /**
   * teamArrにteamを追加します
   * 
   * @param {*} e 
   */
  const addTeamArr = e => {

    var teamId = e.target.value;
    let vers = [...teamArr];
    vers.push(parseInt(teamId));
    setTeamArr(vers);
    
    // teamAllMemもセットする
    var tmpArr =[];
    vers.forEach((rel) => {
      var memList = exportFunction.getMemIdListOfTeam(rel);
      var tmp = {
        teamId: rel,
        memList: memList,
      }
      tmpArr.push(tmp);
    });
    setTeamAllMem(tmpArr);
  }

  /**
   * 放送局リスト[id...]を変更します
   * 
   * @param {*} e 
   */
  const handleChangeStaList = staId => {
    let vers = [...staList];

    if (staList.includes(staId)) {
      const index = vers.indexOf(staId);
      if (index > -1) { // only splice array when item is found
        vers.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      vers.push(staId);
    }
    setStaList(vers);
  }

  const toggleAddTeamFlg = () => {
    if (addTeamFlg) {
      setAddTeamFlg(false);
    } else {
      setAddTeamFlg(true);
    }
  }

  // そのチームをteamArrから抜きます
  const minusTeam = (index) => {
    let vers = [...teamArr];
    // teamArrが最低1つあれば削除可能
    if (vers.length > 1) {
      vers.splice(index, 1);
    }
    setTeamArr(vers);
  }

  /**
   * メンバーがmemArrに入っていなかったら追加、入っていたら抜く
   * 
   * @param {*} memberId 
   */
  const toggleMem = (memberId) => {
    let vers = [...memArr];
    let ver2 = vers.filter(rel => rel !== memberId);

    if (vers.length === ver2.length) {
      ver2.push(memberId);
    }
    setMemArr(ver2);
  }

  const isEmpty = (obj) => {
    return !Object.keys(obj).length;
  }

  /**
   * toggleボタン・フォームの表示
   */
  const toggleDisplayForm = () => {
    if (displayForm) {
      setDisplayForm(false);
    } else {
      setDisplayForm(true);
    }
  }

  // 新しいregpmを追加しますAJAX
  const handleChangeAddRegPm = async(e) => {
    if (e.keyCode === 13) {
      let tm_arr = teamArr.concat(memArr);
      const data = {
        title: e.target.value,
        tm_id_arr: tm_arr,
        station_id_arr: staList,
      }

      await axios
      .post(ApiPath.PM + "reg/new", data)
      .then(response => {
        if (response.data) {
          var tmpUrl = window.location.href;
          var newUrl = tmpUrl.replace("http://localhost:3000/", "");
          window.location.href = newUrl;
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
      setRegPm("");
    }
  }

  const searchImByKw = (e) => {
    if (e.keyCode === 13) {
      searchSta(staKey);
      setStaKey("");
    }
  }

  /**
   * DBからstation検索
   * 
   * @param {} key 
   */
  const searchSta = async (key) => {
    await axios
      .get(ApiPath.PM + 'search/sta?key=' + key)
      .then(response => {
        console.log(response.data);
        const resList = response.data;
        var tmpList = [];
        resList.forEach(data => {
          tmpList.push(data);
        });
        setStaSearchRes(tmpList);
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

  return (
    <div className='add_regpm_parent'>
      <div className='add_regpm_btn'>
        {displayForm ? (
          <Btn onClick={toggleDisplayForm}>＜</Btn>
        ):(
          <Btn onClick={toggleDisplayForm}>＞</Btn>
        )}
      </div>
      {displayForm ? (
        <div className='add_regpm_box'>
          {/* レギュラーPM追加 */}
          <p className='text_blue'>追加レギュラーPM</p>
          <ul>
            {/* レギュラーPMタイトル */}
            <li>
              <p className='text_blue'>タイトル</p>
              <Input
                type="text"
                name="regPm"
                value={regPm}
                onChange={handleChange}
                placeholder="レギュラー番組追加"
                className="titleInput"
                onKeyDown={handleChangeAddRegPm}
              />
            </li>
            {/* 出演者 */}
            <li>
              <p className='text_blue'>出演者選択</p>
              {teamArr !== null && teamArr !== undefined ? (
                teamArr.map((tId, index) => (
                  <div class="flex_row">
                    <NativeSelect
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue=""
                      value={tId}
                      label="Age"
                      onChange={addTeamArr}
                      name={index}
                    >
                    {teamIdList !== null && teamIdList !== undefined ? (
                      teamIdList.map((f, index) => (
                        <option key={tId} value={f.id}>
                          {f.name}
                        </option>
                        ))
                    ) : (
                      <></>
                    )}
                    </NativeSelect>
                    {tId === 4 ? (
                      <RemoveIcon onClick={() => minusTeam(index)} />
                    ) : (null)
                    }
                    <div class="flex_column width_6rem">
                      {teamAllMem.map((tmObj, index) => (
                        <div>
                          {function() {
                            if (tmObj.teamId === tId) {
                              return (
                                <>
                                {tmObj.memList.map((memId) => {
                                  return (
                                    <>
                                    {function() {
                                      if (memArr.includes(memId)) {
                                        return (
                                          <p onClick={() => toggleMem(memId)} className="colorRed" data-memId={""}>
                                            {exportFunction.memberIdToName(memId)}
                                          </p>
                                        )
                                      } else {
                                        return (
                                          <p onClick={() => toggleMem(memId)} data-memId={""}>
                                            {exportFunction.memberIdToName(memId)}
                                          </p>
                                        )
                                      }
                                    }()}
                                    </>
                                  )
                                })}
                                </>
                              )
                            }
                          }()}
                        </div>
                      ))}
                    </div>
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
                  value={4}
                  label="Age"
                  onChange={addTeamArr}
                  name="tmpPrel"
                >
                {teamIdList !== null && teamIdList !== undefined ? (
                  teamIdList.map((f, index) => (
                    <option key={4} value={f.id}>
                      {exportFunction.teamIdToName(f.id)}
                    </option>
                    ))
                ) : (
                  <></>
                )}
                </NativeSelect>
              ) : (
                <Btn onClick={toggleAddTeamFlg}>+teamArr</Btn>
              )}
            </li>
            {/* 放送局は複数選択が可能 */}
            <li>
              <p className='text_blue'>放送局選択</p>
              <FormControl fullWidth>
                <Input
                  type="text"
                  name="staKey"
                  value={staKey}
                  onChange={handleChange}
                  placeholder="放送局検索"
                  className="titleInput"
                  onKeyDown={searchImByKw}
                />
                {/* 放送局検索結果表示
                    検索結果があれば表示、押して赤文字にしたら追加される
                    複数選択OK
                 */}
                {staSearchRes.length > 0 ? (
                    staSearchRes.map((e, index) => (
                      staList.includes(e.station_id) ? (
                        <p onClick={() => handleChangeStaList(e.station_id)} className="colorRed" data-staid={e.station_id}>
                          {e.station_name}
                        </p>
                      ) : (
                        <p onClick={() => handleChangeStaList(e.station_id)} data-staid={e.station_id}>
                          {e.station_name}
                        </p>
                      )
                    ))
                ) : (
                  <></>
                )}
              </FormControl>
            </li>
          </ul>
          <p className='text_blue'>既存のregpm</p>
          {regPmList.length > 0 ? (
            regPmList.map(pm => <p>{pm.regularPM.title}</p>)):(<p>N/A</p>)}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  background: '#FFF2F2',
  margin: '5px 0',
  color: 'black',
});

const RemoveIcon = styled(RemoveCircleOutlineIcon)({
  // TODO:高さがselectorsと一緒になるように揃えたい
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.5',
    transition: 'opacity 0.5s',
  },
});

export default RegPmUpdate;
