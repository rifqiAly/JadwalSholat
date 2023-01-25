import React, { useState, useEffect } from "react";
import './App.css';

import { Grid, makeStyles } from "@mui/material";
import moment from 'moment';

import master from "./helper/master"

function App() {
  const [listSholat,setListSholat] = useState('')
  const [tanggalHijriyah,setTanggalHijriyah] = useState('')
  const [date, setDate] = useState(new Date());

  const refreshClock = () => {
    setDate(new Date());
  }

  const getListSholat = async () => {
    
    try {
      const response = await master.ListJadwalSholat(moment().format('YYYY-MM-DD'))
      if(response.data.status == 'ok'){
        setListSholat(response.data.jadwal.data)
        console.log(response.data.jadwal.data)
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
        console.log(response.data[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getListSholat();
    convertCurrentDate()
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  


  return (
    <Grid>
      <Grid>
        {moment(date).format('h:mm:ss')}
      </Grid>
      <Grid>
        {tanggalHijriyah.hari}
      </Grid>
      <Grid>
        {tanggalHijriyah.tanggal_masehi} {tanggalHijriyah.bulan_masehi} {tanggalHijriyah.tahun_masehi} 
      </Grid>
      <Grid>
        {tanggalHijriyah.tanggal_hijriyah} {tanggalHijriyah.bulan_hijriyah} {tanggalHijriyah.tahun_hijriyah} 
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
