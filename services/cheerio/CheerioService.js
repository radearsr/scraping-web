const axios = require("axios");
const cheerio = require("cheerio");
const log = require("log-to-file");

exports.checkUpdateAndGetLinkDownload = async (linkAnime, lastEpisode, timeout) => {
  try {
    const response = await axios.get(linkAnime, { timeout });
    if (response.status !== 200) {
      throw new Error("Status : ", response.status);
    }
    const $ = cheerio.load(response.data);
    const allEpisodes = [];
    $("#venkonten > div.venser > div:nth-child(8) > ul > li > span > a").each((_idx, el) => {
      const link = $(el).attr("href");
      allEpisodes.push(link);
    });
    if (allEpisodes.length > lastEpisode) {
      return {
        status: 1,
        link: allEpisodes[0],
      };
    }
    return {
      status: 0,
    };
  } catch (error) {
    log(error, "cheerio-log.txt");
    throw error;
  }
};


exports.getLinkDownloadVideo720p = async (pageLink, timeout) => {
  try {
    const response = await axios.get(pageLink, { timeout });
    if (response.status !== 200) {
      throw new Error("Status : ", response.status);
    }
    const $ = cheerio.load(response.data);
    const allLinkDownloads = [];
    $("#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a").each((_idx, el) => {
      const text = $(el).text();
      const link = $(el).attr("href");
      allLinkDownloads.push({
        text,
        link,
      });
    });
    return allLinkDownloads;
  } catch (error) {
    log(error, "cheerio-log.txt");
    throw error;
  }
};

exports.getStreamingPagePerEpisode = async (pageLink, timeout=3000) => {
	try {
    const response = await axios.get(pageLink, { timeout });
    if (response.status !== 200) {
      throw new Error("Status : ", response.status);
    }
    const $ = cheerio.load(response.data);
    const allLinkStreaming = [];
    $("#content-wrap > div.ngirix > div:nth-child(4) > div.ep > a").each((_idx, el) => {
      const text = parseFloat($(el).text());
      const link = $(el).attr("href");
			allLinkStreaming.push({
				eps: text,
				link: `https://185.224.82.193${link}`
			});
    });
    return allLinkStreaming;
	} catch (error) {
		throw error;
	}
};


exports.getStreamingVideo = async (pageLink, timeout=3000) => {
	try {
    const response = await axios.get(pageLink, { timeout });
    if (response.status !== 200) {
      throw new Error("Status : ", response.status);
    }
    const $ = cheerio.load(response.data);
    const videoLinks = [];

		$("#content-wrap > div.ngiri > div:nth-child(2) > div.servers > a").each((_idx, el) => {
      const text = $(el).text().trim();
			const link = $(el).attr("data-video");
			if (text === "GDRIVE" || text === "GDRIVE HD") {
				videoLinks.push({
					title: text,
					link: `https:${link}`,
				});
			}
		});
		return videoLinks;
	} catch (error) {
		throw error;
	}
};