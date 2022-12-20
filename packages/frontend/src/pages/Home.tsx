import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC<{}> = () => {
  return (
    <div className="hero min-page-height bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Build a Habit</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <Link to="/join">
            <button className="btn btn-secondary">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

/**
 * pragma solidity ^0.6.0;

contract DailyTransactionLimit {
    // store the current date and the address of the last transaction
    uint256 public currentDate;
    address public lastTransactionAddress;

    // constructor to initialize the current date
    constructor() public {
        currentDate = now / 86400; // divide by number of seconds in a day to get current date
    }

    // function to make a transaction
    function makeTransaction() public {
        // check if the last transaction was made by the same address on the same day
        require(lastTransactionAddress != msg.sender || currentDate != now / 86400, "You can only make one transaction per day");

        // update the current date and last transaction address
        currentDate = now / 86400;
        lastTransactionAddress = msg.sender;
    }
}
 */
