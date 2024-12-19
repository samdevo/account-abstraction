import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'
import { createAccount, deployEntryPoint, createAccountOwner, fund, checkForGeth } from '../test/testutils'
import { EntryPoint, EntryPoint__factory, SimpleAccount, SimpleAccountFactory, SimpleAccountFactory__factory, SimpleAccount__factory } from '../typechain'
import { create } from 'domain'
import { parseEther } from 'ethers/lib/utils'
import { AASigner, localUserOpSender } from '../src/AASigner'

dotenv.config()

async function main (): Promise<void> {

  const provider = ethers.provider
  const ethersSigner = provider.getSigner()

  const signerBalance = await provider.getBalance(ethersSigner.getAddress())
  console.log(`Signer balance: ${signerBalance.toString()}. ETH: ${ethers.utils.formatEther(signerBalance)}`)

  // Deploy EntryPoint if necessary
  let entryPoint: EntryPoint
  if (process.env.ENTRY_POINT_ADDRESS == null) {
    console.log(`ENTRY_POINT_ADDRESS is not set, deploying EntryPoint`)
    entryPoint = await deployEntryPoint()
    console.log('EntryPoint deployed to:', entryPoint.address)
  } else {
    entryPoint = EntryPoint__factory.connect(process.env.ENTRY_POINT_ADDRESS!, ethersSigner)
    console.log(`Using existing EntryPoint at ${entryPoint.address}`)
  }

  // Deploy SimpleAccountFactory if necessary
  let simpleAccountFactory: SimpleAccountFactory
  if (process.env.SIMPLE_ACCOUNT_FACTORY_ADDRESS == null) {
    console.log(`SIMPLE_ACCOUNT_ADDRESS is not set, deploying SimpleAccount`)
    simpleAccountFactory = await new SimpleAccountFactory__factory(ethersSigner).deploy(entryPoint.address)
    console.log('SimpleAccount deployed to:', simpleAccountFactory.address)
  } else {
    simpleAccountFactory = SimpleAccountFactory__factory.connect(process.env.SIMPLE_ACCOUNT_FACTORY_ADDRESS!, ethersSigner)
    console.log(`Using existing SimpleAccount at ${simpleAccountFactory.address}`)
  }

  // create our EOA owner
  const eoaOwner = createAccountOwner()

  // // fund our EOA owner
  // await ethers.provider.getSigner().sendTransaction({ to: await eoaOwner.getAddress(), value: parseEther("0.01") })
  
  // create account, owned by EOA signer, using the factory
  const { implementation, proxy } = await createAccount(ethersSigner, await eoaOwner.getAddress(), entryPoint.address, simpleAccountFactory)

  // local user op sender because our provider does not support eth_sendUserOp
  const sendUserOpFn = localUserOpSender(entryPoint.address, ethersSigner)

  const aasigner = new AASigner(ethersSigner, entryPoint.address, )
  
  const factory = await new SimpleAccountFactory__factory(ethersSigner).deploy(entryPoint.address)

  console.log('SimpleAccountFactory deployed to:', factory.address)
  const chainId = (await eoaOwner.provider.getNetwork()).chainId
  await fund(proxy, "0.001")
  await checkForGeth()


  
  
  const factory = SimpleAccountFactory__factory.connect(process.env.SIMPLE_ACCOUNT_FACTORY_ADDRESS!, eoaSigner)
  console.log('Deploying contracts with the account:', await eoaSigner.getAddress())

  // create a test wallet with ethers
  const eoaSigner = ethers.Wallet.createRandom().connect(ethers.provider)

  // create account
  {} = await createAccount(signer, eoaSigner.getAddress(), )
  const ownerAddress = await eoaSigner.getAddress()
  const salt = 0 // Choose a unique salt if necessary

  // Create SimpleAccount via Factory
  const tx = await factory.createAccount(ownerAddress, salt)
  const receipt = await tx.wait()


  if (simpleAccountAddress !== '') {
    console.log('SimpleAccount deployed to:', simpleAccountAddress)
  } else {
    console.error('Failed to retrieve SimpleAccount address from events')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
