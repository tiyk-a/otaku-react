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
const RegPmUpdate = ({regPmList, teamId}) => {

  const [regPm, setRegPm] = useState('');
  const [displayForm, setDisplayForm] = useState(false);
  const [prel, setPrel] = useState([]);
  const [prelM, setPrelM] = useState([]);
  const [id, setId] = useState('');
  const [teamIdList, setTeamIdList] = useState([]);
  const [addPrelFlg, setAddPrelFlg] = useState(false);
  const [staKey, setStaKey] = useState('');
  const [prelObj, setPrelObj] = useState([]);
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

  /**
   * 放送局リスト[id...]を変更します
   * 
   * @param {*} e 
   */
  const handleChangeStaList = staId => {
    // 1. Make a shallow copy of the items
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

            // elem.teamId = elem.teamId;
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
      var tmArr = [];
      prel.forEach((r) => {
        tmArr.push(r[2]);
      });
      prelM.forEach((r) => {
        tmArr.push(r[2]);
      });
      const data = {
        title: e.target.value,
        tm_id_arr: tmArr,
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
            regPmList.map(pm => <p>{pm.title}</p>)):(<p>N/A</p>)}
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
