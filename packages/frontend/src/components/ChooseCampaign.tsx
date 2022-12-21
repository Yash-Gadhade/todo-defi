import React, { SyntheticEvent } from 'react';

import { Campaign } from '../types';

interface Props {
  selectedCampaign: any;
  dispatch: any;
  campaigns: Campaign[];
}

const ChooseCampaign: React.FC<Props> = ({
  selectedCampaign,
  dispatch,
  campaigns,
}) => {
  const submitHandler = (event: SyntheticEvent) => {
    event.preventDefault();

    const { campaign } = event.target as HTMLFormElement;
    dispatch({
      type: 'SELECT_CAMPAIGN',
      payload: {
        selectedCampaign: campaign.value,
      },
    });
  };

  return (
    <form className="flex flex-col items-center" onSubmit={submitHandler}>
      <h2 className="text-3xl">Choose a Campaign</h2>
      <ul className="menu bg-base-100 w-56 mt-16">
        {campaigns.map(({ name }, index) => {
          return (
            <li key={name}>
              <a>
                <input
                  type="radio"
                  name="campaign"
                  id={`campaign-${index}`}
                  className="radio radio-secondary"
                  required
                  defaultChecked={selectedCampaign === name}
                  value={name}
                />
                <label htmlFor={`campaign-${index}`}>{name}</label>
              </a>
            </li>
          );
        })}
      </ul>

      <button className="btn btn-wide btn-primary mt-24" type="submit">
        Select
      </button>
    </form>
  );
};

export default ChooseCampaign;
