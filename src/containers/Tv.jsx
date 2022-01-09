import { Button } from '@material-ui/core';
import styled from '@material-ui/styles/styled';
import React, { useCallback, useEffect, useState } from 'react';
import axios from '../axios';
import Loading from '../components/Loading';
import TvList from '../components/TvList';
import { ApiPath } from '../constants';
import history from '../history';

/**
 * 商品全件取得（トップページ）のコンテナ
 *
 */
const All = () => {
  // TV一覧リストのSTATES
  const [tvList, setTvList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamId, setTeamId] = useState('');
  const [id, setId] = useState('');

  // TV全件取得
  const getAllTv = useCallback(async (id) => {
    if (id !== undefined) {
      setTeamId(id);
      setId(id);
    }

    setTvList([]);
    const list = [];
    var count = 0;
    await axios
      .get(ApiPath.TV + '?teamId=' + id)
      .then(response => {
        const apiData = response.data;
        apiData.forEach(data => {
          const program = {
            id: data.program.program_id,
            title: data.program.title,
            description: data.program.description,
            date: data.program.on_air_date,
            prelList: data.prelList,
            teamIdList: data.teamIdList,
          };
          list.push(program);
          count = count + 1;
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
      })
      .catch(error => {});
   }, []);

  useEffect(() => {
    getAllTv(5);
    setIsLoading(false);
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
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <Btn value="5" onClick={() => handleChange(5)} style={id === 5 ? selected : null}>All</Btn>
          <Btn value="17" onClick={() => handleChange(17)} style={id === 17 ? selected : null}>SixTONES</Btn>
          <Btn value="6" onClick={() => handleChange(6)} style={id === 6 ? selected : null}>SnowMan</Btn>
          <Btn value="16" onClick={() => handleChange(16)} style={id === 16 ? selected : null}>King&Prince</Btn>
          <Btn value="18" onClick={() => handleChange(18)} style={id === 18 ? selected : null}>なにわ男子</Btn>
          <Btn value="8" onClick={() => handleChange(8)} style={id === 8 ? selected : null}>SexyZone</Btn>
          <Btn value="7" onClick={() => handleChange(7)} style={id === 7 ? selected : null}>関ジャニ∞</Btn>
          <Btn value="13" onClick={() => handleChange(13)} style={id === 13 ? selected : null}>Kis-My-Ft2</Btn>
          <Btn value="15" onClick={() => handleChange(15)} style={id === 15 ? selected : null}>ジャニーズWEST</Btn>
          <Btn value="19" onClick={() => handleChange(19)} style={id === 19 ? selected : null}>Hey!Say!JUMP</Btn>
          <Btn value="14" onClick={() => handleChange(14)} style={id === 14 ? selected : null}>ABC-Z</Btn>
          <Btn value="20" onClick={() => handleChange(20)} style={id === 20 ? selected : null}>KAT-TUN</Btn>
          <Btn value="12" onClick={() => handleChange(12)} style={id === 12 ? selected : null}>NEWS</Btn>
          <Btn value="21" onClick={() => handleChange(21)} style={id === 21 ? selected : null}>Kinki Kids</Btn>
          <Btn value="9" onClick={() => handleChange(9)} style={id === 9 ? selected : null}>TOKIO</Btn>
          <Btn value="10" onClick={() => handleChange(10)} style={id === 10 ? selected : null}>V6</Btn>
          <Btn value="11" onClick={() => handleChange(11)} style={id === 11 ? selected : null}>嵐</Btn>
          <TvList tvList={tvList} teamId={teamId} />
        </div>
      )}
    </div>
  );
};

/**
 * UI(ボタン)
 */
const Btn = styled(Button)({
  marginLeft: '26px',
  background: 'linear-gradient(to right bottom, #db36a4, #f7ff00)',
  margin: '10px 0',
  color: 'black',
});

export default All;
