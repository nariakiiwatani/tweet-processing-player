class RunTwitter {
  constructor(input, url_button, code, code_button, url_callback, code_callback) {
    this.input = input;
    this.code = code;
    url_button.addEventListener("click", ()=> { this.runUrl(this.input.value, url_callback)});
    code_button.addEventListener("click", ()=> { this.runCode(code_callback); });
  }
  async getTwitterStatus(id, callback) {
    const response = await fetch("/twitter/status?id="+id);
    callback(await response.json());
  };
  runUrl(url, callback) {
    if(url !== undefined) this.input.value = url;
    function getID(url) {
      // Twitter URL RegExp pattern from: https://hkitago.com/2018/03/url%E3%81%8B%E3%82%89%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88id%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B%E6%AD%A3%E8%A6%8F%E8%A1%A8%E7%8F%BE/
      const pattern = new RegExp("(?:https?://)?(?:mobile.)?(?:www.)?(?:twitter.com/)?(?:#!/)?(?:\\w+)/status(?:es)?/(\\d+)","i");
      const result = url.match(pattern);
      return result ? result[1] : url;
    };
    function htmlDecode(input){
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes[0].nodeValue;
    }
    const id = getID(this.input.value);
    this.getTwitterStatus(id, (result)=> {
      this.code.value = htmlDecode(result.text);
      this.runCode();
      this.runCode();
      if(callback) callback(result);
    });
  }
  runCode(callback) {
    const code = this.code.value;
    const script = document.createElement("script");
    const prepend = "remove(); new p5(null, 'player');";
    script.text = prepend+code;
    if(callback) callback(code);
    document.body.appendChild(script);
  }
};