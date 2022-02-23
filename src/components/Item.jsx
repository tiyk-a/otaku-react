import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, Input } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import styled from '@material-ui/styles/styled';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import jaLocale from 'date-fns/locale/ja';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import exportFunctionRel from '../functions/RelManage';
import exportFunction, { getMemberObjListOfTeam } from '../functions/TeamIdToName';


/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const Item = ({ item, teamId, itemMList, updateDirection }) => {
  const moment = require("moment");
  const [id, setId] = useState('');
  const [imId, setImId] = useState('');
  const [intoId, setIntoId] = useState('');
  const [date, setDate] = useState('');
  const [amazon_image, setAmazon_image] = useState('');
  const [fromIM, setFromIM] = useState('');
  const [toIM, setToIM] = useState('');
  const [title, setTitle] = useState('');
  const [imTitle, setImTitle] = useState("");
  const [otherImTitle, setOtherImTitle] = useState("");
  const [tmpVer, setTmpVer] = useState('');
  const [verArr, setVerArr] = useState([]);
  const [imKey, setImKey] = useState('');
  const [imSearchRes, setImSearchRes] = useState([]);
  const [editedFlg, setEditedFlg] = useState(false);
  const [irel, setIrel] = useState([]);
  const [irelM, setIrelM] = useState([]);
  const [teamIdList, setTeamIdList] = useState([]);
  const [memberIdList, setMemberIdList] = useState([]);
  const [addIrelFlg, setAddIrelFlg] = useState(false);
  const [addIrelMFlg, setAddIrelMFlg] = useState(false);

  useEffect(() => {
    // irel(team)を入れます
    extractAndSetIrel(item);

    // irelM(member)を入れます
    extractAndSetIrelM(item);

    setId(item.id);
    setDate(moment(item.pubDate).format('YYYY-MM-DD'));
    setImId(0);
    setTitle(item.title);
    setTeamIdList(exportFunction.getAllTeam());
    setMemberIdList(exportFunction.getAllMember());
  }, [item.id, item.pubDate, item.title, moment]);

  const nl2br = require('react-nl2br');

  // itemもimも受け付けます。irel/imrelを引き抜いてirelに入れます
  const extractAndSetIrel = (item) => {
    const outerArr = [];
    if (item.relList !== null && item.relList !== undefined && item.relList.length > 0) {
      item.relList.forEach((e) => {
        const innerArr = [];
        // irel/imrelで分岐
        if (e.i_rel_id !== undefined) {
          // [irelId, itemId, teamId, imrelですかフラグ]
          innerArr.push(e.i_rel_id, e.item_id, e.team_id, 0);
        } else {
          // [irelId, itemId, teamId, imrelですかフラグ]
          innerArr.push(e.im_rel_id, e.im_id, e.team_id, 1);
        }
        outerArr.push(innerArr);
      });
      setIrel(outerArr);
    } else {
      setIrel([]);
    }
  }

  // itemもimも受け付けます。irel/imrelを引き抜いてirelMに入れます
  const extractAndSetIrelM = (item) => {
    const outerArrM = [];
    if (item.relMList !== null && item.relMList !== undefined && item.relMList.length > 0) {
      item.relMList.forEach((e) => {
        const innerArrM = [];
        if (e.i_rel_mem_id !== undefined) {
          // [iremlId, irelId, memberId, imrelmですかフラグ]
          innerArrM.push(e.i_rel_mem_id, e.i_rel_id, e.member_id, 0);
        } else {
          // [iremlId, irelId, memberId, imrelmですかフラグ]
          innerArrM.push(e.im_rel_mem_id, e.im_rel_id, e.member_id, 1);
        }
        outerArrM.push(innerArrM);
      });
      setIrelM(outerArrM);
    } else {
      setIrelM([]);
    }
  }

  const registerIM = async () => {
    if (teamId !== undefined) {
      if (imId === 0) {
        setImId(undefined);
      }

      var irelDistinct = exportFunctionRel.getDistinctRel(irel);
      var irelMDistinct = exportFunctionRel.getDistinctRel(irelM);

      const data = {
        item_id: id,
        im_id: imId,
        teamId: teamId,
        imrel: irelDistinct,
        imrelm: irelMDistinct,
        title: title,
        wp_id: "",
        publication_date: date,
        amazon_image: amazon_image,
        del_flg: false,
        vers: verArr,
      }

      console.log(data);
      await axios
        .post(ApiPath.IM, data)
        .then(response => {
          if (response.data) {
            window.location.reload();
          } else {
            console.log(response);
            window.alert("更新エラーです");
          }
        })
        .catch(error => {});
    }
  };

  // 入力された検索ワードをSTATEに反映
  const handleChangeDate = e => {
    setDate(e);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  // 入力された検索ワードをSTATEに反映
  const handleChangeTitle = e => {
    const txt = e.target.value;
    setTitle(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const handleChangeIMTitle = e => {
    const txt = e.target.value;
    setImTitle(txt);
    itemMList.forEach(im => {
      if (im.title === txt) {
        setImId(im.id);
        // relも変更する
        extractAndSetIrel(im);
        extractAndSetIrelM(im);
      }
    });
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const handleChangeOtherIMTitle = e => {
    const txt = e.target.value;
    setOtherImTitle(txt);
    imSearchRes.forEach(item => {
      if (item.title === txt) {
        setImId(item.im_id);
      }
    });
  };

  const handleChangeAmazonImage = e => {
    setAmazon_image(e.target.value);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  }

  const addVerArr = e => {
    if (e.keyCode === 13) {
      setVerArr([...verArr, [null, tmpVer, null]]);
      setTmpVer('');
    }
  }

  const searchImByKw = (e) => {
    if (e.keyCode === 13) {
      searchOtherIm(imKey);
      setImKey("");
    }
  }

  const searchOtherIm = async (key) => {
    await axios
      .get(ApiPath.IM + 'search?key=' + key + '&excludeTeamId=' + teamId)
      .then(response => {
        setImSearchRes(response.data);
      })
      .catch(error => {});
  }

  const delIm = async () => {
    if (teamId !== undefined) {
      await axios
        .delete(ApiPath.ITEM + id)
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
    }
  };

  // 入力された検索ワードをSTATEに反映
  const handleChangeImId = e => {
    const txt = e.target.value;
    setIntoId(txt);
  };

  const handleChangeImKey = e => {
    const txt = e.target.value;
    setImKey(txt);
  };

  // 手入力で変更したirelを反映します。IDはそのまま使う（not新規but更新)
  const handleChangeIrel = e => {
    // var prelId = e.target.name;
    var irelId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...irel];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[irelId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToTeamId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[irelId] = [ver[0], ver[1], ver[2], ver[3]];
    // 5. Set the state to our new copy
    setIrel(vers);
  }

  // 手入力で変更したirelを反映します。IDはそのまま使う（not新規but更新)
  const handleChangeIrelM = e => {
    // var prelId = e.target.name;
    var irelMId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...irelM];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[irelMId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToMemberId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[irelMId] = [ver[0], ver[1], ver[2], ver[3]];
    // 5. Set the state to our new copy
    setIrelM(vers);

    // そのmemberのチームがirelに入ってなかったら自動で入れます
    addTeamByMember(ver[2]);
  }

  // 新しいirelを配列に追加します(新規not更新)
  const handleChangeAddIrel = e => {
    const teamIdTmp = exportFunction.nameToTeamId(e.target.value);
    let vers = [...irel];
    // [irelId, itemId, teamId, imrelですかフラグ]
    vers.push([null, id, teamIdTmp, 0]);
    setIrel(vers);
    setAddIrelFlg(false);
  }

  // そのチームをirelから抜きます
  const minusIrel = (index) => {
    let vers = [...irel];
    // imrelデータでなく、irelが最低1つあれば削除可能。imrelデータだったら未選択のままにして、ポストしてdel_flg=trueにしましょう
    if (vers[index][3] !== 1 && vers.length > 1) {
      vers.splice(index, 1);
    }
    setIrel(vers);
  }

  const handleChangeAddIrelM = e => {
    const memIdTmp = exportFunction.nameToMemberId(e.target.value);
    let vers = [...irelM];
    // [irelMId, irelId, memberId, imrelMですかフラグ]
    vers.push([null, null, memIdTmp, 0]);
    setIrelM(vers);
    setAddIrelMFlg(false);

    // そのmemberのチームがirelに入ってなかったら自動で入れます
    addTeamByMember(memIdTmp);
  }

  // そのチームをirelMから抜きます
  const minusIrelM = (index) => {
    let vers = [...irelM];
    // imrelMデータでなければ削除可能。imrelMデータだったら未選択のままにして、ポストしてdel_flg=trueにしましょう
    if (vers[index][3] !== 1) {
      vers.splice(index, 1);
    }
    setIrelM(vers);
  }

  // そのmemberのチームがirelに入ってなかったら自動で入れます
  const addTeamByMember = (memberId) => {
      var teamOfMem = exportFunction.getTeamIdOfMember(memberId);
      let addFlg = true;
      irel.forEach(rel => {
        if (rel[2] === teamOfMem) {
          addFlg = false;
        }
      });
      if (addFlg) {
        let vers = [...irel];
        const innerArr = [];
        // [irelId, itemId, teamId, imrelですかフラグ]
        innerArr.push(null, id, teamOfMem, 0);
        vers.push(innerArr);
        setIrel(vers);
      }
  }

  // 入力された検索ワードをSTATEに反映
  const handleVerArr = e => {
    const txt = e.target.value;
    setTmpVer(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const updImId = async (e) => {
    if (e.keyCode === 13) {
      await axios
        .get(ApiPath.IM + 'merge?ord=' + id + '&into=' + intoId)
        .then(response => {
          console.log(response);
        })
        .catch(error => {});
      setIntoId('');
    }
  };

  const updFctChk = async (e) => {
    if (imId === null || imId === undefined || imId === 0) {
    } else {
      await axios
        .get(ApiPath.IM + "chk?itemId=" + id + "&imId=" + imId + "&teamId=" + teamId)
        .then(response => {
          window.location.reload();
        })
        .catch(error => {});
    }
  }

  const toggleEditedFlg = () => {
    if (editedFlg) {
      setEditedFlg(false);
    } else {
      setEditedFlg(true);
    }
  }

  const toggleAddIrelFlg = () => {
    if (addIrelFlg) {
      setAddIrelFlg(false);
    } else {
      setAddIrelFlg(true);
    }
  }

  const toggleAddIrelMFlg = () => {
    if (addIrelMFlg) {
      setAddIrelMFlg(false);
    } else {
      setAddIrelMFlg(true);
    }
  }

  const irelMIncludesId = (memberId) => {
    irelM.forEach((e) => {
      if (e[2] === memberId) {
        console.log("***************");
        return true;
      }
    })
    return false;
  }

  // メンバーがirelMに入っていなかったら追加、入っていたら抜く
  const toggleIrelM = (memberId) => {
    let vers = [...irelM];
    let ver2 = vers.filter(rel => rel[2] !== memberId);

    if (vers.length === ver2.length) {
      ver2.push([null, null, memberId, 0]);
    }
    setIrelM(ver2);
  }

  return (
    <div className="itemContainer" className={item.masterId !== null && item.masterId !== undefined ? "postedStyle": editedFlg ? "editedStyle" : "notPostedStyle"}>
      {editedFlg ? (<div className="target_item" id={item.id} data-imid={imId} data-teamid={teamId} data-title={title} data-date={date} data-image={amazon_image} data-verarr={verArr} data-irel={irel} data-irelm={irelM}></div>) : (null)}
      <p>flg: {editedFlg ? "true" : "false"}</p>
      <Text>
        <ul>
          <li>
            {irel !== null && irel !== undefined ? (
              irel.map((e, index) => (
                <div>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue=""
                    value={exportFunction.teamIdToName(e[2])}
                    label="Age"
                    onChange={handleChangeIrel}
                    name={index}
                  >
                  {teamIdList !== null && teamIdList !== undefined ? (
                    teamIdList.map((f, index) => (
                      <MenuItem value={exportFunction.teamIdToName(f.id)} name={e[2]}>{exportFunction.teamIdToName(f.id)}</MenuItem>
                      ))
                  ) : (
                    <></>
                  )}
                  </Select>
                  {e[2] === 4 ? (
                    <RemoveIcon onClick={() => minusIrel(index)} />
                  ) : (null)
                  }
                  {memberIdList !== null && memberIdList !== undefined ? (
                    memberIdList.map((g, index) => (
                      <div>
                        {function() {
                          if (g.teamId === e[2]) {
                            return (
                              <div>
                                {function() {
                                  if (irelM !== null && irelM !== undefined && irelM.length > 0) {
                                    return (
                                      <div>
                                        {irelM.map((e, index) => (
                                          <div>
                                            {function() {
                                              if (e[2] === g.id) {
                                                return (
                                                  <p className="colorRed" onClick={() => toggleIrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                )
                                              } else {
                                                return (
                                                  <div>
                                                    {function() {
                                                      if (index === 0) {
                                                        return (
                                                          <p onClick={() => toggleIrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                        )
                                                      }
                                                    }()}
                                                  </div>
                                                )
                                              }
                                            }()}
                                          </div>
                                        ))}
                                      </div>
                                    )
                                  } else {
                                    return (
                                      <div>
                                        <p onClick={() => toggleIrelM(g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                      </div>
                                    )
                                  }
                                }()}
                                </div>
                            )
                          } else {
                            return (
                              <p></p>
                            )
                          }
                          }()
                        }
                      </div>
                      ))
                  ) : (
                    <></>
                  )}
                </div>
                ))
            ) : (
              <></>
            )
          }
          {addIrelFlg ? (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue=""
              value={exportFunction.teamIdToName(4)}
              label="Age"
              onChange={handleChangeAddIrel}
              name="tmpIrel"
            >
            {teamIdList !== null && teamIdList !== undefined ? (
              teamIdList.map((f, index) => (
                <MenuItem value={exportFunction.teamIdToName(f.id)} name={4}>{exportFunction.teamIdToName(f.id)}</MenuItem>
                ))
            ) : (
              <></>
            )}
            </Select>
          ) : (
            <Btn onClick={toggleAddIrelFlg}>+irel</Btn>
          )}
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
            <br />
            <Btn onClick={toggleEditedFlg}>
              {editedFlg ? ("更新しない") : ("更新する")}
            </Btn>
          </li>
          <li>
            {item.id}
            <br />
            {item.masterId !== null && item.masterId !== undefined ? (item.masterId) : ("")}
          </li>
          <li className="textBoxTitle">
              <Input
              type="text"
              name="IM register"
              value={title}
              onChange={handleChangeTitle}
              placeholder="imId"
              className="titleInput"
              />
              <FormControl fullWidth>
                <p>IMID: {imId}</p>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue=""
                  value={imTitle}
                  label="Age"
                  onChange={handleChangeIMTitle}
                >
                {itemMList.map((e, index) => (
                  <MenuItem value={e.title}>{e.title}</MenuItem>
                ))}
                </Select>
                {/* <p>他チームのIMをチーム絞ってみたい</p>
                <Select
                  labelId="demo-simple-select-label"
                  id="other-team"
                  defaultValue="他チームID"
                  value={otherTeamId}
                  label="他チームID"
                  onChange={handleOtherTeamId}
                >
                {otherTeamIdList[0].map((e, index) => (
                  <MenuItem value={e}>{e}</MenuItem>
                ))}
                </Select> */}
                <p>IM検索</p>
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
                <Select
                  labelId="demo-simple-select-label"
                  id="other-team-im"
                  defaultValue="他チームID"
                  value={otherImTitle}
                  label="他チームID"
                  onChange={handleChangeOtherIMTitle}
                >
                {imSearchRes.map((e, index) => (
                  <MenuItem value={e.title}>{e.title}</MenuItem>
                ))}
                </Select>
              ) : (
                ""
              )}
              </FormControl>
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
              <Btn onClick={registerIM}>IM登録・Ver追加</Btn>
              <Btn onClick={updFctChk}>IM設定</Btn>
          </li>
          <li className="textBox">
            <p>記号は使用しないでください</p>
            <Input
              type="text"
              name="ver"
              value={tmpVer}
              onChange={handleVerArr}
              placeholder="ver"
              className="titleInput"
              onKeyDown={addVerArr}
            />
            {
              verArr.length > 0 ? (
                  verArr.map((e, index) => (
                    <div className="itemBox" key={index}>
                      <p>{e}
                      </p>
                      <Input
                        type="text"
                        name="ver"
                        value={e[1]}
                        onChange={handleVerArr}
                        placeholder="ver"
                        className="titleInput"
                        onKeyDown={addVerArr}
                      />
                    </div>
                  ))
              ):("")
            }
            {itemMList.map((e, index) => (
              e.id === imId ? (
                e.ver.map((v, index) => (
                  <p>{v.ver_name}</p>
                ))
              ) : (
                ""
              )
            ))}
            <p>{nl2br(item.description)}</p>
            <p>{item.url}</p>
          </li>
          <li className="price">
            <p>
              <b>{item.price}</b>&nbsp;yen
            </p>
          </li>
          <li>
            <Input
              type="text"
              name="Merge imId"
              value={intoId}
              onChange={handleChangeImId}
              placeholder="imId"
              onKeyDown={updImId}
            />
            <br />
            <Btn onClick={delIm}>DELETE</Btn>
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
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
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

export default Item;
