// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedMarketplace {
    struct Item {
        uint id;
        address payable seller;
        string name;
        string description;
        uint price;
        bool sold;
    }

    uint public itemCount = 0;
    mapping(uint => Item) public items;
    mapping(address => uint) public pendingWithdrawals;

    event ItemListed(uint id, address seller, string name, uint price);
    event ItemSold(uint id, address buyer, uint price);
    event ItemUpdated(uint id, string name, uint price);
    event ItemRemoved(uint id);
    event RefundIssued(uint id, address buyer, uint price);

    // List an item on the marketplace
    function listItem(string memory _name, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than 0");
        itemCount++;
        items[itemCount] = Item(itemCount, payable(msg.sender), _name, _description, _price, false);
        emit ItemListed(itemCount, msg.sender, _name, _price);
    }

    // Purchase an item
    function purchaseItem(uint _id) public payable {
        Item storage item = items[_id];
        require(_id > 0 && _id <= itemCount, "Item does not exist");
        require(msg.value >= item.price, "Not enough ether sent");
        require(!item.sold, "Item already sold");
        require(item.seller != msg.sender, "Seller cannot buy their own item");

        pendingWithdrawals[item.seller] += msg.value;
        item.sold = true;
        emit ItemSold(_id, msg.sender, item.price);
    }

    // Withdraw funds
    function withdrawFunds() public {
        uint amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        // Reset the pending withdrawal to 0 before transferring to prevent re-entrancy attacks
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // Update an item listing
    function updateItem(uint _id, string memory _name, uint _price) public {
        Item storage item = items[_id];
        require(item.seller == msg.sender, "Only the seller can update the listing");
        require(!item.sold, "Cannot update a sold item");

        item.name = _name;
        item.price = _price;
        emit ItemUpdated(_id, _name, _price);
    }

    // Remove an item listing
    function removeItem(uint _id) public {
        Item storage item = items[_id];
        require(item.seller == msg.sender, "Only the seller can remove the listing");
        require(!item.sold, "Cannot remove a sold item");

        delete items[_id];
        emit ItemRemoved(_id);
    }

    // Issue a refund to the buyer (can be called by the seller in case of dispute or cancellation)
    function issueRefund(uint _id, address payable _buyer) public {
        Item storage item = items[_id];
        require(item.seller == msg.sender, "Only the seller can issue a refund");
        require(item.sold, "Item has not been sold");
        require(pendingWithdrawals[msg.sender] >= item.price, "Seller does not have enough funds to refund");

        item.sold = false; // Mark the item as not sold anymore
        pendingWithdrawals[msg.sender] -= item.price;
        _buyer.transfer(item.price);
        emit RefundIssued(_id, _buyer, item.price);
    }
    
    function getItemCount() public view returns (uint) {
        return itemCount;
    }
}