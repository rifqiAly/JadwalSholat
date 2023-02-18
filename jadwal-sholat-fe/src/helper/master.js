import axios from "axios";

const ListJadwalSholat = async (currentDate) => {
    let url = `https://api.banghasan.com/sholat/format/json/jadwal/kota/703/tanggal/${currentDate}`;
    let res = await axios.get(url);
    return res;
};

const ConvertTanggalHijriyah = async (currentDate) => {
  const options = {
    method: 'GET',
    url: `http://api.aladhan.com/v1/gToH/${currentDate}`,
  };
  
  let res = await axios.request(options)
  return res
};

const randomSource = async () => {
  let url = `https://hadis-api-id.vercel.app/hadith`;
  let res = await axios.get(url);
  return res;
};

const randomHadits = async (slug, number) => {
  let url = `https://hadis-api-id.vercel.app/hadith/${slug}/${number}`;
  let res = await axios.get(url);
  return res;
};

export default {
  ListJadwalSholat,
  ConvertTanggalHijriyah,
  randomSource,
  randomHadits
}