import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, Input, TextField } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import styled from '@material-ui/styles/styled';
import NativeSelect from '@mui/material/NativeSelect';
import jaLocale from 'date-fns/locale/ja';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const Program = ({ program, teamId, regPmList }) => {
  var exportFunction = require('../functions/TeamIdToName');
  
  const moment = require("moment");
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [date, setDate] = useState('');
  const [teamIdList, setTeamIdList] = useState([]);
  const [memIdList, setMemIdList] = useState([]);
  const [allTeamIdList, setAllTeamIdList] = useState([]);
  const [allMemIdList, setAllMemIdList] = useState([]);
  const [relPm, setRelPM] = useState([]);
  const [regPmOptionList, setRegPmOptionList] = useState([]);
  const [id, setId] = useState('');
  const [pmId, setPmId] = useState('');
  const [selectedRegPm, setSelectedRegPm] = useState('');
  const [addTeamFlg, setAddTeamFlg] = useState(false);
  const [editedFlg, setEditedFlg] = useState(false);
  const [media, setMedia] = useState(1);
  const [regKey, setRegKey] = useState("");

  useEffect(() => {

    // メディア判定
    isSmartPhone();

    setId(program.id);
    setTitle(program.title);
    if (program.description !== null && program.description !== undefined) {
      setDescription(program.description);
    } else {
      setDescription("");
    }
    
    if (program.url !== null && program.url !== undefined) {
      setUrl(program.url);
    } else {
      setUrl("");
    }
    
    setDate(moment(program.date).format('YYYY/MM/DD HH:mm'));

    setRelPM(program.relPmList);

    setAllTeamIdList(exportFunction.getAllTeam());
    setAllMemIdList(exportFunction.getAllMember());
    setTeamIdList(program.teamArr);
    setMemIdList(program.memArr);
    setRegPmOptionList(regPmList);
  }, [moment, program.date, program.description, program.id, program.teamArr, program.memArr, program.title, program.url]);

  // メディア判別
  const isSmartPhone = () => {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      // SP
      setMedia(2);
    } else {
      setMedia(1);
    }
  }

  // PM登録
  const registerPM = async () => {
    if (teamId !== undefined) {
      if (pmId === 0) {
        setPmId(undefined);
      }

      const data = {
        program_id: id,
        pm_id: pmId,
        teamArr: teamIdList.join(','),
        memArr: memIdList.join(','),
        title: title,
        description: description,
        on_air_date: date,
        station_id: program.station_id,
      }

      await axios
        .post(ApiPath.TV, data)
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

  // 入力された日付をSTATEに反映
  const handleChangeDate = e => {
    const newDate = moment(e).format('YYYY/MM/DD HH:mm');
    setDate(newDate);
  };

  // 各要素が入力されたらSTATEをアップデート
  const handleChange = e => {
    const txt = e.target.value;

    switch (e.target.name) {
      case 'title':
        setTitle(txt);
        break;
      case 'description':
        setDescription(txt);
        break;
      case 'selectedRegPm':
        var arr = txt.split(":");
        console.log(txt);
        console.log(arr);
        setSelectedRegPm(arr[0]);
        // teamの登録がなかったら登録する
        if (arr[1] !== null && arr[1] !== undefined && arr[1] !== "") {
          var tmpArr = arr[1].split(",");
          console.log(tmpArr);
          tmpArr.map((tId) => {
            if (!teamIdList.includes(tId)) {
              console.log(addTeam(tId));
              setTeamIdList(addTeam(tId));
            }
          })
        }
        // memの登録がなかったら登録する
        if (arr[2] !== null && arr[2] !== undefined && arr[2] !== "") {
          var tmpArr = arr[2].split(",");
          console.log(tmpArr);
          tmpArr.map((mId) => {
            if (!memIdList.includes(mId)) {
              console.log(addMem(mId));
              setMemIdList(addMem(mId));
            }
          })
        }
        break;
      case 'regSearch':
        setRegKey(txt);
        break;
      default:
        break;
    }
  };

  /**
   * チームの変更。not新規but更新
   * 
   */
  const changeTeamByIndex = e => {
    setTeamIdList(exportFunction.changeTeamByIndex(e, teamIdList));
  }
  
  /**
   * チームIDを追加する(新規not更新)
   * 
   * @param {*} e 
   */
  const addTeam = e => {
    console.log(teamIdList);
    var val = "";
    if (e.target !== undefined && e.target.value !== undefined) {
      val = e.target.value;
    } else {
      val = e;
    }
    if (!teamIdList.includes(e)) {
      var tmp = [...teamIdList];
      tmp.push(e);
      return tmp;
    }
    // setTeamIdList(exportFunction.addTeam(val, teamIdList));
  }

  /**
   * チームを追加する・しない
   */
  const toggleAddTeamFlg = () => {
    if (addTeamFlg) {
      setAddTeamFlg(false);
    } else {
      setAddTeamFlg(true);
    }
  }

  /**
   * チームを抜きます
   * 
   * @param {*} index 
   */
  const minusTeam = (index) => {
    setTeamIdList(exportFunction.minusTeam(index, teamIdList));
  }

  /**
   * メンバーIDを追加する(toggleしない)
   * すでに追加されてる時は何もしない。
   * 
   * @param {*} e 
   */
  const addMem = e => {
    if (!memIdList.includes(e)) {
      var tmp = [...memIdList];
      tmp.push(e);
      return tmp;
    }
  }

  /**
   * メンバーをtoggle
   * 
   * @param {*} memberId 
   */
  const toggleMem = (memberId) => {
    setMemIdList(exportFunction.toggleMem(memberId, memIdList));
  }

  /**
   * 一括選択のtoggle
   * 
   */
  const toggleSelectedProgram = () => {
    if (editedFlg) {
      setEditedFlg(false);
    } else {
      setEditedFlg(true);
    }
  }

  /**
   * キーワードよりレギュラー番組を検索します
   */
  const searchRegByKey = (e) => {
    if (e.keyCode === 13) {
      searchReg(regKey);
      setRegKey("");
    }
  }

  /**
   * レギュラー番組を検索します
   * 
   * @param {*} key 
   */
  const searchReg = async (key) => {
    await axios
      .get(ApiPath.PM + 'searchReg?key=' + key)
      .then(response => {
        console.log(response.data);
        setRegPmOptionList(response.data);
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
    <div>
      <a href={url} target="_blank">
        <div className="link"><p>詳細</p></div>
      </a>
      <div className={editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"} onClick={toggleSelectedProgram}>
        {editedFlg
          ? (<div className="target_p" id={program.id} data-pmid={pmId} data-teamid={teamId} data-title={title} data-description={description} data-teamarr={teamIdList} data-memarr={memIdList}></div>)
          : (<div id={program.id} data-teamid={teamId}></div>)}
        <Text>
          <ul className={media === 1 ? "row" : "column"}>
            <li>
              <p>pId:{program.id}</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={jaLocale}>
                <DateTimePicker
                  label="on_air_date"
                  value={date}
                  onChange={handleChangeDate}
                  format="yyyy/MM/dd HH:mm"
                />
              </MuiPickersUtilsProvider>
            </li>
            <li className={media === 1 ? null : "column"}>
              {teamIdList !== null && teamIdList !== undefined ? (
                teamIdList.map((e, index) => (
                  <div class="flex_row">
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
                    ) : (null)
                    }
                    <div class="flex_column width_6rem">
                      {function() {
                        if (allMemIdList !== null && allMemIdList !== undefined) {
                          return (
                            <div>
                              {allMemIdList.map((g, index3) => (
                                <div>
                                  {function() {
                                    if (Number(g.teamId) === Number(e)) {
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
                {allTeamIdList !== null && allTeamIdList !== undefined ? (
                  allTeamIdList.map((f, index4) => (
                    <option key={4} value={exportFunction.teamIdToName(f.id)}>
                      {exportFunction.teamIdToName(f.id)}
                    </option>
                    ))
                ) : (
                  <></>
                )}
                </NativeSelect>
              ) : (
                <Button className="button-pink" onClick={toggleAddTeamFlg}>+prel</Button>
              )}
            </li>
            <li className={media === 1 ? "textBox" : "textBoxSp"}>
              {/* レギュラー番組候補 */}
              <span className='text_blue'>レギュラー番組</span>
              <NativeSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={selectedRegPm}
                label="selectedRegPm"
                onChange={handleChange}
                name="selectedRegPm"
              >
              {regPmOptionList !== null && regPmOptionList !== undefined ? (
                regPmOptionList.map((f, index) => (
                  <option key={f.title} value={f.regular_pm_id + ":" + f.teamArr + ":" + f.memArr}>
                    {f.title}
                  </option>
                  ))
              ) : (
                <></>
              )}
              {regPmList !== null && regPmList !== undefined ? (
                regPmList.map((f, index) => (
                  <option key={f.regularPM.title} value={f.regularPM.regular_pm_id + ":" + f.regularPM.teamArr + ":" + f.regularPM.memArr}>
                    {f.regularPM.title}
                  </option>
                  ))
              ) : (
                <></>
              )}
              <option key={4} value={""}>
                "N/A"
              </option>
              </NativeSelect>
              {selectedRegPm !== undefined && selectedRegPm !== "" ? (
                regPmList.map((regPm, index) => (
                  String(regPm.regularPM.regular_pm_id) === String(selectedRegPm) ? (
                    <>
                      {regPm.castList !== undefined && regPm.castList.length > 0 ? (
                        regPm.castList.map((cast) => {
                          return (
                            <>
                            {function() {
                              if (cast < 30) {
                                return (
                                  <p>{exportFunction.teamIdToName(cast)}</p>
                                )
                              } else {
                                return (
                                  <p>{exportFunction.memberIdToName(cast)}</p>
                                )
                              }
                            }()}
                            </>
                          )
                        })
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <></>
                  )
                ))
              ) : (
                <></>
              )}
              <Input
                type="text"
                name="regSearch"
                value={regKey}
                onChange={handleChange}
                placeholder="レギュラー番組検索"
                className="titleInput"
                onKeyDown={searchRegByKey}
              />
              <p className='text_blue'>放送局</p>
              {selectedRegPm !== undefined && selectedRegPm !== "" ? (
                regPmList.map((regPm, index) => (
                  String(regPm.regularPM.regular_pm_id) === String(selectedRegPm) ? (
                    <>
                      {regPm.stationMap !== undefined ? (
                        Object.keys(regPm.stationMap).map(key => {
                          return (
                            <p>{regPm.stationMap[key]}</p>)}
                          )
                      ) : (
                        <></>
                      )}
                      <></>
                    </>
                  ) : (
                    <></>
                  )
                ))
              ) : (
                <></>
              )}
              <span className='text_blue'>PMタイトル</span>
              <Input
                type="text"
                name="title"
                value={title}
                label="番組名"
                onChange={handleChange}
                placeholder="title"
                className="titleInput"
              />
              <span className='text_blue'>説明</span>
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
              <br />
              <Button className="button-pink" onClick={registerPM}>PM登録</Button>
            </li>
            {/* pm_ver */}
            <li>
              <p>放送</p>
              {program.station_name}
              <br />
              <span className='text_blue'>類似予定</span>
              {function() {
                if (relPm.length > 0) {
                  return (
                    relPm.map((f, index) => (
                      <p>{f}</p>
                    ))
                  )
                } else {
                  return (
                    <div>
                      <p>2023/01/20 レギュラー番組名 PMタイトル</p>
                      <p>説明</p>
                    </div>
                  )
                }
              }()}
            </li>
          </ul>
        </Text>
      </div>
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

export default Program;
