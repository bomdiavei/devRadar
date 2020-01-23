const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../Websocket");
module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = response.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );
      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    return res.json(dev);
  },

  async show(req, res) {
    const id = req.params._id;
    const dev = await Dev.findById(id);

    return res.json(dev);
  },

  async update(req, res) {
    const { _id } = req.params;
    const { techs } = req.body;
    const techsArray = parseStringAsArray(techs);

    let dev = await Dev.findById(_id);
    if (dev) {
      const response = await axios.get(
        `https://api.github.com/users/${dev.github_username}`
      );

      const { bio } = response.data;
      dev = await Dev.updateOne(
        { _id },
        {
          bio: bio,
          techs: techsArray
        }
      );
    }

    return res.json(dev);
  },

  async destroy(req, res) {
    const _id = req.params._id;

    const dev = await Dev.findById(_id);

    if (dev != null) {
      await Dev.deleteOne({ _id });
      return res.json({ message: "Deletado" });
    }

    return res.json({ message: "Falho" });
  }
};
