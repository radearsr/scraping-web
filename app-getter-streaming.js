const mysqlService = require("./services/mysql/MysqlService");
const cheerioService = require("./services/cheerio/CheerioService");
const teleService = require("./services/telegram/TeleServices");

const getAnimePageLinks = async () => {
  try {
    console.log("getAnimePageLinks");
    const result = await mysqlService.getLinkAnimes("0");
    return result;
  } catch (error) {
    console.log(error);
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get Page Streaming Links", error, "10");
    throw error;
  }
};

const getLinkPerEpsAndInsert = async (linkPage, animeId) => {
  try {
    console.log("getLinkPerEps");
    const streamingLinks = await cheerioService.getStreamingPagePerEpisode(linkPage);
    if (streamingLinks.length > 0) {
      const mappedStreamingLinks = streamingLinks.map((streamingLink) => {
        return [animeId, streamingLink.eps, streamingLink.link, "0"];
      });
      const affectedRow = await mysqlService.insertLinkStreamingPage(mappedStreamingLinks);
      return affectedRow;
    };
  } catch (error) {
    console.log(error);
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get Link Per Eps", error, "10");
    throw error;
  }
};

const updateAnimeLinkStatus = async (animeId) => {
  try {
    await mysqlService.updateStatusListAnime("1", animeId);
  } catch (error) {
    console.log(error);
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Update Anime Link Status", error, "10");
    throw error;
  }
}

const main = async () => {
  console.log("main");
  let animeLinks = await getAnimePageLinks();
  await Promise.all(animeLinks.map( async (animeLink, idx) => {
    const totalEps = await cheerioService.getTotalEpisode(animeLink.link);
    await mysqlService.updateTotalEpsAnimeList(totalEps, animeLink.id);
    // if (totalEps <= 50) {
    //   const insertedEps = await getLinkPerEpsAndInsert(animeLink.link, animeLink.id);
    //   if (totalEps === insertedEps) {
    //     await mysqlService.updateStatusListAnime("1", animeLink.id);
    //   }
    // } else {
    //   return;
    // }
  }));
  
};


// const list = [1, 2, 3, 4];

// Promise.all(list.map( async (a) => {
  //   await main();
  // }));
setInterval(() => {
  main();
}, 10000);
