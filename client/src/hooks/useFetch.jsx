import { useEffect, useState } from "react";

const APIKEY = import.meta.env.VITE_GIPHY_API;
// const APIKEY = "MMfSFwOhb14f4xmrBw2vsFmaWwN9RSk3";

// custom hook
/**自定義 Hook 其實是用 JS 函式搭配 React Hook
 * 封裝成一個有特定用途或是重複使用邏輯的函式，
 * 名稱要有 use，這個函式內也可以用調 React 本身的 Hook */

/**感覺hook是「動態的component」
 * 函數版的component
 */
const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${keyword
          .split(" ")
          .join("")}&limit=1`
      );
      const { data } = await response.json();

      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (error) {
      setGifUrl(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };
  // 組件渲染完後才會呼叫 useEffect 內的 function
  //不管這個組件是第一次渲染還是重新渲染
  //useEffect 內的 function 一樣會在組件渲染完後被呼叫
  //這個時間點剛好非常適合來呼叫 API 並更新資料
  /*
useEffect(<didUpdate>, [dependencies])
第二個參數稱作 dependencies，它是一個陣列，
只要每次重新渲染後 dependencies 內的元素沒有改變，
任何 useEffect 裡面的函式就不會被執行！ */

  /*「組件渲染完後，如果 dependencies 有改變，
才會呼叫 useEffect 內的 function」 */
  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
