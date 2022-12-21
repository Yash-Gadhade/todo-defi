import React from 'react';
import { ethers } from 'ethers';

import { Campaign } from '../types';

interface Props {
  habits: Array<string>;
  selectedCampaign: string;
  dispatch: any;
  campaigns: Campaign[];
}

const Review: React.FC<Props> = ({
  habits,
  selectedCampaign,
  dispatch,
  campaigns,
}) => {
  const campaign = campaigns.find(({ name }) => name === selectedCampaign);
  if (!campaign) {
    return null;
  }
  return (
    <div className="flex flex-col items-center mt-16">
      <h2 className="text-2xl">You are joining the {selectedCampaign}</h2>
      <p className="mt-8 mb-4">You intend to form the following habits:</p>
      <div className="flex flex-col w-full text-left text-lg max-w-lg space-y-2">
        {habits.map((habit) => (
          <div className="bg-base-100 px-2 py-4 hover:bg-black rounded">
            {habit}
          </div>
        ))}
      </div>
      <p className="mt-16 mb-4 text-lg">
        On the next page you will be asked to deposit{' '}
        {ethers.utils.formatEther(campaign?.tokenLockInRequired)} ETH.
      </p>
      <button
        className="btn btn-wide btn-lg btn-primary"
        onClick={() =>
          dispatch({
            type: 'START_CAMPAIGN',
          })
        }
      >
        Start
      </button>
    </div>
  );
};

export default Review;
