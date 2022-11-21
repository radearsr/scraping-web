const mysqlService = require("./services/mysql/MysqlService");
const cheerioService = require("./services/cheerio/CheerioService");
const teleService = require("./services/telegram/TeleServices");

const getAnimePageLinks = async () => {
  try {
    const result = await mysqlService.getLinkAnimes("0");
    return result;
  } catch (error) {
    console.log(error);
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Get Page Streaming Links", error, "10");
    throw error;
  }
};

const getLinkPerEps = async () => {
  try {
    const streamingLinks = await cheerioService.getStreamingPagePerEpisode(linkPage);
    if (streamingLinks.length > 0) {
      const mappedStreamingLinks = streamingLinks.map((streamingLink) => {
        return [animeLinks[0].id, streamingLink.eps, streamingLink.link, "0"]
      });
      await mysqlService.insertLinkStreamingPage(mappedStreamingLinks);
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
  let animeLinks = await getAnimePageLinks();
  animeLinks.forEach( async (animeLink, idx) => {
    await getLinkPerEps(animeLink.link);
    await updateAnimeLinkStatus(animeLink.id);
    if (idx === (animeLinks.length - 1)) {
      setTimeout(() => {
        main();
      }, 60000);
    }
  });
}
