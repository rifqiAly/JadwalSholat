import React, { useState, useEffect } from "react";
import { Grid, Box, Card, CardMedia } from "@mui/material";

import moment from 'moment';
import './App.css';

import logoMasjid from './assets/Group 11.png'
import bgMasjid from './assets/image 1.png'
import logoFPS from './assets/Logo New FPS v1 2.png'


import master from "./helper/master"



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
    moment().format('hh:mm:ss') == '00:00:00' ? setRefreshFlag(true) : setRefreshFlag(false)
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
    <Box overlow="hidden">
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
              <Grid item sx={{paddingLeft: '1vw', paddingX: '4vh'}}>
                <img src={logoMasjid}/>
              </Grid>
              <Box item sx={{
                width: '35vw',
                height: '15vh',
                backgroundColor: '#006783',
                borderRadius: '12px',
                marginRight: '4vh',
                // '&:hover': {
                //   backgroundColor: 'primary.main',
                //   opacity: [0.9, 0.8, 0.7],
                // },
              }}>
                <Grid container direction="row"
                  justifyContent="space-around"
                  alignItems="center">
                  <Grid item sx={{padding: '0.5vw', paddingX: '1vw'}}>
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
                    {moment(date).format('hh:mm:ss')}
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
                width: '50vw',
                height: '50vh',
                paddingX: '1vw',
                paddingy: '1vh',
                backgroundColor: 'RGB(30, 30, 30, 0.75)',
                backdropFilter: 'blur(3px)',
                borderRadius: '12px'
                }}>
                <Grid sx={{
                marginTop: '3vh',
                fontSize: '18px',
                textAlign: 'center',
                fontWeigh: 700,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular',
                opacity:'100'
                }}>
                حَدَّثَنَا عَبْدُ الْمُتَعَالِ بْنُ طَالِبٍ حَدَّثَنَا ابْنُ وَهْبٍ قَالَ أَخْبَرَنِي عَمْرُو بْنُ الْحَارِثِ أَنَّ قَتَادَةَ حَدَّثَهُ أَنَّ أَنَسَ بْنَ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ حَدَّثَهُعَنْ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ أَنَّهُ صَلَّى الظُّهْرَ وَالْعَصْرَ وَالْمَغْرِبَ وَالْعِشَاءَ وَرَقَدَ رَقْدَةً بِالْمُحَصَّبِ ثُمَّ رَكِبَ إِلَى الْبَيْتِ فَطَافَ بِهِ
                </Grid>
                <Grid sx={{
                marginTop: '3vh',
                fontSize: '18px',
                textAlign: 'center',
                fontWeigh: 400,
                color: "#FFB703",
                // fontFamily: 'Inter',
                fontStyle: 'Regular'}}>
                “Telah menceritakan kepada kami ['Abdul Muta'al bin Tholib] telah menceritakan kepada kami [Ibnu Wahb] berkata, telah mengabarkan kepada saya ['Amru bin Al Harits] bahwa [Qatadah] menceritakan kepadanya bahwa [Anas bin Malik radliallahu 'anhu] menceritakan kepadanya bahwa Nabi shallallahu 'alaihi wasallam melaksanakan shalat Zhuhur, 'Ashar, Maghrib dan 'Isya' kemudian Beliau tidur sejenak di Al Muhashib (tempat melempar jumrah di Mina), lalu Beliau menunggang tunggangannya menuju ke Ka'bah Baitullah lalu thawaf disana”
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
              justifyContent="center  "
              alignItems="center">
                <Grid container direction={"row"}
                 justifyContent={"space-between"}>
                <Grid item>
                  <img src={logoFPS}/>
                </Grid>
                <Grid item sx={{
                fontSize: '28px',
                fontWeigh: 700,
                color: "#FFB703",
                textAlign: 'center',
                // fontFamily: 'Inter',
                fontStyle: 'Bold'}}>
                -- 30 Menit menjelang adzan dzuhur --
                </Grid>
                <Grid item>
                  <img src={logoFPS}/>
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
                  paddingX: '4vw',
                  paddingY: '0vh',
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
                  paddingX: '4vw',
                  paddingY: '0vh',
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
                  paddingX: '4vw',
                  paddingY: '0vh',
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
                  paddingX: '4vw',
                  paddingY: '0vh',
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
                  paddingX: '4vw',
                  paddingY: '0vh',
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
                marginTop: '1vw',
                fontSize: '16px',
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
