import React, { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import moment from 'moment';
import './App.css';

import logoMasjid from './assets/Group 11.png'
import bgMasjid from './assets/image 1.png'


import master from "./helper/master"
import { borderRadius, fontFamily, fontStyle } from "@mui/system";

function App() {
  const [listSholat,setListSholat] = useState('')
  const [tanggalHijriyah,setTanggalHijriyah] = useState('')
  const [date, setDate] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(false)

  const refreshClock = () => {
    setDate(new Date());
    checkFlag()
  }

  const checkFlag = () => {
    moment().format('h:mm:ss') == '12:00:00' ? setRefreshFlag(true) : setRefreshFlag(false)
  }

  const getListSholat = async () => {
    
    try {
      const response = await master.ListJadwalSholat(moment().format('YYYY-MM-DD'))
      if(response.data.status == 'ok'){
        setListSholat(response.data.jadwal.data)
        // console.log(response.data.jadwal.data)
      }
    } catch (error) {
      console.log(error)
    }
  } 

  const convertCurrentDate = async () => {
    try {
      const response = await master.ConvertTanggalHijriyah(moment().format('DD-MM-YYYY'))
      if(response.status == 200){
        setTanggalHijriyah(response.data[0])
        // console.log(response.data[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    getListSholat();
    convertCurrentDate()
  }, [refreshFlag]);

  


  return (
    <Grid>
      <Box sx={{
        width: '100vw',
        height: '15vh',
        paddingx: '1vw', 
        paddingY: '1vh',
        backgroundColor: '#1E1E1E',
        // '&:hover': {
        //   backgroundColor: 'primary.main',
        //   opacity: [0.9, 0.8, 0.7],
        // },
      }}>
        <Grid container direction="row"
          justifyContent="space-evenly"
          alignItems="center">
          <Grid item sx={{paddingLeft: '1vw', paddingX: '5vh'}}>
            <img src={logoMasjid}/>
          </Grid>
          <Box item sx={{
            width: '30vw',
            height: '10vh',
            backgroundColor: '#006783',
            paddingRight: '1vw', 
            paddingBottom: '5vh',
            borderRadius: '12px',
            // '&:hover': {
            //   backgroundColor: 'primary.main',
            //   opacity: [0.9, 0.8, 0.7],
            // },
          }}>
            <Grid container direction="row"
              justifyContent="space-around"
              alignItems="center">
              <Grid item sx={{padding: '1vw'}}>
                <Grid sx={{
                fontSize: '24px',
                fontWeigh: 700,
                color: "#FFFFFF",
                // fontFamily: 'Inter',
                fontStyle: 'Mixed'
              }}>
                  {tanggalHijriyah.hari}
                </Grid>
                <Grid sx={{
                fontSize: '24px',
                fontWeigh: 400,
                color: "#FFFFFF",
                // fontFamily: 'Inter',
                fontStyle: 'Mixed'
              }}>
                  {tanggalHijriyah.tanggal_masehi} {tanggalHijriyah.bulan_masehi} {tanggalHijriyah.tahun_masehi} 
                </Grid>
                <Box sx={{
                  backgroundColor:'#FFFFFF',
                  height: '2px'
                }}/>

                <Grid sx={{
                fontSize: '24px',
                fontWeigh: 400,
                color: "#FFFFFF",
                // fontFamily: 'Inter',
                fontStyle: 'Regular'
              }}>
                  {tanggalHijriyah.tanggal_hijriyah} {tanggalHijriyah.bulan_hijriyah} {tanggalHijriyah.tahun_hijriyah} 
                </Grid>
              </Grid>
              <Grid item sx={{
                fontSize: '72px',
                fontWeigh: 700,
                color: "#FFFFFF",
                // fontFamily: 'Inter',
                fontStyle: 'Bold'
              }}>
                {moment(date).format('h:mm:ss')}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Box>
      <Grid sx={{maxWidth: '100vw',
        maxHeight: '20vh',}}>
        <img src={bgMasjid} />
      </Grid>
      <Grid>
        Subuh: {listSholat.subuh}
      </Grid>
      <Grid>
        Syuruq: {listSholat.terbit}
      </Grid>
      <Grid>
        Dzuhur: {listSholat.dzuhur}
      </Grid>
      <Grid>
        Ashar: {listSholat.ashar}
      </Grid>
      <Grid>
        Magrib: {listSholat.magrib}
      </Grid>
      <Grid>
        Isya: {listSholat.isya}
      </Grid>
      
    </Grid>
  );
}

export default App;
