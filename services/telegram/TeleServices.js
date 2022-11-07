const axios = require("axios");

exports.sendNotifToTelegram = async (token, msgId, message,  title, episode, status=1) => {
  try {
    if (!status) {
      return await axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${msgId}&text=${title}%0D%0A${message}`);
    }
    const reformatLinks = message.map((msg) => {
      return `Tempat : ${msg.text}%0D%0ALink : ${msg.link}`;
    }).join("%0D%0A");
    const formatMsg = `>>>> Anime Update <<<<%0D%0A>>${title}<<%0D%0A>>Episode ${episode}<<%0D%0A${reformatLinks}`;
    await axios.get(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${msgId}&text=${formatMsg}`);
    console.log("Terkirim");
  } catch (error) {
    console.error(error);
  }
};
