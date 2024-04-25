const Mixpanel = require("mixpanel");
const config = require("../config");

const mixpanel = Mixpanel.init(config.MIXPANEL_TOKEN);

/**
 *
 * @param {name, data, id}
 * name: Event Name,
 * data: Additional Data,
 * id: Unique Identifier
 */
const MIXPANEL_TRACK = ({ name = "", data = {}, id = "" }) => {
  mixpanel.track(name, {
    distinct_id: id,
    ...data,
  });
};

module.exports = MIXPANEL_TRACK;
