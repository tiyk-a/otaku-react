import DateFnsUtils from '@date-io/date-fns';
import { Box, Button, Input } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import styled from '@material-ui/styles/styled';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import jaLocale from 'date-fns/locale/ja';
import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { ApiPath } from '../constants';
import exportFunctionRel from '../functions/RelManage';
import exportFunction from '../functions/TeamIdToName';


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
  const [date, setDate] = useState('');
  const [amazon_image, setAmazon_image] = useState('');
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
  const [addIrelFlg, setAddIrelFlg] = useState(false);
  // [{teamId,memList,redMemList},{teamId,memList,redMemList}]
  const [irelObj, setIrelObj] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [media, setMedia] = useState(1);

  useEffect(() => {
    // メディア判定
    isSmartPhone();
    
    // irel(team)を入れます
    var outerArr = extractAndSetIrel(item);

    // irelM(member)を入れます
    var outerArrM = extractAndSetIrelM(item);

    setId(item.id);
    setDate(moment(item.pubDate).format('YYYY-MM-DD'));
    setImId(0);
    setTitle(item.title);
    setTeamIdList(exportFunction.getAllTeam());
    insertIrelObj(outerArr, outerArrM);
  }, [item.id, item.pubDate, item.title, moment]);

  // メディア判別
  const isSmartPhone = () => {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      // SP
      setMedia(2);
    } else {
      setMedia(1);
      // for test
      // setMedia(2);
    }
  }

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

    return outerArr;
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
    return outerArrM;
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

      await axios
        .post(ApiPath.IM, data)
        .then(response => {
          if (response.data) {
            window.location.reload();
          } else {
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
      .get(ApiPath.IM + 'search?key=' + key)
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
    insertIrelObj(vers, irelM);
  }

  // 新しいirelを配列に追加します(新規not更新)
  const handleChangeAddIrel = e => {
    const teamIdTmp = exportFunction.nameToTeamId(e.target.value);
    let vers = [...irel];
    // [irelId, itemId, teamId, imrelですかフラグ]
    vers.push([null, id, teamIdTmp, 0]);
    setIrel(vers);
    setAddIrelFlg(false);
    insertIrelObj(vers, irelM);
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

  // 入力された検索ワードをSTATEに反映
  const handleVerArr = e => {
    const txt = e.target.value;
    setTmpVer(txt);
    if (!editedFlg) {
      setEditedFlg(true);
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

  const toggleAddIrelFlg = () => {
    if (addIrelFlg) {
      setAddIrelFlg(false);
    } else {
      setAddIrelFlg(true);
    }
  }

  // メンバーがirelMに入っていなかったら追加、入っていたら抜く
  const toggleIrelM = (memberId) => {
    let vers = [...irelM];
    let ver2 = vers.filter(rel => rel[2] !== memberId);

    if (vers.length === ver2.length) {
      ver2.push([null, null, memberId, 0]);
    }
    setIrelM(ver2);
    insertIrelObj(irel, ver2);
  }

  // member関連objectを全て設定
  // [{teamId,memList,redMemList},{teamId,memList,redMemList}]
  const insertIrelObj = (irel, irelM) => {
    var allMemList = exportFunction.getAllMember();

    // このitemが持ってるteamidlistを作る
    var tmpTeamIdList = [];

    if (irel !== null && irel !== undefined && irel.length > 0) {
      irel.forEach((rel) => {
        if (!tmpTeamIdList.includes(rel[2])) {
          tmpTeamIdList.push(rel[2]);
        }
      });

      var objArr = [];
      // itemが持ってるteamIdを全部オブジェクトに突っ込む
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

      if (irelM !== null && irelM !== undefined) {
        irelM.forEach((relM) => {
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
            // var index = 0;
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
        setIrelObj(objArr);
      }
    }
  }

const isEmpty = (obj) => {
  return !Object.keys(obj).length;
}

// Item一括選択のためにboxを押したら選択/解除する
const toggleSelectedItem = () => {
  if (editedFlg) {
    setEditedFlg(false);
    setIsChecked(false);
  } else {
    setEditedFlg(true);
    setIsChecked(true);
  }
}

  return (
    <div className={item.masterId !== null && item.masterId !== undefined ? "postedStyle itemContainer": editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"} onClick={toggleSelectedItem}>
      {editedFlg
        ? (<div className="target_item" id={item.id} data-imid={imId} data-teamid={teamId} data-title={title} data-date={date} data-image={amazon_image} data-verarr={verArr} data-irel={irel} data-irelm={irelM}></div>)
        : (<div id={item.id} data-teamid={teamId}></div>)}
      <Text>
        <ul style={media === 1 ? row : column}>
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
              <FormControl fullWidth>
                <p>IMID: {imId}</p>
                <NativeSelect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue=""
                  value={imTitle}
                  label="Age"
                  onChange={handleChangeIMTitle}
                >
                {itemMList.length > 0 ? (
                  itemMList.map((e, index) => (
                  <option key={e.id} value={e.title}>
                    {e.title}
                  </option>
                ))) : (
                  <option disabled key="0" value="N/A">
                    N/A
                  </option>
                )}
                </NativeSelect>
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
                <NativeSelect
                  labelId="demo-simple-select-label"
                  id="other-team-im"
                  defaultValue="他チームID"
                  value={otherImTitle}
                  label="他チームID"
                  onChange={handleChangeOtherIMTitle}
                >
                {imSearchRes.map((e, index) => (
                  <option key={e.im_id} value={e.title}>
                    {e.title}
                  </option>
                ))}
                </NativeSelect>
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
          </li>
          <li style={media === 1 ? null : column}>
            {irel !== null && irel !== undefined ? (
              irel.map((e, index) => (
                <div className={media === 1 ? row : column}>
                  <NativeSelect
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
                      <option key={e[2]} value={exportFunction.teamIdToName(f.id)}>
                        {exportFunction.teamIdToName(f.id)}
                      </option>
                      ))
                  ) : (
                    <></>
                  )}
                  </NativeSelect>
                  {e[2] === 4 ? (
                    <RemoveIcon onClick={() => minusIrel(index)} />
                  ) : (null)
                  }
                  <div class="flex_column width_6rem">
                    {function() {
                      if (irelObj !== null && irelObj !== undefined) {
                        return (
                          <div>
                            {irelObj.map((g, index) => (
                              <div>
                                {function() {
                                  if (g.teamId === e[2]) {
                                    return (
                                      <div>
                                        {g.list.map((l, i) => (
                                          <p onClick={() => toggleIrelM(l)}>{exportFunction.memberIdToName(l)}</p>
                                        ))}
                                        {g.redList.map((l, i) => (
                                          <p className="colorRed" onClick={() => toggleIrelM(l)}>{exportFunction.memberIdToName(l)}</p>
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
            <br /><p>ItmId•{item.id}</p>
            <br />
            {item.masterId !== null && item.masterId !== undefined ? (item.masterId) : ("")}
          </li>
          <li className={media === 1 ? "textBox" : "textBoxSp"}>
            <Input
              type="text"
              name="ver"
              value={tmpVer}
              onChange={handleVerArr}
              placeholder="バージョン(記号x,Enterで追加)"
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
            <p>{item.url}</p>
          </li>
          <li className="price">
            <p>
              <b>{item.price}</b>&nbsp;yen
            </p>
            <span style={media === 1 ? column : column}>
              <Btn onClick={registerIM}>IM登録</Btn>
              <Btn onClick={updFctChk}>IM設定</Btn>
              <Btn onClick={delIm}>DELETE</Btn>
            </span>
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

export default Item;
