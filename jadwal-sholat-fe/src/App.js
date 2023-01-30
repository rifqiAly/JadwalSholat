import React, { useState, useEffect } from "react";
import { Grid, Box, Button, CardMedia } from "@mui/material";

import moment from 'moment';
import useSound from 'use-sound'


import './App.css';

import logoMasjid from './assets/Group.png'
import bgMasjid from './assets/image 1.png'
import logoFPS from './assets/Logo New FPS v1 2.png'

import soundUrl from './assets/call-to-attention-123107.mp3'

import master from "./helper/master"

let listAdzan = {iqomah : 6}

function App() {
  const [listSholat,setListSholat] = useState('')
  const [tanggalHijriyah,setTanggalHijriyah] = useState('')
  const [randomAyat,setRandomAyat] = useState('')
  const arr = ['subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya']

  const [date, setDate] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(false)
  const [soundAdzan, setSoundAdzan] = useState(false)
  const [soundIqomah, setSoundIqomah] = useState(false)
  const [notifSholat, setNotifSholat] = useState(false)
  const [countDownIqomah, setCountDownIqomah] = useState(false)


  const reduceCDIqomah = () => {
    listAdzan.iqomah = (listAdzan.iqomah - 1)
  }

  const resetCD = () => {
    listAdzan.iqomah = 6
  }

  const [playAdzan] = useSound(soundUrl)
  const [playIqomah] = useSound(soundUrl)


  const soundAdzanOn = () => {
    setSoundAdzan(true)
  }

  const soundAdzanOff = () => {
    setSoundAdzan(false)
  }

  const soundIqomahOn = () => {
    setSoundIqomah(true)
  }

  const soundIqomahOff = () => {
    setSoundIqomah(false)
  }
  
  const notifSholatOn = () => {
    setNotifSholat(true)
  }

  const notifSholatOff = () => {
    setNotifSholat(false)
  }

  const countDownIqomahOn = () => {
    setCountDownIqomah(true)
  }

  const countDownIqomahOff = () => {
    setCountDownIqomah(false)
  }

  const resetAll = () => {
    soundAdzanOff()
    soundIqomahOff()
    notifSholatOff()
    countDownIqomahOff()
  }

  const refreshClock = () => {
    setDate(new Date());
    checkFlag()
    checkHadith()
    refreshRemainingTime()
    checkAdzan()
    checkIqomah()
    checkCountdownIqomah()
    checkSholat()
    checkReset()
    // console.log(listAdzan)
  }


  const refreshRemainingTime = () => {
    if(moment().format('ss') == '00'){
      getListSholat()
    }
  }

  const checkAdzan = () => {
    if(moment().format('ss') == '03' && 
    (listAdzan.subuh == 0 ||
      listAdzan.dzuhur == 0 ||
      listAdzan.ashar == 0 ||
      listAdzan.maghrib == 0 ||
      listAdzan.isya == 0
      )){
        soundIqomahOff()
        soundAdzanOn()
      }    
    }
    
    const checkCountdownIqomah = () => {
      if(moment().format('ss') == '03' && 
      (listAdzan.subuh == 3 ||
        listAdzan.dzuhur == 3 ||
        listAdzan.ashar == 3 ||
        listAdzan.maghrib == 3 ||
        listAdzan.isya == 3
        )){
          resetCD()
          soundAdzanOff()
          countDownIqomahOn()
    }

    if(moment().format('ss') == '03' && 
    (listAdzan.subuh > 2 &&  listAdzan.subuh < 10 ||
      listAdzan.dzuhur > 2 &&  listAdzan.dzuhur < 10 ||
      listAdzan.ashar > 2 &&  listAdzan.ashar < 10 ||
      listAdzan.maghrib > 2 &&  listAdzan.maghrib < 10 ||
      listAdzan.isya > 2 &&  listAdzan.isya < 10
      )){
        if(listAdzan.iqomah != 0 ){
          reduceCDIqomah()
        }else{
          resetCD()
        }
      }
  }

  const checkIqomah = () => {
    if(moment().format('ss') == '03' && 
    (listAdzan.subuh == 10 ||
      listAdzan.dzuhur == 10 ||
      listAdzan.ashar == 10 ||
      listAdzan.maghrib == 10 ||
      listAdzan.isya == 10
      )){
        countDownIqomahOff()
        soundIqomahOn()
    }
  }

  const checkSholat = () => {
    if(moment().format('ss') == '03' && 
    (listAdzan.subuh == 11 ||
      listAdzan.dzuhur == 11 ||
      listAdzan.ashar == 11 ||
      listAdzan.maghrib == 11 ||
      listAdzan.isya == 11
      )){
        soundIqomahOff()
        notifSholatOn()
    }
  }

  const checkReset = () => {
    if(moment().format('ss') == '03' && 
    (listAdzan.subuh == 18 ||
      listAdzan.dzuhur == 18 ||
      listAdzan.ashar == 18 ||
      listAdzan.maghrib == 18 ||
      listAdzan.isya == 18
      )){
        resetAll()
    }
  }


  const checkHadith = () => {
    if(moment().format('ss') == '00'){
      getRandomAyat()
    }
  }

  const checkFlag = () => {
    moment().format('hh:mm:ss') == '00:00:00' ? setRefreshFlag(true) : setRefreshFlag(false)
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
          listAdzan[prayTime] = Math.floor((new Date - new Date(adzanTime))/60000)
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

  useEffect(() => {
    if(soundAdzan){
      playAdzan()
    }
  }, [soundAdzan]);

  useEffect(() => {
    if(soundIqomah){
      playIqomah()
    }
  }, [soundIqomah]);

  
  return (
    <Box overflow="hidden">
      <CardMedia
          component="img"
          sx={{ 
            maxHeight: '100%',
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
            width: '100%',
            height: '17vh',
            paddingx: '1vw', 
            paddingY: '1vh',
            backgroundColor: 'RGB(30, 30, 30, 0.75)',
            backdropFilter: 'blur(3px)',
            // '&:hover': {
            //   backgroundColor: 'primary.main',
            //   opacity: [0.9, 0.8, 0.7],
            // },
            }}>
            <Grid container direction="row"
              justifyContent="space-between"
              alignItems="center">
              <Grid item sx={{paddingLeft: '1vw', paddingX: '4vh'}}>
                <Grid container spacing={3}>
                  <Grid item>
                    <img src={logoMasjid} width="100vw"/>
                  </Grid>
                  <Grid item>
                    <Grid sx={{
                    fontSize: '2vw',
                    fontWeight: 'bold',
                    color: "#FFFFFF",
                    // fontFamily: 'Inter',
                  }}>
                      MASJID AL - MUHAJIRIN
                    </Grid>
                    <Grid sx={{
                    fontSize: '1vw',
                    fontWeight: 400,
                    color: "#FFFFFF",
                    // fontFamily: 'Inter',
                    fontStyle: 'Regular'
                  }}>
                      Cluster Jasmine - Grand Depok City 
                    </Grid>
                    <Grid sx={{
                    fontSize: '1vw',
                    fontWeight: 400,
                    color: "#FFFFFF",
                    // fontFamily: 'Inter',
                    fontStyle: 'Regular'
                  }}>
                    Kota Depok - Jawa Barat
                    </Grid>
                  </Grid>
                  
                </Grid>
              </Grid>
              <Box item sx={{
                width: '35vw',
                height: '15vh',
                backgroundColor: '#006783',
                borderRadius: '1vw',
                marginRight: '4vh',
                // '&:hover': {
                //   backgroundColor: 'primary.main',
                //   opacity: [0.9, 0.8, 0.7],
                // },
              }}>
                <Grid container direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  alignSelf="center">
                  <Grid item sx={{padding: '0.5vw', paddingX: '1vw'}}>
                    <Grid sx={{
                    fontSize: '1.5vw',
                    fontWeight: 700,
                    color: "#FFFFFF",
                    // fontFamily: 'Inter',
                    fontStyle: 'Mixed'
                  }}>
                      {tanggalHijriyah.hari}
                    </Grid>
                    <Grid sx={{
                    fontSize: '1.5vw',
                    fontWeight: 400,
                    color: "#FFFFFF",
                    // fontFamily: 'Inter',
                    fontStyle: 'Mixed'
                  }}>
                      {tanggalHijriyah.tanggal_masehi} {tanggalHijriyah.bulan_masehi} {tanggalHijriyah.tahun_masehi} 
                    </Grid>
                    <Box sx={{
                      backgroundColor:'#FFFFFF',
                      height: '0.01vw'
                    }}/>

                    <Grid sx={{
                    fontSize: '1.5vw',
                    fontWeight: 400,
                    color: "#FFFFFF",
                    // fontFamily: 'Inter',
                    fontStyle: 'Regular'
                  }}>
                      {tanggalHijriyah.tanggal_hijriyah} {tanggalHijriyah.bulan_hijriyah} {tanggalHijriyah.tahun_hijriyah} 
                    </Grid>
                  </Grid>
                  <Grid item sx={{
                    fontSize: '4vw',
                    fontWeight: 700,
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
          alignItems="center"
          alignSelf={"center"}>
              <Box sx={{
                maxWidth: '50vw',
                maxHeight: '50vh',
                paddingX: '1vw',
                paddingy: '1vh',
                backgroundColor: 'RGB(30, 30, 30, 0.75)',
                backdropFilter: 'blur(3px)',
                borderRadius: '12px'
                }}>
                <Grid sx={{
                marginTop: '3vh',
                fontSize: randomAyat.arab?.length > 1500 ? '0.65vw' : '0.8vw',
                textAlign: 'center',
                fontWeight: 700,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular',
                opacity:'100'
                }}>
                {soundAdzan || soundIqomah || notifSholat || countDownIqomah ? '' : randomAyat.arab}
                </Grid>
                <Grid sx={{
                marginTop: '3vh',
                fontSize: randomAyat.id?.length > 1500 ? '0.65vw' : (soundAdzan || soundIqomah || notifSholat || countDownIqomah) ? '42px' : '0.8vw',
                textAlign: 'center',
                fontWeight: 400,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular'}}>
                {soundAdzan || soundIqomah || notifSholat || countDownIqomah ? (soundAdzan ? '-- Adzan --' : (notifSholat ? '-- Sholat --' : (countDownIqomah ? `-- ${listAdzan.iqomah} Menit menuju Iqomah --` : '-- Iqomah --'))) : randomAyat.id}
                </Grid>
                <Grid sx={{
                textAlign: 'right',
                marginTop: '3vh',
                marginBottom: '3vh',
                fontSize: '1vw',
                fontWeight: 400,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular'}}>
                {soundAdzan || soundIqomah || notifSholat || countDownIqomah ? '' : (randomAyat ? `HR. ${randomAyat.name} : ${randomAyat.number}` : '')}
                </Grid>
              </Box>
          </Grid>
          <Grid item>
            <Box sx={{
              position:'fixed',
              left: '0',
              bottom: '0',
              width: '100%',
              height: 'auto',
              // paddingx: '1vw', 
              paddingY: '0vh',
              backgroundColor: 'RGB(30, 30, 30, 0.90)',
              backdropFilter: 'blur(3px)',
              opacity: '99%'
              // '&:hover': {
              //   backgroundColor: 'primary.main',
              //   opacity: [0.9, 0.8, 0.7],
              // },
              }}>
              <Grid container direction="row"
                    justifyContent="center"
                    alignItems="center"
                    marginBottom="1vw">
                <Grid container direction={"row"}
                 justifyContent={"space-between"}>
                <Grid item>
                  <img src={logoFPS} width="50vw"/>
                </Grid>
                <Grid item sx={{
                fontSize: '1.5vw',
                fontWeight: 700,
                color: "#FFB703",
                textAlign: 'center',
                // fontFamily: 'Inter',
                fontStyle: 'Bold'}}>
                { listAdzan.isya < 0 && listAdzan.maghrib > 0 && listAdzan.isya > -30?
                  `-- ${listAdzan.isya * -1} Menit menjelang Isya --`
                  :
                  listAdzan.maghrib < 0 && listAdzan.ashar > 0 && listAdzan.maghrib > -30?
                  `-- ${listAdzan.maghrib * -1} Menit menjelang Maghrib --`
                  :
                  listAdzan.ashar < 0 && listAdzan.dzuhur > 0 && listAdzan.ashar > -30?
                  `-- ${listAdzan.ashar * -1}  Menit menjelang Ashar --`
                  :
                  listAdzan.dzuhur < 0 && listAdzan.terbit > 0 && listAdzan.dzuhur > -30?
                  `-- ${listAdzan.dzuhur * -1} Menit menjelang Dzuhur --`
                  :
                  listAdzan.terbit < 0 && listAdzan.subuh > 0 && listAdzan.terbit > -30?
                  `-- ${listAdzan.terbit * -1} Menit menjelang Syuruq --`
                  :
                  listAdzan.subuh < 0 && listAdzan.terbit < 0 && listAdzan.subuh > -30?
                  `-- ${listAdzan.subuh * -1} Menit menjelang Subuh --`
                  : ``
                }
                </Grid>
                <Grid item>
                  <img src={logoFPS} width="50vw"/>
                </Grid>
                </Grid>                
              </Grid>
              <Grid container direction="row"
                  justifyContent="space-evenly"
                  alignItems="center" sx={{color: "#FFFFFF",}}>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '4vw',
                  paddingY: '0vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '1.5vw',
                      // fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Subuh
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '2.5vw',
                      fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.subuh}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '4vw',
                  paddingY: '0vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '1.5vw',
                      // fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Syuruq
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '2.5vw',
                      fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.terbit}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '4vw',
                  paddingY: '0vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '1.5vw',
                      // fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Dzuhur
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '2.5vw',
                      fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.dzuhur}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '4vw',
                  paddingY: '0vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '1.5vw',
                      // fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Ashar
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '2.5vw',
                      fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.ashar}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '4vw',
                  paddingY: '0vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '1.5vw',
                      // fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Maghrib
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '2.5vw',
                      fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.maghrib}
                  </Grid>
                </Box>
                <Box item sx={{
                  width: 'auto',
                  height: 'auto',
                  paddingX: '4vw',
                  paddingY: '0vh',
                  backgroundColor: '#006783',
                  borderRadius: '12px',}}>  
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '1.5vw',
                      // fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    Isya
                  </Grid>
                  <Grid sx={{
                      textAlign: 'center',
                      fontSize: '2.5vw',
                      fontWeight: 'bold',
                      color: "#FFFFFF",
                      // fontFamily: 'Inter',
                      fontStyle: 'Bold'}}>
                    {listSholat.isya}
                  </Grid>
                </Box>
              </Grid>
              <Grid sx={{
                textAlign: 'center',
                marginTop: '1vw',
                fontSize: '0.8vw',
                // fontWeight: 700,
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
