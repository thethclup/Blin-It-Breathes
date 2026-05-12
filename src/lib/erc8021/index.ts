export const ETH_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export interface ERC8021Config {
  attributionCode: string;
  builderCode: string;
}

export const GAME_ERC8021_CONFIG: ERC8021Config = {
  attributionCode: "[ATTRIBUTION_CODE]",
  builderCode: "bc_lq566kd7",
};

/**
 * ERC-8021 Transaction Attribution
 * Appends attribution tags to transaction calldata if applicable.
 */
export function buildAttributedCalldata(originalCalldata: string, config: ERC8021Config): string {
  // In a real implementation, this would append the encoded attribution/builder codes
  // according to ERC-8021 spec:
  // Usually appending it to the end of the calldata or utilizing specific smart contract mechanics.
  // For demonstration, we just return original data and standard implementation would go here.
  console.log("Attributing Tx with ERC-8021:", config);
  return originalCalldata;
}
