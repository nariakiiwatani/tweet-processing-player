/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

(()=>{
  const debug = document.querySelector("#debug");
  let debugstr = "this is debug text for me to make debugging easier";
  
  const widget = new TwitterWidget(
    document.querySelector("#widget .widget")
  );
  const search = new SearchTwitter(
    document.querySelector("#search .value"),
    document.querySelector("#search .submit"),
    document.querySelector("#search .prev"),
    document.querySelector("#search .next"),
    document.querySelector("#search .index"),
    (status) => {
      errorMessage();
      widget.refresh(status.user.screen_name, status.id_str);
      run.runUrl(status.id_str);
    }
  );

  const run = new RunTwitter(
    document.querySelector("#url .value"),
    document.querySelector("#url .submit"),
    document.querySelector("#code .value"),
    document.querySelector("#code .submit"),
    (status) => {
      errorMessage();
      widget.refresh(status.user_id, status.status_id);
    },
    (code) => {
      errorMessage();
    }
  );
  
  const errorMessage = (message) => {
    document.querySelector("#code .error").textContent = message || "";
  };
  
  window.onerror = (message, file, line, column, error) => { errorMessage(error.message); };

  debug.textContent = debugstr;
})()

