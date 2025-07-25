import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = window.matchMedia("(prefers-color-scheme: dark)").matches ? "/Mdark.svg" : "/M.svg";
    }
  }, []);
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("link", {
        rel: "icon"
      }), /* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const NavBar = () => {
  return /* @__PURE__ */ jsx("div", { className: "bg-green-200 p-1 border-1 border-y-green-300", children: /* @__PURE__ */ jsx("h1", { className: "text-center font-bold text-green-800", children: "Money Keeper!" }) });
};
const TransactionList = ({ id, name, money, date }) => {
  return /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 rounded-sm border-0.5 border-green-100 flex justify-between p-2 my-1", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-row", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-green-950 text-start text-2xl", children: name }),
      /* @__PURE__ */ jsx("p", { children: date })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "justify-center items-center flex", children: /* @__PURE__ */ jsxs("h2", { className: "text-2xl", children: [
      "Rp",
      money ? money.toLocaleString("id-ID") : "0"
    ] }) })
  ] });
};
const History = ({ newHistory }) => {
  return /* @__PURE__ */ jsxs("div", { className: "my-10 flex-row max-w-120 mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-bold text-2xl", children: "History" }),
    /* @__PURE__ */ jsx("div", { className: "h-128 overflow-y-auto", children: newHistory.map((his) => /* @__PURE__ */ jsx(TransactionList, { id: his.id, name: his.name, money: his.money, date: his.date }, his.id)) })
  ] });
};
const SegmentedToggle = React.memo(({
  optionA,
  optionB,
  onChange
}) => {
  const [selected, setSelected] = useState(optionA);
  const [highlightStyle, setHighlightStyle] = useState({});
  const optionARef = useRef(null);
  const optionBRef = useRef(null);
  useEffect(() => {
    const currentRef = selected === optionA ? optionARef.current : optionBRef.current;
    if (currentRef) {
      setHighlightStyle({
        width: `${currentRef.offsetWidth}px`,
        left: `${currentRef.offsetLeft}px`
      });
    }
    if (onChange) onChange(selected);
  }, [selected, optionA, optionB, onChange]);
  return /* @__PURE__ */ jsxs("div", { className: "my-2", children: [
    /* @__PURE__ */ jsx("p", { className: "my-2", children: "Nama: " }),
    /* @__PURE__ */ jsxs("div", { className: "relative inline-flex border rounded-full bg-gray-200 p-1", children: [
      /* @__PURE__ */ jsx(
        "span",
        {
          className: "absolute top-1 bottom-1 rounded-full bg-white shadow transition-all duration-300",
          style: highlightStyle
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          ref: optionARef,
          onClick: () => setSelected(optionA),
          className: `relative z-10 px-4 py-1 rounded-full transition-colors duration-300 ${selected === optionA ? "text-blue-900" : "text-gray-500"}`,
          children: optionA
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          ref: optionBRef,
          onClick: () => setSelected(optionB),
          className: `relative z-10 px-4 py-1 rounded-full transition-colors duration-300 ${selected === optionB ? "text-pink-700" : "text-gray-500"}`,
          children: optionB
        }
      )
    ] })
  ] });
});
SegmentedToggle.displayName = "SegmentedToggle";
const TypeOfTransaction = React.memo(() => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { children: "Tipe transaksi" }),
    /* @__PURE__ */ jsxs("div", { className: "relative inline-flex border rounded-full bg-gray-200 p-1", children: [
      /* @__PURE__ */ jsx("span", { className: "absolute top-1 bottom-1 rounded-full bg-white shadow transition-all duration-300" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `relative z-10 px-4 py-1 rounded-full transition-colors duration-300`,
          children: "Borrow"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `relative z-10 px-4 py-1 rounded-full transition-colors duration-300`,
          children: "Pay"
        }
      )
    ] })
  ] });
});
TypeOfTransaction.displayName = "TypeOfTransaction";
const InputMoney = React.memo(({ handleClick, nameValue, inputValue, handleChange, handleNameChange, handleNameSelect, setIsBorrow, isBorrow }) => {
  const formatted = new Intl.NumberFormat("id-ID").format(Number(inputValue || 0));
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleClick, className: "flex-row justify-center align-items", children: [
    /* @__PURE__ */ jsx(
      SegmentedToggle,
      {
        optionA: "Hafizh",
        optionB: "Wini",
        onChange: handleNameSelect
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "dropdown dropdown-start", children: [
      /* @__PURE__ */ jsx("div", { tabIndex: 0, role: "button", className: "btn bg-green-200 text-green-800 m-1", children: isBorrow === true ? "Borrow" : "Pay" }),
      /* @__PURE__ */ jsxs("ul", { tabIndex: 0, className: "dropdown-content menu bg-green-300 text-green-800 rounded-md rounded-box z-1 w-26 p-2 shadow-sm", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsBorrow(true), children: "Borrow" }) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsBorrow(false), children: "Pay" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2", children: "Masukkan Uang" }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-xs mb-4", children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500", children: "Rp" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          value: formatted,
          type: "text",
          inputMode: "decimal",
          onChange: handleChange,
          className: "pl-10 pr-4 py-2 w-full text-2xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
          placeholder: "0"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("button", { type: "submit", className: "bg-green-200 p-2 rounded-md btn text-green-800 border-green-800 text-xl", children: "Press" })
  ] });
});
InputMoney.displayName = "InputMoney";
const Transaction = React.memo(({ handleClick, nameValue, inputValue, handleChange, handleNameChange, setNameValue, setIsBorrow, isBorrow }) => {
  return /* @__PURE__ */ jsx("div", { className: "text-center flex-row", children: /* @__PURE__ */ jsx(InputMoney, { handleClick, nameValue, inputValue, handleChange, handleNameChange, handleNameSelect: setNameValue, setIsBorrow, isBorrow }) });
});
const baseUrl$1 = `${"http://localhost:4000"}/history`;
const getHistory = () => {
  return axios.get(`${baseUrl$1}`);
};
const postTransaction = (name, money) => {
  return axios.post(`${baseUrl$1}`, { name, money });
};
const historyService = { getHistory, postTransaction };
const baseUrl = `${"http://localhost:4000"}/people`;
const getPerson = () => {
  return axios.get(`${baseUrl}`);
};
const postPerson = (personObject) => {
  return axios.post(`${baseUrl}`, personObject);
};
const patchTransaction = (id, personObject) => {
  return axios.patch(`${baseUrl}/${id}`, personObject);
};
const personService = { getPerson, postPerson, patchTransaction };
function Money() {
  const [nameValue, setNameValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showTransaction, setShowTransaction] = useState(false);
  const [history, setHistory] = useState([]);
  const [isBorrow, setIsBorrow] = useState(false);
  const [person, setPerson] = useState([]);
  useEffect(() => {
    historyService.getHistory().then((res) => {
      console.log(res.data);
      setHistory(res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }).catch((err) => {
      console.error(err);
      alert("Failed to fetch history.");
    });
    personService.getPerson().then((res) => {
      setPerson(res.data);
    }).catch((err) => {
      console.log(err.message);
      alert("Failed to fetch person");
    });
    console.log(person);
  }, []);
  const money = useMemo(() => {
    return history.reduce((accumulator, item) => accumulator + Number(item.money), 0);
  }, [history]);
  const handleChange = useCallback((event) => {
    const rawValue = event.target.value.replace(/\D/g, "");
    setInputValue(rawValue);
  }, []);
  const handleNameChange = useCallback((event) => {
    setNameValue(event.target.value);
  }, []);
  const handleClick = useCallback((event) => {
    event.preventDefault();
    let num = Number(inputValue);
    if (isBorrow) {
      num = Number(inputValue) * -1;
    }
    const name = nameValue;
    if (isNaN(num)) {
      window.alert("Number contains a string!");
    } else if (num === 0) {
      window.alert("Number is 0");
    } else {
      historyService.postTransaction(name, num).then((res) => {
        setHistory((prevHistory) => [res.data, ...prevHistory]);
        const foundPerson = person.find((p) => p.name === name);
        console.log(foundPerson);
        if (foundPerson && foundPerson.id) {
          personService.patchTransaction(foundPerson.id, res.data);
        }
      }).catch((error) => {
        console.log(error.message);
        alert("Failed to post Transaction");
      });
    }
    setInputValue("");
  }, [inputValue, isBorrow, nameValue]);
  return /* @__PURE__ */ jsxs("div", { className: "justify-center text-center flex-row mt-1 ", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center text-6xl gap-64 cursor-not-allowed select-none", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-4xl", children: "Money owed by" }),
      /* @__PURE__ */ jsxs("h1", { children: [
        "Rp",
        money ? money.toLocaleString("id-ID") : "0"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("button", { className: "bg-green-200 p-2 rounded-md btn text-green-800 border-green-800", onClick: () => setShowTransaction(true), children: "Add a transaction" }) }),
    showTransaction && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-opacity-40 bg-blur-sm flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded shadow-lg relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "absolute top-2 right-2 text-xl",
          onClick: () => setShowTransaction(false),
          children: "×"
        }
      ),
      /* @__PURE__ */ jsx(
        Transaction,
        {
          handleClick,
          nameValue,
          inputValue,
          handleChange,
          handleNameChange,
          setNameValue,
          setIsBorrow,
          isBorrow
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(History, { newHistory: history })
  ] });
}
function meta({}) {
  return [{
    title: "Money Keeper!"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx(NavBar, {}), /* @__PURE__ */ jsx(Money, {})]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-B6b-lELA.js", "imports": ["/assets/chunk-QMGIS6GS-B6qEP1Oj.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CihR2A8N.js", "imports": ["/assets/chunk-QMGIS6GS-B6qEP1Oj.js"], "css": ["/assets/root-Cq9ulTK0.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-DVnhBFFd.js", "imports": ["/assets/chunk-QMGIS6GS-B6qEP1Oj.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-3712734d.js", "version": "3712734d", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
