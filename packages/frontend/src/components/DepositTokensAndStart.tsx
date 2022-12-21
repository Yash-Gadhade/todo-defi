import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import HabitAppJson from '../assets/HabitApp.json';
import { CONTRACT_ADDRESS } from '../config';
import { Campaign } from '../types';

interface Props {
  habits: Array<string>;
  selectedCampaign: string;
  dispatch: any;
  campaigns: Campaign[];
}

const DepositTokensAndStart: React.FC<Props> = ({
  habits,
  campaigns,
  selectedCampaign,
}) => {
  const navigate = useNavigate();
  const [isContractCalled, setIsContractCalled] = React.useState(false);
  const campaignIndex = campaigns.findIndex(
    ({ name }) => name === selectedCampaign
  );
  const campaign = campaigns[campaignIndex];

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: HabitAppJson.abi,
    functionName: 'createUserCampaign',
    args: [campaignIndex, habits],
    overrides: { value: campaign?.tokenLockInRequired },
  });

  const { write, isSuccess, data } = useContractWrite(config);

  React.useEffect(() => {
    if (!isContractCalled && write) {
      write();
      setIsContractCalled(true);
    }
  }, [write, isContractCalled]);

  React.useEffect(() => {
    if (isSuccess && data) {
      (async () => {
        await data.wait();
        navigate(`/my-campaign?waitFor=${data.hash}`);
      })();
    }
  }, [isSuccess, data, navigate]);

  return (
    <div className="text-center">
      <h2 className="text-2xl">
        Submit the transaction in the popup to submit tokens and start
      </h2>
      <div
        className="animate-spin inline-block w-8 h-8 border-4 border-r-transparent rounded-full"
        role="status"
      >
        <span className="visually-hidden hidden">Loading...</span>
      </div>
    </div>
  );
};

export default DepositTokensAndStart;
