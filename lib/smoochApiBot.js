'use strict';

const Bot = require('./bot');

class SmoochApiBot extends Bot {
    constructor(options) {
        super(options);

        this.name = options.name;
        this.avatarUrl = options.avatarUrl;
    }

    say(text, actions) {
        const api = this.store.getApi();
        let message = Object.assign({
            text,
            actions: actions,
            role: 'appMaker'
        }, {
            name: this.name,
            avatarUrl: this.avatarUrl
        });
        return api.appUsers.sendMessage(this.userId, message);
    }

    linkToMessenger(text, page_id) {
      const api = this.store.getApi();
      const linkUrl  = 'https://m.me/' + page_id + '?ref=' + this.userId;

      let message = Object.assign({
          text,
          actions: [{"type":'link', "text":'Send to Messenger', "uri":linkUrl}],
          role: 'appMaker'
      }, {
          name: this.name,
          avatarUrl: this.avatarUrl
      });
      return api.appUsers.sendMessage(this.userId, message);
    }
}

module.exports = SmoochApiBot;
