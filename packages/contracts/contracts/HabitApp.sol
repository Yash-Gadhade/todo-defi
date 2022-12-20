// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Campaign as CampaignContract} from "./Campaign.sol";

contract HabitApp is ReentrancyGuard {
    struct Campaign {
        bytes32 name;
        uint256 duration;
        uint256 tokenLockInRequired;
    }

    Campaign[] public campaigns;

    mapping(address => address[]) public addressToCampaignAddress;

    constructor(Campaign[] memory _campaigns) {
        for (uint256 i = 0; i < _campaigns.length; i++) {
            campaigns.push(_campaigns[i]);
        }
    }

    function createCampaign(Campaign memory _campaign) external {
        campaigns.push(_campaign);
    }

    function removeCampaign(uint256 index) external {
        campaigns[index] = campaigns[campaigns.length - 1];
        campaigns.pop();
    }

    function createUserCampaign(
        uint256 campaignIndex,
        string[] memory habits
    ) external payable nonReentrant returns (address) {
        Campaign memory campaignSelected = campaigns[campaignIndex];
        // ensure user has sent enough funds
        require(
            msg.value == campaignSelected.tokenLockInRequired,
            "Incorrect amount of tokens sent"
        );
        // create campaign smart contract
        CampaignContract campaignContract = new CampaignContract(
            habits,
            campaignSelected.name,
            campaignSelected.duration,
            msg.sender
        );
        // store campaign smart contract in mapping
        addressToCampaignAddress[msg.sender].push(address(campaignContract));
        // send funds to campaign smart contract
        (bool sent, ) = address(campaignContract).call{value: msg.value}("");
        require(sent, "Failed to send tokens");

        return address(campaignContract);
    }
}
