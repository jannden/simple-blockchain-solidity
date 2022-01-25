pragma solidity ^0.4.17;

contract Inbox {
    string public message;

    function Inbox(string initialMessage) public {
        message = initialMessage;
    }

    function setMessage(string newMessage) public {
        message = newMessage;
    }
}

/*
pragma solidity ^0.8.7;

contract Inbox {
    string public message;

    constructor(string memory initialMessage){
        message = initialMessage;
    }

    function setMessage(string memory newMessage) public{
        message = newMessage;
    }

    function getMessage() public view returns(string memory){
        return message;
    }
}
*/
