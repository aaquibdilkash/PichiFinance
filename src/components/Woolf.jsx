import { decodeTokenURI } from "../utils/uri";
import { formatUnits, formatEthers, parseUnits } from "ethers";
import React from "react";

const Woolf = ({ woolf, onClick, selected, stats }) => {
  //const MAXIMUM_GLOBAL_WOOL = BigInt(24000000).mul(BigInt(10).pow(BigInt(18)))
  const MAXIMUM_GLOBAL_WOOL = BigInt(2400000000) * BigInt(10) ** BigInt(9);

  const unclaimedWool = () => {
    if (!woolf.value) return null;
    if (woolf.isSheep) {
      const woolEarned = stats ? stats.woolEarned : 0;
      let duration = Math.floor(Date.now() / 1000) - woolf.value;
      if (BigInt(woolEarned).gte(MAXIMUM_GLOBAL_WOOL))
        duration = Math.max(stats.lastClaimTimestamp - woolf.value, 0);
      const earnings =
        (parseUnits("10000", "gwei") * BigInt(duration)) / BigInt(24 * 60 * 60);
      return formatUnits(earnings);
    } else {
      const woolPerAlpha = stats ? stats.woolPerAlpha : woolf.value;
      const earnings =
        (BigInt(woolPerAlpha) - BigInt(woolf.value)) * BigInt(woolf.alpha);
      return formatUnits(earnings);
    }
  };

  const earnings = unclaimedWool();

  return (
    <React.Fragment>
      <div
        className="mx-3 relative cursor-pointer"
        style={{
          width: "64px",
          height: "64px",
          border: selected ? "solid 4px #B11D18" : "",
          padding: selected ? "2px" : "10px",
        }}
        onClick={onClick}
      >
        <img
          src={decodeTokenURI(woolf.tokenURI).image}
          alt="woolf"
          style={{ width: "100%", height: "100%" }}
        />
        {earnings && (
          <div
            className="absolute font-console text-red text-center flex items-center justify-center"
            style={{
              width: "100%",
              height: "14px",
              background: "white",
              bottom: 0,
              right: 0,
              fontSize: "10px",
            }}
          >
            {earnings}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Woolf;
