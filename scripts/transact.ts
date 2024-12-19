import { ethers } from 'hardhat'
import * as dotenv from 'dotenv'

dotenv.config()

async function main (): Promise<void> {
  const simpleAccountAddress = process.env.SIMPLE_ACCOUNT_ADDRESS!
  const recipient = '0xRecipientAddress' // Replace with actual address
  const amount = ethers.utils.parseEther('0.1')

  const SimpleAccount = await ethers.getContractAt('SimpleAccount', simpleAccountAddress)

  const tx = await SimpleAccount.execute(recipient, amount, '0x')
  console.log('Transaction hash:', tx.hash)
  await tx.wait()
  console.log('Transaction confirmed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
