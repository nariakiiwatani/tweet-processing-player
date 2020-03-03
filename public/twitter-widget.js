class TwitterWidget {
  constructor(parent) {
    this.parent = parent;
  }
  createElementFromHTML(html) {
    const tempEl = document.createElement('div');
    tempEl.innerHTML = html;
    return tempEl.firstElementChild;
  }
  refresh(user_id, status_id) {
    while(this.parent.firstChild) this.parent.removeChild(this.parent.firstChild);
    const widget = this.createElementFromHTML(`<blockquote class="twitter-tweet" data-conversation="none"><a href="https://twitter.com/${user_id}/status/${status_id}"></a></blockquote>`);
    this.parent.appendChild(widget);
    twttr.widgets.load();
  }

};