import { Box, Button, TextField, Input } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useEffect, useState } from 'react';
import exportFunction from '../functions/TeamIdToName';
import axios from '../axios';
import { ApiPath } from '../constants';
import NativeSelect from '@mui/material/NativeSelect';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

/**
 *　商品１件を表示するコンポーネント
 *
 * @param {object} item
 * @returns jsx
 */
const ItemM = ({ item, teamId }) => {
  const moment = require("moment");
  const date = moment(item.pubDate).format('YYYY/MM/DD');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [verArr, setVerArr] = useState([]);
  const [tmpVer, setTmpVer] = useState('');
  const [editedFlg, setEditedFlg] = useState(false);
  const [imrel, setIMrel] = useState([]);
  const [imrelM, setIMrelM] = useState([]);
  const [teamIdList, setTeamIdList] = useState([]);
  const [memberIdList, setMemberIdList] = useState([]);
  const [addIMrelFlg, setAddIMrelFlg] = useState(false);
  const [media, setMedia] = useState(1);
  const [addMem, setAddMem] = useState(false);

  useEffect(() => {
    // メディア判定
    isSmartPhone();

    // teamList
    const outerArr = [];
    if (item.relList !== null && item.relList !== undefined && item.relList.length > 0) {
      item.relList.forEach((e) => {
        const innerArr = [];
        innerArr.push(e.im_rel_id, e.im_id, e.team_id);
        outerArr.push(innerArr);
      });
      setIMrel(outerArr);
    } else {
      setIMrel([]);
    }

    // MemList
    const outerArrM = [];
    if (item.relMList !== null && item.relMList !== undefined && item.relMList.length > 0) {
      item.relMList.forEach((e) => {
        const innerArrM = [];
        innerArrM.push(e.im_rel_mem_id, e.im_rel_id, e.member_id);
        outerArrM.push(innerArrM);
      });
      setIMrelM(outerArrM);
    } else {
      setIMrelM([]);
    }

    setTitle(item.title);

    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    setVerArrFunc(item.ver);

    setId(item.id);
    setImage(item.image);
    setTeamIdList(exportFunction.getAllTeam());
    setMemberIdList(exportFunction.getAllMember());
  }, [item.id]);

  // メディア判別
  const isSmartPhone = () => {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      // SP
      setMedia(2);
    } else {
      setMedia(1);
    }
  }

  const setVerArrFunc = (ver) => {
    // verを登録する（im_v_idとver_name, im_idを配列にして入れる）
    const outerArray = [];
    ver.forEach(ver => {
      const innerArray = [];
      innerArray.push(ver.im_v_id, ver.ver_name, ver.im_id);
      outerArray.push(innerArray);
    });
    setVerArr(outerArray);
  }

  const upBlog = async (item) => {
    if (teamId !== undefined) {
      await axios
        .get(ApiPath.IM + 'blog?imId=' + id, item)
        .then(response => {
          if (response.data) {
            var tmpUrl = window.location.href;
            var newUrl = tmpUrl.replace("http://localhost:3000/", "");
            window.location.href = newUrl;
          } else {
            window.alert("ブログ投稿エラーです");
          }
        })
        .catch(error => {
          if (error.code === "ECONNABORTED") {
            window.alert("タイムアウトしました");
          }
        });
    }
  };

  const delIm = async () => {
    if (teamId !== undefined) {
      await axios
        .delete(ApiPath.IM + id)
        .then(response => {
          // 処理が成功したらresponseにはstatus=200,data=trueを返却するようにしてる
          if (response.data) {
            var tmpUrl = window.location.href;
            var newUrl = tmpUrl.replace("http://localhost:3000/", "");
            window.location.href = newUrl;
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
    }
  };

  const handleChangeTitle = e => {
    const txt = e.target.value;
    setTitle(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const handleChangeImage = e => {
    const txt = e.target.value;
    setImage(txt);
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const toggleAddMem = () => {
    if (!addMem) {
      setAddMem(true);
    } else {
      setAddMem(false);
    }
  }

  const handleVerArr = e => {
    const txt = e.target.value;
    var verId = e.target.parentNode.getAttribute('data');

    if (verId === null || verId === undefined) {
        // IDがないということは新規追加
        setTmpVer(txt);
    } else {
        // IDあるので更新
        // 1. Make a shallow copy of the items
        let vers = [...verArr];
        // 2. Make a shallow copy of the item you want to mutate
        let ver = {...vers[verId]};
        // 3. Replace the property you're intested in
        ver[1] = txt;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        vers[verId] = [ver[0], ver[1], ver[2]];
        // 5. Set the state to our new copy
        setVerArr(vers);
    }
    if (!editedFlg) {
      setEditedFlg(true);
    }
  };

  const addVerArr = e => {
    if (e.keyCode === 13) {
      const tmpArr = [null, tmpVer, id];
      setVerArr([...verArr, tmpArr]);
      setTmpVer("");
      if (!editedFlg) {
        setEditedFlg(true);
      }
    }
  }

  const updIM = async () => {
    const data = {
    im_id: id,
    title: title,
    wp_id: item.wpId,
    publication_date: date,
    amazon_image: image,
    del_flg: false,
    vers: verArr,
    imrel: imrel,
    imrelm: imrelM
    }

    await axios
    .post(ApiPath.IM + "upd", data)
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
  };

  const handleChangeAddIMrel = e => {
    const teamIdTmp = exportFunction.nameToTeamId(e.target.value);
    let vers = [...imrel];
    vers.push([null, id, teamIdTmp]);
    setIMrel(vers);
    setAddIMrelFlg(false);
  }

  const handleChangeIMrel = e => {
    // var prelId = e.target.name;
    var imrelId = e.target.name;
    // 1. Make a shallow copy of the items
    let vers = [...imrel];
    // 2. Make a shallow copy of the item you want to mutate
    let ver = {...vers[imrelId]};
    // 3. Replace the property you're intested in
    ver[2] = exportFunction.nameToTeamId(e.target.value);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    vers[imrelId] = [ver[0], ver[1], ver[2]];
    // 5. Set the state to our new copy
    setIMrel(vers);
  }

  const toggleAddIMrelFlg = () => {
    if (addIMrelFlg) {
      setAddIMrelFlg(false);
    } else {
      setAddIMrelFlg(true);
    }
  }

  // そのチームをirelMから抜きます
  const minusImrel = (index) => {
    let vers = [...imrel];
    // imrelが最低1つあれば削除可能
    if (vers[index][3] !== 1 && vers.length > 1) {
      vers.splice(index, 1);
    }
    setIMrel(vers);
  }

  // メンバーがirelMに入っていなかったら追加、入っていたら抜く
  const toggleImrelM = (irelId, memberId) => {
    let vers = [...imrelM];
    let ver2 = vers.filter(rel => rel[2] !== memberId);

    if (vers.length === ver2.length) {
      ver2.push([null, irelId, memberId, 0]);
    }
    setIMrelM(ver2);
  }

  const selected = {
    opacity: 0.5,
  }

  return (
    <div className={item.wpId !== null && item.wpId !== undefined ? "postedStyle itemContainer": editedFlg ? "editedStyle itemContainer" : "notPostedStyle itemContainer"}>
      {editedFlg ? (<div className="target_im" id={item.id} data-title={title} data-wpid={item.wpId} data-date={date} data-image={image} data-verarr={verArr} data-imrel={imrel} data-imrelm={imrelM}></div>) : (null)}
      <Text>
        <ul style={media === 1 ? row : column}>
          <li style={media === 1 ? null : column}>
            {imrel !== null && imrel !== undefined ? (
              imrel.map((e, index) => (
                <div className={media === 1 ? row : column}>
                  <NativeSelect
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    defaultValue=""
                    value={exportFunction.teamIdToName(e[2])}
                    label="Age"
                    onChange={handleChangeIMrel}
                    name={index.toString()}
                  >
                  {teamIdList !== null && teamIdList !== undefined ? (
                    teamIdList.map((f, index) => (
                      <option key={f.id} value={exportFunction.teamIdToName(f.id)}>
                        {exportFunction.teamIdToName(f.id)}
                      </option>
                      ))
                  ) : (
                    <></>
                  )}
                  </NativeSelect>
                  {e[2] === 4 ? (
                    <RemoveIcon onClick={() => minusImrel(index)} />
                  ) : (null)
                  }
                  <div class="flex_column width_6rem">
                  {memberIdList !== null && memberIdList !== undefined ? (
                    memberIdList.map((g, index) => (
                      <div>
                        {function() {
                          if (g.teamId === e[2]) {
                            return (
                              <>
                                {function() {
                                  if (imrelM !== null && imrelM !== undefined && imrelM.length > 0) {
                                    return (
                                      <>
                                        {imrelM.map((f, index) => (
                                          <div>
                                            {function() {
                                              if (f[2] === g.id) {
                                                return (
                                                  <p className="colorRed" onClick={() => toggleImrelM(e[0], g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                )
                                              } else {
                                                return (
                                                  <div style={addMem ? showEle : hideEle}>
                                                    {function() {
                                                      if (f[2] !== g.id && index === 0) {
                                                        return (
                                                          <p onClick={() => toggleImrelM(e[0], g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                                        )
                                                      }
                                                    }()}
                                                  </div>
                                                )
                                              }
                                            }()}
                                          </div>
                                        ))}
                                      </>
                                    )
                                  } else {
                                    return (
                                      <div style={addMem ? showEle : hideEle}>
                                        <p onClick={() => toggleImrelM(e[0], g.id)}>{exportFunction.memberIdToName(g.id)}</p>
                                      </div>
                                    )
                                  }
                                }()}
                              </>
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
                </div>
                ))
            ) : (
              <></>
            )
          }
          <div style={row}>
            {addIMrelFlg ? (
              <NativeSelect
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue=""
                value={exportFunction.teamIdToName(4)}
                label="Age"
                onChange={handleChangeAddIMrel}
                name="tmpIrel"
              >
              {teamIdList !== null && teamIdList !== undefined ? (
                teamIdList.map((f, index) => (
                  <option key={f.id} value={exportFunction.teamIdToName(f.id)}>
                    {exportFunction.teamIdToName(f.id)}
                  </option>
                  ))
              ) : (
                <></>
              )}
              </NativeSelect>
            ) : (
              <Btn onClick={toggleAddIMrelFlg}>+imrel</Btn>
            )}
            {function() {
              if (!addMem) {
                return(
                  <Btn onClick={toggleAddMem}>Mem編集</Btn>
                )
              } else {
                return(
                  <Btn onClick={toggleAddMem}>Mem編集完了</Btn>
                )
              }
            }()}
          </div>
          </li>
          <li>
            IMId: {item.id}
            <br />
            WpId: {item.wpId !== null && item.wpId !== undefined ? (item.wpId) : ("No Wp")}
            <br />
            {date}
          </li>
          <li className={media === 1 ? "textBoxTitle" : "textBoxTitleSp"}>
            <Input
              type="text"
              name="IM register"
              value={title}
              onChange={handleChangeTitle}
              placeholder="imId"
              className="titleInput"
            />
            <TextField
              required
              name="amazon image"
              label="amazon image"
              value={image}
              onChange={handleChangeImage}
              fullWidth={true}
              multiline={true}
              rows={3}
              rowsMax={5}
            />
          </li>
          <li className={media === 1 ? "textBox" : "textBoxSp"}>
            <Input
              type="text"
              row="5"
              name="ver"
              value={tmpVer}
              onChange={handleVerArr}
              placeholder="バージョン(記号x,Enterで追加)"
              className="titleInput"
              onKeyDown={addVerArr}
            />
            {verArr.length > 0 ? (
              verArr.map((e, index) => (
                <div className="itemBox" key={index}>
                  <Input
                    type="text"
                    name="ver"
                    value={e[1]}
                    data={index}
                    onChange={handleVerArr}
                    placeholder="ver"
                    className="titleInput"
                  />
                </div>
              ))
            ):("")
            }
            <p>{item.url}</p>
          </li>
          <li>
            <span style={media === 1 ? column : column}>
              <Btn onClick={updIM}>IM更新</Btn>
              <Btn onClick={upBlog} style={item.blog_not_updated ? null : selected}>Blog更新</Btn>
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
  background: '#FFF2F2',
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

const showEle = {
  "display": "block",
}

const hideEle = {
  "display": "none",
}

export default ItemM;
