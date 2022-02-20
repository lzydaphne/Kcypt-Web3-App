import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

//過 React.createContext API 建立一個 context，裡面的內容為預設值：
export const TransactionContext = React.createContext();

/*瀏覽器中如果有安裝meta mask ， 在console中就會有ethereum物件 */
const { ethereum } = window;

const getEthereumContract = () => {
  /*连接到现有的 Web3 提供者 (如： web3Instance.currentProvider).
如果没指定参数 network ，也会自动检测网络 network （主网还是测试网）*/
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  // console.log({
  //   provider,
  //   signer,
  //   transactionsContract,
  // });
  return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  // const [transactionCount, setTransactionCount] = useState(0);
  /* 如果把transactionCount預設為0，每次重新載入頁面都會重置
  所以乾脆使用瀏覽器的LocalStorage */
  const [transactions, setTransactions] = useState([]);
  //拿舊state來更新
  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  /** 抓取目前所有的交易 */
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = getEthereumContract(); //得到部屬的合約實體

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        console.log(availableTransactions);

        /*指定交易呈現形式 */
        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            // 把時間戳轉換成「十進制」
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18, //wei to eth
          })
        );
        console.log(structuredTransactions);
        setTransactions(structuredTransactions); //更新交易形態到STATE中
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //檢查瀏覽器是否有連結到錢包
  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        //have access to our account
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*  */
  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = getEthereumContract(); //得到部屬的合約實體

        const currentTransactionCount =
          await transactionsContract.getTransactionCount(); //得到交易數量
        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        ); //在瀏覽器中記錄交易數量
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  //前端連結到錢包
  //https://youtu.be/Wn_Kb3MR_cU?t=6276
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  /* 送出交易--start*/
  const sendTransaction = async () => {
    try {
      //假如有連結到錢包
      if (ethereum) {
        //獲得表單資料
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = getEthereumContract(); //得到部屬的合約實體
        const parsedAmount = ethers.utils.parseEther(amount); //把ethers換成wei

        /* send ethers from A address to B address */
        await ethereum.request({
          method: "eth_sendTransaction", //創建一個新的消息調用交易msg call tx，如果數據字段data中包含代碼，則創建一個合約。
          params: [
            //參數通常以array包裝
            {
              from: currentAccount,
              to: addressTo,
              gas: "0x5208", //21000 GWEI ，hex型態
              value: parsedAmount._hex, //wei換成hex型態
            },
          ],
        });
        /* 調用合約方法，得到唯一的tx id (tx hash) */
        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true); //正在加載
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait(); //等待加載
        setIsLoading(false);
        console.log(`Success - ${transactionHash.hash}`);

        const transactionsCount =
          await transactionsContract.getTransactionCount(); //得到交易數量

        setTransactionCount(transactionsCount.toNumber()); //用state+localStorage保存交易數量
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
    /*  end send ethers*/
  };

  /* 送出交易--end*/

  //頁面載入時就去請求資料
  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    // context 是在「需要存取global變數並重繪頁面，不需要母子一層一層傳遞」
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        currentAccount,
        transactions,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
      {/* https://ithelp.ithome.com.tw/articles/10218605
      在react component中，我們把包在標籤中間的東西，稱為children
      children是props之一，所以當使用的children改變時，畫面也會重繪 */}
    </TransactionContext.Provider>
  );
};
