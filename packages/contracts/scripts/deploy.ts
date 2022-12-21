import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { HabitApp__factory } from "../typechain-types";

async function main() {
  const accounts = await ethers.getSigners();

  const [owner, user] = accounts;

  const contractFactory = new HabitApp__factory(owner);
  const contract = await contractFactory.deploy([]);
  await contract.deployed();
  
  console.log(`Contract deployed at ${contract.address}\n`);

  const createCampaignTx = await contract.createCampaign({
    name: ethers.utils.formatBytes32String("30 day challenge"),
    duration: 30,
    tokenLockInRequired: ethers.utils.parseEther("0.05"),
  });

  createCampaignTx.wait();

  const campaigns = await contract.getCampaigns();
  console.log({campaigns});

  let latestBlock = await time.latest();
  await time.increaseTo(latestBlock + 86400);

  // const createUserCampaignTx = await contract.connect(user).createUserCampaign(0, [
  //   "hello",
  //   "world",
  //   "foo",
  //   "bar"
  // ], { value: ethers.utils.parseEther("0.05") });

  // await createUserCampaignTx.wait();

  // let latestBlock = await time.latest();
  // await time.increaseTo(latestBlock + 86400000);
  
  // const markHabitsDoneTodayTx = await contract.connect(user).markHabitsDoneToday(4);
  // await markHabitsDoneTodayTx.wait();

  // await time.increaseTo(latestBlock + (86400000 * 30));

  // const userCampaign = await contract.addressToCampaign(user.address);
  // console.log({ userCampaign }, ethers.utils.formatEther(userCampaign.fundsClaimable));

  // let userBalance = await user.getBalance();
  // console.log({userBalance});
  
  // const withdrawClaimableFundsTx = await contract.connect(user).withdrawClaimableFunds();
  // await withdrawClaimableFundsTx.wait();
  // let userBalanceAfter = await user.getBalance();
  // console.log({userBalanceAfter}, ethers.utils.formatEther(userBalanceAfter.sub(userBalance)));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});