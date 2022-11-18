const axios = require("axios");
const cheerio = require("cheerio");

// Get Link Download
// const getPostTitles = async () => {
// 	try {
// 		const { data } = await axios.get(
// 			'https://otakudesu.bid/episode/cwm-episode-6-sub-indo/'
// 		);
// 		const $ = cheerio.load(data);
// 		const postTitles = [];

// 		$('#venkonten > div.venser > div.venutama > div.download > ul:nth-child(2) > li:nth-child(3) > a').each((_idx, el) => {
//       const text = $(el).text();
// 			const postTitle = $(el).attr("href");
// 			postTitles.push({
//         place: text,
//         link: postTitle,
//       });
// 		});

// 		return postTitles;
// 	} catch (error) {
// 		throw error;
// 	}
// };
const getPostTitles = async () => {
	try {
		const response = await axios.get(
			'https://otakudesu.bid/anime/chaisaw-sub-indo/'
		);
		console.log(response.status);
		const $ = cheerio.load(response.data);
		const postTitles = [];

		$('#venkonten > div.venser > div:nth-child(8) > ul > li > span > a').each((_idx, el) => {
      const link = $(el).attr("href");
      postTitles.push(link);
		});

		return postTitles;
	} catch (error) {
		throw error;
	}
};

getPostTitles()
    .then((postTitles) => console.log(postTitles));