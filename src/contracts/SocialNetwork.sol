pragma solidity ^0.5.0;

contract SocialNetwork {

    // When 'public', value returned upon calling constructor.
    string public name;
    // Key-value store to write info onto blockchain.
    // Public posts. 
    mapping(uint => Post) public posts;
    // Count
    uint public postCount = 0;

    // Struct for post.
    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
        // FUTURE: show how much tipped. 
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

     event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    // 'truffle compile' will create the abi file (.json)
    // 'truffle migrate' will run after contract can be deployed,
    // deploying contract onto the blockchain. 
    // 'truffle console' to javascript run time environment. 
    // Write .js in console. 
    // 'contract.address' will get the address of the contract.
    constructor() public {
        name = "Social Network";
    }

    function createPost(string memory _content) public {
        
        // Require valid content - check that there is content.
        // FUTURE: require no integers.
        require(bytes(_content).length > 0);
        

        // Increment postCount for posts. 
        // msg.sender is caller of function.
        postCount ++;
        posts[postCount] = Post(postCount, _content, 0, msg.sender);

        // Event triggered
        emit PostCreated(postCount, _content, 0, msg.sender);

    }

    // Tip post, ID of post to tip.
    // 'Payable' function allows transfer of Ether
    function tipPost(uint _id) public payable {

        // Require
        require(_id > 0 && _id <= postCount);

        // Fetch the post and create a copy:
        // ID of post to tip from posts. 
        Post memory _post = posts[_id];

        // Fetch the author.
        address payable _author = _post.author;

        // Pay author by sending Ether
        address(_author).transfer(msg.value);

        // Increment the tip amount.
        _post.tipAmount = _post.tipAmount + msg.value;

        // Update post
        posts[_id] = _post;

        // Event.
        emit PostTipped(postCount, _post.content, _post.tipAmount, _author);


    }




}