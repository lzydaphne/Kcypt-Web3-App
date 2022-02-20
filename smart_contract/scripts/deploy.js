//main:負責部屬合約
const main = async () => {
  //像是class
  //ethers.js中ContractFactory用於部署新智慧合約的抽象，因此這是代幣合約例項的工廠。
  const Transactions = await hre.ethers.getContractFactory("Transactions");

  //像是instance
  //呼叫ContractFactory的deploy()將開始部署合約，並返回一個解析為Contract物件的Promise。該物件具有用於你的智慧合約功能的全部方法。
  const transactions = await Transactions.deploy();
  //獲得全部供應的代幣所有者是進行部署的帳戶，並且在使用hardhat-ethers外掛 ContractFactory和Contract例項時，預設情況下將其連線到第一個Signer。這意味著owner變數中的帳戶執行了部署，並且balanceOf()應返回全部供應量。
  await transactions.deployed();
  console.log("Transactions deploy to ", transactions.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
