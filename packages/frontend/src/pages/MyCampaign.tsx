import React, { SyntheticEvent } from 'react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
  useWaitForTransaction,
} from 'wagmi';
import { Link, useLocation } from 'react-router-dom';

import HabitAppJson from '../assets/HabitApp.json';
import { CONTRACT_ADDRESS } from '../config';
import { Campaign } from '../types';
import { BigNumber, ethers } from 'ethers';
import { Block } from '@ethersproject/abstract-provider';

type UserCampaign = {
  campaign: Campaign;
  fundsClaimable: BigNumber;
  fundsLocked: BigNumber;
  habits: Array<string>;
  lastMarkedDoneAt: BigNumber;
  noOfDaysLeft: BigNumber;
};

const MyCampaign: React.FC<{}> = () => {
  const { address } = useAccount();
  const location = useLocation();
  const provider = useProvider();
  const [currentBlock, setCurrentBlock] = React.useState<Block>();

  const { data, isFetching, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: HabitAppJson.abi,
    functionName: 'getUserCampaign',
    args: [address],
  });

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: HabitAppJson.abi,
    functionName: 'markHabitsDoneToday',
    onError: (err) => {
      console.log(err);
    },
    args: [1],
    onSuccess: () => {
      refetch();
    },
  });

  const {
    write,
    data: writeData,
    isLoading: writeLoading,
  } = useContractWrite(config);

  React.useEffect(() => {
    (async () => {
      const block = await provider.getBlock('latest');
      setCurrentBlock(block);
    })();
  }, [provider]);

  const { isLoading } = useWaitForTransaction({
    hash: location.search.startsWith('waitFor')
      ? `0x${location.search.replace('waitFor=0x', '')}`
      : undefined,
  });

  const markTasksDone = React.useCallback(
    (event: SyntheticEvent) => {
      event.preventDefault();
      const { habits } = data as UserCampaign;

      let tasksDone = 0;
      habits.forEach((habit) => {
        const element = (event.target as HTMLFormElement)[`habit-${habit}`];
        const isChecked = element && element.checked;
        if (isChecked) {
          tasksDone++;
        }
      });

      console.log(write);

      write?.({
        recklesslySetUnpreparedArgs: [tasksDone],
      });
    },
    [write, data]
  );

  if (isFetching || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <h1 className="text-2xl">Loading your current campaign</h1>
        <div
          className="animate-spin inline-block w-8 h-8 border-4 border-r-transparent rounded-full"
          role="status"
        >
          <span className="visually-hidden hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (data && (data as UserCampaign)?.habits.length > 0 && currentBlock) {
    const {
      campaign,
      fundsLocked,
      fundsClaimable,
      lastMarkedDoneAt,
      noOfDaysLeft,
      habits,
    } = data as UserCampaign;

    const currentBlockDate = Math.floor(currentBlock.timestamp / 86400);
    const diffInTimestamps = currentBlockDate - lastMarkedDoneAt.toNumber();
    const lastDoneText =
      diffInTimestamps === 0 ? 'Today' : `${diffInTimestamps} day(s) ago`;
    return (
      <div className="w-full flex flex-col items-center p-16">
        <h1 className="text-4xl text-center">
          {ethers.utils.parseBytes32String(campaign.name)}
        </h1>
        <div className="w-full flex items-center justify-between text-lg">
          <button className="btn btn-info">
            Funds Locked: {ethers.utils.formatEther(fundsLocked)} ETH
          </button>
          <button className="btn btn-success">
            Funds Claimable: {ethers.utils.formatEther(fundsClaimable)} ETH
          </button>
        </div>
        <div className="w-full flex items-center justify-between my-8">
          <div>Last marked done at: {lastDoneText}</div>
        </div>
        <div className="w-full flex items-center justify-between">
          <div>
            Number of days left: {noOfDaysLeft.toString()}/
            {campaign.duration.toString()}
          </div>
        </div>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={markTasksDone}
        >
          <h3 className="text-2xl font-bold my-4 w-full">Habits</h3>
          {habits.map((habit) => {
            return (
              <div className="form-group items-center flex bg-black/50 hover:bg-black/90 p-4 rounded my-2 w-full">
                <input
                  type="checkbox"
                  className="checkbox mr-4"
                  id={`habit-${habit}`}
                />
                <label
                  htmlFor={`habit-${habit}`}
                  className="capitalize text-xl"
                >
                  {habit}
                </label>
              </div>
            );
          })}
          <button
            className="btn btn-lg btn-accent disabled:bg-error disabled:text-white my-4"
            disabled={diffInTimestamps === 0 || writeLoading}
            type="submit"
          >
            {writeLoading && (
              <div
                className="animate-spin inline-block w-8 h-8 border-4 border-r-transparent rounded-full mr-4"
                role="status"
              >
                <span className="visually-hidden hidden">Loading...</span>
              </div>
            )}
            {diffInTimestamps === 0 ? 'Come back tomorrow' : 'Mark as Done'}
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="w-full max-w-lg m-auto flex flex-col items-center justify-center min-page-height">
        <h1 className="text-3xl">You haven't started any campaigns</h1>
        <Link to="/join">
          <button className="btn btn-wide btn-lg my-8 btn-primary">
            Start
          </button>
        </Link>
      </div>
    );
  }
};

export default MyCampaign;
