const axios = require("axios");
const log = require("log-to-file");

exports.sendNotifSuccess = async (teleToken, teleMessageId, title, episode, datas) => {
  try {
    const parsingData = datas.map((data) => {
      return `Tempat : ${data.text}\nLink : ${data.link}`;
    }).join("\n");
    const message = `✅ ANIME UPDATE\n>>${title}<<\n>>Episode ${episode}<<\n${parsingData}`;
    await axios.get(`https://api.telegram.org/bot${teleToken}/sendMessage`, {
      params: {
        chat_id: teleMessageId,
        text: message,
      }
    });
  } catch (error) {
    log(error, "tele-log.txt");
    throw error;
  }
}


exports.sendNotifFailed = async (teleToken, teleMessageId, title, errorMsg, lineError) => {
  try {
    const message = `❌ ${title}\n${errorMsg}\n${lineError}`;
    await axios.get(`https://api.telegram.org/bot${teleToken}/sendMessage`, {
      params: {
        chat_id: teleMessageId,
        text: message,
      }
    });
  } catch (error) {
    log(error, "tele-log.txt");
    throw error;
  }
};
