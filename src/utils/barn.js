import { Contract, Interface } from "ethers";
import { _getProvider } from "./ethereum";
import BARN_ABI from "./abi/barn.abi";

export const stake = async (account, tokenIds) => {
  const provider = _getProvider();
  if (!provider) throw new Error("Unable to connect to wallet");
  const signer = provider.getSigner();
  const contract = new Contract(process.env.REACT_APP_BARN, BARN_ABI, signer);
  const gasEstimate = await contract.addManyToBarnAndPack.estimateGas(
    account,
    tokenIds
  );

  //   const gasEstimate = BigInt(10000000);

  return await contract.addManyToBarnAndPack(account, tokenIds, {
    gasLimit: (gasEstimate * BigInt(12)) / BigInt(10),
  });
};

export const claim = async (tokenIds, unstake) => {
  const provider = _getProvider();
  if (!provider) throw new Error("Unable to connect to wallet");
  const signer = provider.getSigner();
  const contract = new Contract(process.env.REACT_APP_BARN, BARN_ABI, signer);
  const gasEstimate = await contract.claimManyFromBarnAndPack.estimateGas(
    tokenIds,
    unstake
  );

  //   const gasEstimate = BigInt(10000000);

  return await contract.claimManyFromBarnAndPack(tokenIds, unstake, {
    gasLimit: (gasEstimate * BigInt(12)) / BigInt(10),
  });
};

export const parseClaims = (receipt) => {
  const barn = new Interface(BARN_ABI);
  const claims = [];
  receipt.logs.forEach((log) => {
    try {
      const args = barn.parseLog(log).args;
      if (args.tokenId) claims.push(args);
    } catch (error) {}
  });
  return claims;
};
