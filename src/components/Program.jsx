import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, Input, TextField } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import styled from '@material-ui/styles/styled';
import NativeSelect from '@mui/material/NativeSelect';
import jaLocale from 'date-fns/locale/ja';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import exportFunction from '../functions/TeamIdToName';

/**
 *　TV１件を表示するコンポーネント
 *
 * @param {object} program
 * @returns jsx
 */
const Program = ({ program, teamId, regPmList }) => {
  const moment = require("moment");
  const [title, setTitle] = useState('');
  const [verTitle, setVerTitle] = useState('');
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
  const [addPrelFlg, setAddPrelFlg] = useState(false);
  const [editedFlg, setEditedFlg] = useState(false);
  const [media, setMedia] = useState(1);

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

    const outerArrReg = [];

    setRegPmOptionList(outerArrReg);

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
            window.location.href = newUrl;
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
      case 'p_name':
        setTitle(txt);
        break;
      case 'description':
        setDescription(txt);
        break;
      case 'verTitle':
        setVerTitle(txt);
        setTitle(txt);
        break;
      case 'selectedRegPm':
        setSelectedRegPm(txt);
        break;
      default:
        break;
    }
  };

  // 手入力で変更したirelを反映します。IDはそのまま使う（not新規but更新)
  const handleChangeTeam = e => {
    var arr = e.target.value.split(":");
    var teamId = exportFunction.nameToTeamId(arr[0]);
    var index = arr[1];
    let tmpList = [...teamIdList];
    tmpList[index] = teamId;
    setTeamIdList(tmpList);
  }
  
  // 新しいprelを配列に追加します(新規not更新)
  const handleChangeAddPrel = e => {
    var teamId = exportFunction.nameToTeamId(e.target.value);
    let tmpList = [...teamIdList];
    tmpList.push(teamId);
    setTeamIdList(tmpList);
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

    let tmpList = [...teamIdList];
    // imrelデータでなく、irelが最低1つあれば削除可能。imrelデータだったら未選択のままにして、ポストしてdel_flg=trueにしましょう
    if (tmpList.length > 1) {
      tmpList.splice(index, 1);
    }
    setTeamIdList(tmpList);
  }

  // メンバーがprelMに入っていなかったら追加、入っていたら抜く
  const togglePrelM = (memberId) => {
    var tmpList = [...memIdList];
    // https://stackoverflow.com/questions/61997123/how-to-delete-a-value-from-array-if-exist-or-push-it-to-array-if-not-exists
    if(!tmpList.includes(memberId)){ //checking weather array contain the id
        tmpList.push(memberId); //adding to array because value doesnt exists
    }else{
        tmpList.splice(tmpList.indexOf(memberId), 1); //deleting
    }
    setMemIdList(tmpList);
  }

  // Program一括選択のためにboxを押したら選択/解除する
  const toggleSelectedProgram = () => {
    if (editedFlg) {
      setEditedFlg(false);
    } else {
      setEditedFlg(true);
    }
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
          <ul style={media === 1 ? row : column}>
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
            <li style={media === 1 ? null : column}>
              {teamIdList !== null && teamIdList !== undefined ? (
                teamIdList.map((e, index) => (
                  <div class="flex_row">
                    <NativeSelect
                      labelId="demo-simple-select-label"
                      id={e}
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
                <Btn onClick={toggleAddPrelFlg}>+prel</Btn>
              )}
            </li>
            <li className={media === 1 ? "textBox" : "textBoxSp"}>
              <span className='text_blue'>番組データ名</span>
              <p>{title}</p>
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
                regPmList.map((f, index) => (
                  <option key={f.regularPM.title} value={f.regularPM.regular_pm_id}>
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
                name="verTitle"
                value={verTitle}
                label="番組名"
                onChange={handleChange}
                placeholder="verTitle"
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
              <Btn100 onClick={registerPM}>PM登録</Btn100>
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

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: '#FFF2F2',
  margin: '10px 0',
  color: 'black',
});

const Btn100 = styled(Button)({
  marginLeft: '26px',
  background: '#FFF2F2',
  margin: '10px 0',
  color: 'black',
  width: '100%',
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

const row = {
  "display" : "flex",
  "flex-direction" : "row"
}

const column = {
  "display" : "flex",
  "flex-direction" :"column"
}
