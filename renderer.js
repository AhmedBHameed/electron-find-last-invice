/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

const sourceFileBrowserBtn = document.querySelector(
  ".open-source-file-browser"
);
const lastInvoiceFileNamInput = document.querySelector(
  "#last-invoice-file-name"
);

const loadingWrapper = document.querySelector(".progress-bar");
const loadingBar = document.querySelector(".progress-bar-fill");
let startActionBtn = document.querySelector(".find-highest-file-num");

let paths = {
  srcPath: localStorage.getItem("srcPath") || "",
};

function initPathValue() {
  document.getElementById("source-folder").value =
    localStorage.getItem("srcPath") || "";
}

function applyClickEvents() {
  sourceFileBrowserBtn.addEventListener("click", () => {
    window.electronAPI.getDirectoryPath({
      selectSourcePath: true,
    });
  });

  startActionBtn.addEventListener("click", () => {
    loadingBar.style.width = "0px";
    if (paths.srcPath) {
      startActionBtn.setAttribute("disabled", true);
      loadingWrapper.style.display = "block";
      window.electronAPI.findHighestFileNum(paths);
    }
  });
}

function handleServerApi() {
  window.electronAPI.setDirectoryPath((event, response) => {
    if (response.srcPath) localStorage.setItem("srcPath", response.srcPath);
    paths = {
      ...paths,
      ...response,
    };
    initPathValue();
  });

  window.electronAPI.highestFileNumResult((event, data) => {
    startActionBtn.removeAttribute("disabled");
    const lastInvoice = data.fileNames.sort().reverse()[0];
    lastInvoiceFileNamInput.value = lastInvoice;
  });

  window.electronAPI.showError((event, response) => {
    console.log(response);
  });
}

// Sequence is important
initPathValue();
applyClickEvents();
handleServerApi();
