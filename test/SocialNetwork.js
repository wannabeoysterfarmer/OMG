


const SocialNetwork = artifacts.require('./SocialNetwork.sol')

// 'truffle test' to run tests. 

// Require Chai assertion library. 
require('chai')
  .use(require('chai-as-promised'))
  .should()

// Contract for testing.
contract('SocialNetwork', ([deployer, author, tipper]) => {
  
  // Initialize local variable.
  let socialNetwork

  before(async () => {
    socialNetwork = await SocialNetwork.deployed()
  })

  // Describe for tests testing for some action.
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await socialNetwork.address
      assert.notEqual(address, 0x0) // blank address
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await socialNetwork.name()
      assert.equal(name, 'Social Network')
    })
  })

  describe('posts', async () => {
    
    // Initialize a local variable. 
    let result, postCount

    before(async () => {
      result = await socialNetwork.createPost("First post", { from: author })
      postCount = await socialNetwork.postCount()
    })

    // Creates post test. Test for creating post.
    it('creates posts', async () => {

      // Checks success cases:
      assert.equal(postCount, 1)
      // Checking content for event (event variable, expected result, output)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.content, "First post", 'content is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct.')
      assert.equal(event.author, author, 'author is correct.')

      // Failure cases:
      await socialNetwork.createPost("", { from: author}).should.be.rejected;
      
    })

    it('lists posts', async () => {
      const post = await socialNetwork.posts(postCount)
      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(post.content, "First post", 'content is correct')
      assert.equal(post.tipAmount, '0', 'tip amount is correct.')
      assert.equal(post.author, author, 'author is correct.')

    })

    it('tips posts', async () => {
      
      // Track the author balance before purchase:
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
      
      result = await socialNetwork.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether')})
      
      // Checks success cases:
      assert.equal(postCount, 1)
      // Checking content for event (event variable, expected result, output)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.content, "First post", 'content is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct.')
      assert.equal(event.author, author, 'author is correct.')

      // Check that the author received funds:
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipAmount
      tipAmount = web3.utils.toWei('1', 'Ether')
      tipAmount = new web3.utils.BN(tipAmount)

      const expectedBalance = oldAuthorBalance.add(tipAmount)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // Fail - tries to tip a post that does not exist. 
      await socialNetwork.tipPost(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
      

    })
  })
  
}

)
