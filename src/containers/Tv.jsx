import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useCallback, useEffect, useState } from 'react';
import axios from '../axios';
import TvList from '../components/TvList';
import { ApiPath } from '../constants';
import history from '../history';

/**
 * TVトップページコンテナ
 *
 */
const All = () => {
  // TV一覧リストのSTATES
  const [tvList, setTvList] = useState([]);
  const [pmList, setPmList] = useState([]);
  const [teamId, setTeamId] = useState('');
  const [id, setId] = useState('');
  // 未確認データ件数
  const [numbers, setNumbers] = useState({});

  // TV全件取得
  const getAllTv = useCallback(async (id) => {

    var tmpTeamId = null;
    if (id === undefined || id === 5) {
      setId(17);
      setTeamId(17);
      tmpTeamId = 17;
    } else {
      setId(id);
      setTeamId(id);
      tmpTeamId = id;
    }

    setTvList([]);
    const list = [];
    const pmlist = [];
    await axios
      .get(ApiPath.TV + tmpTeamId)
      .then(response => {
        const pList = response.data.p;
        pList.forEach(data => {
          const pData = data.program;
          const program = {
            id: pData.program_id,
            title: pData.title,
            description: pData.description,
            url: pData.url,
            date: pData.on_air_date,
            station_id: pData.station_id,
            prelList: data.prelList,
            prelMList: data.prelMList,
          };
          list.push(program);
        });

        list.sort(function(first, second){
          if (first.id > second.id){
            return -1;
          }else if (first.id < second.id){
            return 1;
          }else{
            return 0;
          }
        });
        setTvList(list);

        const pmList = response.data.pm;
        pmList.forEach(data => {
          const pData = data.pm;
          const pm = {
            id: pData.pm_id,
            title: pData.title,
            description: pData.description,
            pmrelList: data.relList,
            pmrelMList: data.relMemList,
            verList: data.verList,
          };
          pmlist.push(pm);
        });

        pmlist.sort(function(first, second){
          if (first.id > second.id){
            return -1;
          }else if (first.id < second.id){
            return 1;
          }else{
            return 0;
          }
        });
        setPmList(pmlist);

        // 未確認データ件数
        const numbers = response.data.pnumberMap;
        if (numbers !== null) {
          console.log(numbers);
          setNumbers(numbers);
        }
      })
      .catch(error => {
        if (error.code === "ECONNABORTED") {
          window.alert("タイムアウトしました");
        }
      });
   }, []);

  useEffect(() => {
    getAllTv(5);
  }, [getAllTv]);

  const handleChange = e => {
    history.push('/tv?teamId=' + e);
    getAllTv(e);
  };

  const selected = {
    opacity: 0.5,
  }

  return (
    <div>
      <div>
        <Btn value="17" onClick={() => handleChange(17)} style={id === 17 ? selected : null}>SixTONES<span className='itemNumber'>{numbers[17]}</span></Btn>
        <Btn value="6" onClick={() => handleChange(6)} style={id === 6 ? selected : null}>SnowMan<span className='itemNumber'>{numbers[6]}</span></Btn>
        <Btn value="16" onClick={() => handleChange(16)} style={id === 16 ? selected : null}>King&Prince<span className='itemNumber'>{numbers[16]}</span></Btn>
        <Btn value="18" onClick={() => handleChange(18)} style={id === 18 ? selected : null}>なにわ男子<span className='itemNumber'>{numbers[18]}</span></Btn>
        <Btn value="8" onClick={() => handleChange(8)} style={id === 8 ? selected : null}>SexyZone<span className='itemNumber'>{numbers[8]}</span></Btn>
        <Btn value="7" onClick={() => handleChange(7)} style={id === 7 ? selected : null}>関ジャニ∞<span className='itemNumber'>{numbers[7]}</span></Btn>
        <Btn value="13" onClick={() => handleChange(13)} style={id === 13 ? selected : null}>Kis-My-Ft2<span className='itemNumber'>{numbers[13]}</span></Btn>
        <Btn value="15" onClick={() => handleChange(15)} style={id === 15 ? selected : null}>ジャニーズWEST<span className='itemNumber'>{numbers[15]}</span></Btn>
        <Btn value="19" onClick={() => handleChange(19)} style={id === 19 ? selected : null}>Hey!Say!JUMP<span className='itemNumber'>{numbers[19]}</span></Btn>
        <Btn value="14" onClick={() => handleChange(14)} style={id === 14 ? selected : null}>ABC-Z<span className='itemNumber'>{numbers[14]}</span></Btn>
        <Btn value="20" onClick={() => handleChange(20)} style={id === 20 ? selected : null}>KAT-TUN<span className='itemNumber'>{numbers[20]}</span></Btn>
        <Btn value="12" onClick={() => handleChange(12)} style={id === 12 ? selected : null}>NEWS<span className='itemNumber'>{numbers[12]}</span></Btn>
        <Btn value="21" onClick={() => handleChange(21)} style={id === 21 ? selected : null}>Kinki Kids<span className='itemNumber'>{numbers[21]}</span></Btn>
        <Btn value="9" onClick={() => handleChange(9)} style={id === 9 ? selected : null}>TOKIO<span className='itemNumber'>{numbers[9]}</span></Btn>
        <Btn value="10" onClick={() => handleChange(10)} style={id === 10 ? selected : null}>V6<span className='itemNumber'>{numbers[10]}</span></Btn>
        <Btn value="11" onClick={() => handleChange(11)} style={id === 11 ? selected : null}>嵐<span className='itemNumber'>{numbers[11]}</span></Btn>
        <TvList tvList={tvList} pmList={pmList} teamId={teamId} />
      </div>
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: '#db36a4',
  margin: '10px 0',
  color: 'black',
});

export default All;
