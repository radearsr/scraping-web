const axios = require("axios");
const mysqlService = require("./services/mysql/MysqlService");
const teleService = require("./services/telegram/TeleServices");
const reqVideo = "http://8.219.109.148:3000/getter";
let errorLog = 0;
let getOne = 0;
let getTwo = 0;
let getSpecial = 0;

const getOneLinkAndInsert = async (idSource, link) => {
  try {
    console.log("Step 2");
    const video = await axios.post(reqVideo, {
      link_streaming: link
    });
    console.log(video.status);
    if (video.status === 200) {
      const mappedVideo = [[idSource, video.data.result, null]];
      const affected = await mysqlService.insertLinkVideoPlayer(mappedVideo);
      return affected;
    } else if (video.status === 500) {
      if (getOne === 5) {
        await mysqlService.updateSourceStreaming("2", idSource);
        getOne = 0;
      }
      getOne++;
    }
  } catch (error) {
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get One Link And Insert", error, "10");
    throw error;
  }
}

const getTwoLinkAndInsert = async (idSource, link, linkHD) => {
  try {
    const video = await axios.post(reqVideo, {
      link_streaming: link
    });
    const videoHD = await axios.post(reqVideo, {
      link_streaming: linkHD
    });
    let mappedVideo, affected;
    if (video.status === 200 && videoHD.status === 200) {
       mappedVideo = [[idSource, video.data.result, videoHD.data.result]];
       affected = await mysqlService.insertLinkVideoPlayer(mappedVideo);
    } else if (video.status === 200) {
       mappedVideo = [[idSource, video.data.result, null]];
       affected = await mysqlService.insertLinkVideoPlayer(mappedVideo);
    } else if (videoHD.status === 200) {
       mappedVideo = [[idSource, null, videoHD.data.result]];
       affected = await mysqlService.insertLinkVideoPlayer(mappedVideo);
    } else if (video.status === 500) {
      if (getTwo === 5) {
        await mysqlService.updateSourceStreaming("2", idSource);
        getTwo = 0;
      }
      getTwo++;
    }
    return affected;
  } catch (error) {
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get Two Link And Insert", error, "10");
    throw error;
  }
}

const getSpecialAndInsert = async (idSource, link) => {
  try {
    const videoHD = await axios.post(reqVideo, {
      link_streaming: link
    });
    if (videoHD.status === 200) {
      const mappedVideo = [[idSource, videoHD.data.result, null]];
      const affected = await mysqlService.insertLinkVideoPlayer(mappedVideo);
      return affected;
    } else if (videoHD.status === 500) {
      if (getSpecial === 5) {
        await mysqlService.updateSourceStreaming("2", idSource);
        getSpecial = 0;
      }
      getSpecial++;
    }
  } catch (error) {
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get Special And Insert", error, "10");
    throw error;
  }
}


const main = async () => {
  try {
    const sources = await mysqlService.getSourceStreaming("0");
    sources.forEach( async (source) => {
      let resultInsert;
      if (source.link_video_hd != null) {
        resultInsert = await getTwoLinkAndInsert(source.id, source.link_video, source.link_video_hd);
      } else if (source.link_video === null) {
        resultInsert = await getSpecialAndInsert(source.id, source.link_video_hd);
      } else {
        console.log("Step 1");
        console.log(source.link_video);
        resultInsert = await getOneLinkAndInsert(source.id, source.link_video);
      }

      if (resultInsert >= 1) {
        await mysqlService.updateSourceStreaming("1", source.id);
      } else {
        if (errorLog > 5) {
          await mysqlService.updateSourceStreaming("2", source.id);
        }
        errorLog++;
      }
    });
  } catch (error) {
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Main", error, "10");
    throw error;
  }
}

main();
setInterval(() => {
  main();
}, 60000);