class SearchTwitter {
  constructor(input, go_button, prev_button, next_button, index, refresh) {
    this.input = input;
    this.refresh_callback = refresh;
    this.prev_button = prev_button;
    this.next_button = next_button;
    this.index = index;
    go_button.addEventListener("click", ()=>{this.go();});
    prev_button.addEventListener("click", ()=>{this.prev();});
    next_button.addEventListener("click", ()=>{this.next();});
    this.list = [];
    this.ptr = 0;
    this.next_results = undefined;
    this.go();
  }
  async go() {
    const value = encodeURIComponent(this.input.value);
    const res = await fetch(`/twitter/search?q=${value}&result_type=recent&exclude=retweets&count=10`);
    const result = await res.json();
    this.ptr = 0;
    this.list = result.statuses;
    this.next_results = result.search_metadata.next_results;
    this.refresh();
  }
  prev() {
    if(this.ptr <= 0) {
      return;
    }
    --this.ptr;
    this.refresh();
  }
  async next() {
    if(this.ptr >= this.list.length-2) {
      await this.searchNext();
    }
    if(this.ptr < this.list.length-1) {
      ++this.ptr;
    }
    this.refresh();
  }
  async searchNext() {
    const res = await fetch(`/twitter/search${this.next_results}`);
    const result = await res.json();
    Array.prototype.push.apply(this.list, result.statuses);
    this.next_results = result.search_metadata.next_results;
  }
  refresh() {
    if(this.list.length > this.ptr) {
      this.refresh_callback(this.list[this.ptr]);
    }
    this.prev_button.className = (this.ptr === 0?"invalid":"");
    this.next_button.className = (this.ptr === this.list.length-1?"invalid":"");
    this.index.textContent = `${this.ptr+1}/${this.list.length}`;
  }
};