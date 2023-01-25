import React, { useState, useEffect } from "react";
import { Grid, Box, Card, CardMedia } from "@mui/material";

import moment from 'moment';
import './App.css';

import logoMasjid from './assets/Group 11.png'
import bgMasjid from './assets/image 1.png'
import logoFPS from './assets/Logo New FPS v1 2.png'


import master from "./helper/master"

let listAdzan = {}

function App() {
  const [listSholat,setListSholat] = useState('')
  const [tanggalHijriyah,setTanggalHijriyah] = useState('')
  const [randomAyat,setRandomAyat] = useState('')
  const arr = ['subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya']

  const [date, setDate] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(false)

  const refreshClock = () => {
    setDate(new Date());
    checkFlag()
    checkHadith()
    checkAdzan()
  }

  const checkAdzan = () => {
    if(moment().format('ss') == '00'){
      getListSholat()
      console.log(listAdzan)
    }
  }


  const checkHadith = () => {
    if(moment().format('ss') == '00'){
      getRandomAyat()
    }
  }

  const checkFlag = () => {
    moment().format('h:mm:ss') == '12:00:00' ? setRefreshFlag(true) : setRefreshFlag(false)
  }

  const getRandomAyat = async () => {
    
    try {
      const response = await master.randomSource()
      if(response.status == 200){
        // setRandomAyat(response.data)
        let index = Math.round(Math.random()*response.data.length)
        
        let slug = response.data[index].slug
        let total = response.data[index].total
        
        let ranNum = Math.round(Math.random()*total)

        const res = await master.randomHadits(slug,ranNum)
        if(res.status == 200){
          setRandomAyat(res.data)
        }
      }
    } catch (error) {
      console.log(error)
    }
  } 

  const getListSholat = async () => {
    
    try {
      const response = await master.ListJadwalSholat(moment().format('YYYY-MM-DD'))
      if(response.data.status == 'ok'){
        const data = response.data.jadwal.data
        setListSholat(response.data.jadwal.data)

        arr.forEach(prayTime => {
          const today = moment().format('MM/DD/YYYY')
          let adzanTime = `${today} ${data[prayTime]}`
          listAdzan[prayTime] = Math.round((new Date - new Date(adzanTime))/60000)
          // console.log(`${prayTime} : ${Math.round((new Date - new Date(adzanTime))/60000)}`) //dibagi 60k mili second
        });

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
    getRandomAyat()
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
    <Box>
      <CardMedia
          component="img"
          sx={{ 
            maxHeight: '100vh',
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: "100%"
          }}
          image={bgMasjid}
        />
        <Grid container direction="column"
        justifyContent="space-between"
        alignItems="stre">
          <Grid item> 
            <Box  sx={{
            width: '100vw',
            height: '15vh',
            paddingx: '1vw', 
            paddingY: '1vh',
            backgroundColor: '#1E1E1E',
            opacity: '80%'
            // '&:hover': {
            //   backgroundColor: 'primary.main',
            //   opacity: [0.9, 0.8, 0.7],
            // },
            }}>
            <Grid container direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Grid item sx={{paddingLeft: '1vw', paddingX: '5vh'}}>
                <img src={logoMasjid}/>
              </Grid>
              <Box item sx={{
                width: '35vw',
                height: '15vh',
                backgroundColor: '#006783',
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
                    {moment(date).format('HH:mm:ss')}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            </Box>
          </Grid>
          <Grid item sx={{height: '54vh'}} container direction="row"
          justifyContent="center"
          alignItems="center">
              <Box sx={{
                width: '50vw',
                height: '50vh',
                paddingX: '1vw',
                paddingy: '1vh',
                backgroundColor: '#1E1E1E',
                opacity: '75%',
                borderRadius: 12,
              }}>
                <Grid sx={{
                marginTop: '3vh',
                fontSize: '1vw',
                fontWeigh: 700,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular',
                opacity:'100'
                }}>
                {randomAyat.arab}
                </Grid>
                <Grid sx={{
                marginTop: '3vh',
                fontSize: '1vw',
                fontWeigh: 400,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular'}}>
                {randomAyat.id}
                </Grid>
                <Grid sx={{
                textAlign: 'right',
                marginTop: '3vh',
                fontSize: '1vw',
                fontWeigh: 400,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular'}}>
                {randomAyat ? `HR. ${randomAyat.name} : ${randomAyat.number}` : ''}
                </Grid>
              </Box>
          </Grid>
          <Grid item>
            <Box sx={{
              width: '100vw',
              height: '25vh',
              // paddingx: '1vw', 
              paddingY: '2vh',
              backgroundColor: '#1E1E1E',
              opacity: '80%'
              // '&:hover': {
              //   backgroundColor: 'primary.main',
              //   opacity: [0.9, 0.8, 0.7],
              // },
            }}>
              <Grid container direction="row"
              justifyContent="space-between"
              alignItems="center">
                <Grid item>
                  <img src={logoFPS}/>
                </Grid>
                <Grid item sx={{
                fontSize: '32px',
                fontWeigh: 700,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Bold'}}>
                { listAdzan.isya < 0 && listAdzan.maghrib > 0 && listAdzan.isya > -30?
                `-- ${listAdzan.isya} Menit menjelang Isya --`
                  :
                  listAdzan.maghrib < 0 && listAdzan.ashar > 0 && listAdzan.maghrib > -30?
                  `-- ${listAdzan.maghrib} Menit menjelang Maghrib --`
                  :
                  listAdzan.ashar < 0 && listAdzan.dzuhur > 0 && listAdzan.ashar > -30?
                  `-- ${listAdzan.ashar} Menit menjelang Ashar --`
                  :
                  listAdzan.dzuhur < 0 && listAdzan.terbit > 0 && listAdzan.dzuhur > -30?
                  `-- ${listAdzan.dzuhur} Menit menjelang Dzuhur --`
                  :
                  listAdzan.terbit < 0 && listAdzan.subuh > 0 && listAdzan.terbit > -30?
                  `-- ${listAdzan.terbit} Menit menjelang Syuruq --`
                  :
                  listAdzan.subuh < 0 && listAdzan.isya > 0 && listAdzan.subuh > -30?
                  `-- ${listAdzan.subuh} Menit menjelang Subuh --`
                  : ``
                }
                </Grid>
                
              </Grid>
              <Grid container direction="row"
                  justifyContent="space-evenly"
                  alignItems="center" sx={{color: "#FFFFFF",}}>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '2vw',
                  paddingY: '2vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Subuh
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '48px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.subuh}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '2vw',
                  paddingY: '2vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Syuruq
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '48px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.terbit}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '2vw',
                  paddingY: '2vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Dzuhur
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '48px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.dzuhur}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '2vw',
                  paddingY: '2vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Ashar
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '48px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.ashar}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '2vw',
                  paddingY: '2vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Maghrib
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '48px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.maghrib}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '2vw',
                  paddingY: '2vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Isya
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '48px',
                      fontWeigh: 700,
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.isya}
                  </Grid>
                </Box>
              </Grid>
              <Grid sx={{
                textAlign: 'center',
                fontSize: '24px',
                fontWeigh: 700,
                color: "#FFFFFF",
                // fontFamily: 'Inter',
                fontStyle: 'Bold'}}>
                  www.jws.4netps.co.id/almuhajirin
              </Grid>
            </Box>
          </Grid>
        </Grid>
      
    </Box>
  );
}

export default App;
