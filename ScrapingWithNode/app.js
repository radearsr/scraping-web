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
// const getPostTitles = async () => {
// 	try {
// 		const { data } = await axios.get(
// 			'https://185.224.82.193/kokoro-connect-01/'
// 		);
// 		const $ = cheerio.load(data);
// 		const postTitles = [];

// 		console.log($("#tontonin").attr("src"))

// 		// $('#venkonten > div.venser > div:nth-child(8) > ul > li > span > a').each((_idx, el) => {
//     //   const text = $(el).text();
// 		// 	postTitles.push(text);
// 		// });

// 		return postTitles;
// 	} catch (error) {
// 		throw error;
// 	}
// };
const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'http://gdriveplayer.to/embed2.php?link=Z340bSdNA2yNJb%2FhIQ4JwA0U7WkvwDWkicFkozeM36ZYRVQscuHqooZJOEdyQHo5VPzP%2BMwI83AYLNwC9A%2BWGIvzPTIjoFgHG%2FI8Ti3nzdbF6xJ06%2F%2FydwXcd7as12JKt5hoFxq8auKlQ5nBj%2FUAFpZiinKPyKTM4ISLk9QXR8OWh%2Fdy%2FJRD17vDQn8IqXlUAy9TcNSOyC0RTz0e3E1ZVI&no_adult=yes', {timeout: 10000});
		const $ = cheerio.load(data);
		const postTitles = [];

		console.log(data);

		console.log($("#player > .jw-wrapper > .jw-media > .jw-video").attr("src"))

		// $('#venkonten > div.venser > div:nth-child(8) > ul > li > span > a').each((_idx, el) => {
    //   const text = $(el).text();
		// 	postTitles.push(text);
		// });

		return postTitles;
	} catch (error) {
		throw error;
	}
};

getPostTitles()
    .then((postTitles) => console.log(postTitles));