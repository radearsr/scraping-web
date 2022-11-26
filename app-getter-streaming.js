const mysqlService = require("./services/mysql/MysqlService");
const cheerioService = require("./services/cheerio/CheerioService");
const teleService = require("./services/telegram/TeleServices");
let timeoutAxios = 0;


const getLinkVideoPerEpsAndAction = async (linkPage, episodeId) => {
  try {
    const streamingVideoLinks = await cheerioService.getStreamingVideo(linkPage);
    if (streamingVideoLinks.length > 0 ) {
      let mappedStreamingVideoLinks;
      if (streamingVideoLinks.length > 1) {
        mappedStreamingVideoLinks = [[episodeId, streamingVideoLinks[0].link, streamingVideoLinks[1].link, '0']];
      } else {
        mappedStreamingVideoLinks = [[episodeId, streamingVideoLinks[0].link, null, '0']];
      }
      await mysqlService.insertStreamingVideo(mappedStreamingVideoLinks);
      await mysqlService.updateStatusListEpisode("1", episodeId);
    } else {
      await mysqlService.updateStatusListEpisode("2", episodeId);
    }
  } catch (error) {
    console.log(error);
    if (error.message === "timeout of 3000ms exceeded") {
      if (timeoutAxios > 5) {
        await mysqlService.updateStatusListEpisode("3", episodeId);
        timeoutAxios = 0;
      }
      timeoutAxios++;
    } else {
      await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get Link Video Per Eps And Action", error, "10");
      throw error;
    }
  }
};

const main = async () => {
  try {
    const streamingVideos = await mysqlService.getLinkPagePerEps("0");
    streamingVideos.forEach( async (streamingVideo) => {
      await getLinkVideoPerEpsAndAction(streamingVideo.link_episode, streamingVideo.id);
    });
  } catch (error) {
    console.log(error);
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get Link Video Per Eps And Action", error, "10");
    throw error;   
  }
}

setInterval(() => {
  main();
}, 5000);

// const main = async () => {
//   await getLinkVideoPerEpsAndAction("https://185.224.82.193/ajin-episode-08-2/", 22)
// }

// main()