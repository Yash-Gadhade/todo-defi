// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HabitApp is Ownable {
    struct Campaign {
        bytes32 name;
        uint256 duration;
        uint256 tokenLockInRequired;
    }

    struct UserCampaign {
        Campaign campaign;
        uint256 noOfDaysLeft;
        string[] habits;
        uint256 fundsLocked;
        uint256 fundsClaimable;
        uint256 lastMarkedDoneAt;
    }

    uint256 private _fundsDeducted;

    Campaign[] public campaigns;

    mapping(address => UserCampaign) public addressToCampaign;

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
    ) external payable {
        Campaign memory campaignSelected = campaigns[campaignIndex];
        // ensure user has sent enough funds
        require(
            msg.value == campaignSelected.tokenLockInRequired,
            "Incorrect amount of tokens sent"
        );

        // store campaign in mapping
        addressToCampaign[msg.sender] = UserCampaign({
            campaign: campaigns[campaignIndex],
            noOfDaysLeft: campaigns[campaignIndex].duration,
            habits: habits,
            fundsLocked: campaigns[campaignIndex].tokenLockInRequired,
            fundsClaimable: 0,
            lastMarkedDoneAt: block.timestamp / 86400
        });
    }

    function withdrawClaimableFunds() external {
        require(
            addressToCampaign[msg.sender].noOfDaysLeft == 0,
            "You cannot withdraw right now"
        );

        uint256 fundsAvailable = addressToCampaign[msg.sender].fundsClaimable;
        addressToCampaign[msg.sender].fundsClaimable = 0;

        (bool sent, ) = msg.sender.call{value: fundsAvailable}("");
        require(sent, "Failed to send Ether");
    }

    function markHabitsDoneToday(uint256 noOfHabitsDoneToday) external {
        // check if the last transaction is being made another day
        require(
            addressToCampaign[msg.sender].lastMarkedDoneAt !=
                block.timestamp / 86400,
            "You can only mark done once per day"
        );
        require(
            addressToCampaign[msg.sender].noOfDaysLeft > 0,
            "This campaign has ended"
        );
        require(
            noOfHabitsDoneToday <= addressToCampaign[msg.sender].habits.length,
            "Invalid noOfHabitsDoneToday"
        );

        if (addressToCampaign[msg.sender].noOfDaysLeft == 1) {
            addressToCampaign[msg.sender].fundsClaimable += addressToCampaign[
                msg.sender
            ].fundsLocked;
        } else {
            uint256 fundsUnlocked = ((addressToCampaign[msg.sender]
                .campaign
                .tokenLockInRequired /
                addressToCampaign[msg.sender].campaign.duration) /
                addressToCampaign[msg.sender].habits.length) *
                noOfHabitsDoneToday;

            _fundsDeducted +=
                ((addressToCampaign[msg.sender].campaign.tokenLockInRequired /
                    addressToCampaign[msg.sender].campaign.duration) /
                    addressToCampaign[msg.sender].habits.length) *
                (addressToCampaign[msg.sender].habits.length -
                    noOfHabitsDoneToday);

            addressToCampaign[msg.sender].fundsLocked -= fundsUnlocked;
            addressToCampaign[msg.sender].fundsClaimable += fundsUnlocked;
        }

        uint256 currentDate = block.timestamp / 86400;

        if (
            addressToCampaign[msg.sender].noOfDaysLeft >=
            (currentDate - addressToCampaign[msg.sender].lastMarkedDoneAt)
        ) {
            addressToCampaign[msg.sender].noOfDaysLeft =
                addressToCampaign[msg.sender].noOfDaysLeft -
                (currentDate - addressToCampaign[msg.sender].lastMarkedDoneAt);
        } else {
            addressToCampaign[msg.sender].noOfDaysLeft = 0;
        }

        // update the current date and last transaction address
        addressToCampaign[msg.sender].lastMarkedDoneAt =
            block.timestamp /
            86400;
    }

    function withdrawDeductions() external onlyOwner {
        (bool sent, ) = owner().call{value: _fundsDeducted}("");
        require(sent, "Failed to send Ether");
        _fundsDeducted = 0;
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function getUserCampaign(
        address userAddress
    ) external view returns (UserCampaign memory) {
        return addressToCampaign[userAddress];
    }
}
