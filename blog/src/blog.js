const BASE_URL = "https://raymeskhoury.github.io/blog/posts";
const POSTS_PER_PAGE = 3;

var converter = new showdown.Converter();

async function getPosts() {
  const url = BASE_URL + "/published.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    if (!json.published || !Array.isArray(json.published)) {
      return null;
    }

    return json.published;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function getPost(name) {
  const url = BASE_URL + "/" + name;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    if (!text) {
      return null;
    }

    return text;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// modes are single, multiple and error.
let mode = "single";
let newerLink;
let olderLink;
let posts = [];

async function addPost(name) {
  const post = await getPost(name);
  if (!post) {
    return;
  }
  const date = new Date(Date.parse(name.substring(0, 10)));

  const lines = post.split("\n");
  let title;
  let image;
  let body = [];

  let inPreamble = false;
  for (const line of lines) {
    if (line === "---") {
      if (inPreamble) {
        inPreamble = false;
        continue;
      }
      inPreamble = true;
      continue;
    }

    if (inPreamble) {
      if (line.startsWith("title:")) {
        title = line.split(":")[1].trim();
      }
      if (line.startsWith("image:")) {
        image = line.split(":")[1].trim();
      }
      continue;
    }

    body.push(line);
  }
  posts.push({
    name: name,
    date: date,
    title: title,
    image: image,
    body: converter.makeHtml(body.join("\n")),
  });
}

async function downloadPosts() {
  const urlParams = new URLSearchParams(window.location.search);
  const postName = urlParams.get("post");

  const posts = await getPosts();
  if (posts === null) {
    mode = "error";
    return;
  }

  if (postName) {
    mode = "single";
    let index = 0;
    for (; index < posts.length; ++index) {
      if (posts[index] === postName) {
        break;
      }
    }
    if (index === posts.length) {
      mode = "error";
      return;
    }

    if (index >= 1) {
      newerLink = {
        post: posts[index - 1],
      };
    }
    if (index < posts.length - 1) {
      olderLink = {
        post: posts[index + 1],
      };
    }
    await addPost(postName);
    return;
  }

  mode = "multiple";
  const pageRequested = Number(urlParams.get("page"));
  const postsPerPageRequested = Number(urlParams.get("count"));
  let page = 0;
  let postsPerPage = POSTS_PER_PAGE;
  if (pageRequested !== NaN && pageRequested >= 0) {
    page = pageRequested;
  }
  if (postsPerPageRequested !== NaN && postsPerPageRequested > 0) {
    postsPerPage = postsPerPageRequested;
  }

  if (page * postsPerPage >= posts.length) {
    mode = "error";
    return;
  }

  const promises = [];
  for (
    let i = page * postsPerPage;
    i < posts.length && i < (page + 1) * postsPerPage;
    i++
  ) {
    promises.push(addPost(posts[i]));
  }
  await Promise.all(promises);

  if (page > 0) {
    newerLink = {
      page: page - 1,
      count: postsPerPage,
    };
  }

  if ((page + 1) * postsPerPage < posts.length) {
    olderLink = {
      page: page + 1,
      count: postsPerPage,
    };
  }
}

function executeScriptElements(containerElement) {
  const scriptElements = containerElement.querySelectorAll("script");

  Array.from(scriptElements).forEach((scriptElement) => {
    const clonedElement = document.createElement("script");

    Array.from(scriptElement.attributes).forEach((attribute) => {
      clonedElement.setAttribute(attribute.name, attribute.value);
    });

    clonedElement.text = scriptElement.text;

    scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
  });
}

async function renderPosts() {
  if (mode === "error") {
    document.getElementById("postsWrapper").style.display = "none";
    document.getElementById("newerButton").style.display = "none";
    document.getElementById("olderButton").style.display = "none";
    document.getElementById("errorMessage").style.display = "block";
    return;
  }

  document.getElementById("errorMessage").style.display = "none";
  document.getElementById("postsWrapper").style.display = "block";

  const postsWrapper = document.getElementById("postsWrapper");
  for (const post of posts) {
    const template = document.getElementById("postTemplate").cloneNode(true);
    template.id = undefined;
    template.style.display = "block";
    template.getElementsByClassName("blogtitle")[0].innerText = post.title;
    template.getElementsByClassName("blogimg")[0].src = post.image;
    template.getElementsByClassName("blogheadinglink")[0].href = "?page=" + post.name;

    
    template.getElementsByClassName("blogcontent")[0].innerHTML = post.body;
    const options = { year: "numeric", month: "long", day: "numeric" };
    template.getElementsByClassName("blogdate")[0].innerText =
      post.date.toLocaleDateString("en-AU", options);
    postsWrapper.appendChild(template);
  }

  document.getElementById("postsWrapper").style.display = "block";
  if (newerLink) {
    document.getElementById("newerButton").href =
      "?" + new URLSearchParams(newerLink).toString();
    document.getElementById("newerButton").style.display = "block";
  }
  if (olderLink) {
    document.getElementById("olderButton").href =
      "?" + new URLSearchParams(olderLink).toString();
    document.getElementById("olderButton").style.display = "block";
  }

  executeScriptElements(document.getElementById("postsWrapper"));
}

async function main() {
  await downloadPosts();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPosts);
  } else {
    renderPosts();
  }
}

main();
