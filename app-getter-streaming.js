const mysqlService = require("./services/mysql/MysqlService");
const cheerioService = require("./services/cheerio/CheerioService");
const teleService = require("./services/telegram/TeleServices");

const getterStreaming = async () => {
  try {
    const animeLinks = await mysqlService.getLinkAnimes("0");
    if (animeLinks.length > 0) {
      const streamingLinks = await cheerioService.getStreamingPagePerEpisode(animeLinks[0].link);
      if (streamingLinks.length > 0) {
        const mappedStreamingLinks = streamingLinks.map((streamingLink) => {
          return [animeLinks[0].id, streamingLink.eps, streamingLink.link, "0"];
        });
        await mysqlService.insertLinkStreamingPage(mappedStreamingLinks);
        await mysqlService.updateStatusListAnime("1", animeLinks[0].id);
        const _animeLinks = await mysqlService.getLinkAnimes("0");
        if (_animeLinks.length > 0) {
          await getterStreaming();
        } else {
          await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Selesai", streamingLinks, "10");
        }
      } else {
        await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Link Page tidak didapat", streamingLinks, "10");
      }
    } else {
      clearInterval(work)
      await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "All Link Berhasil diupdate...", error, "20");
    }
  } catch (error) {
    await teleService.sendNotifFailed(process.env.BOT_TOKEN, process.env.GROUP_ID, "Getter Streaming Page", error, "23");
    console.log(error);
    throw error;
  }
};

getterStreaming();
