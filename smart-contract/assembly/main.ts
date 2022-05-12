import { PersistentMap, u128 } from "near-sdk-as";

class Proposal {
  name: string;
  imageUrl: string;
  verificationUrl: string;
  cap: u128;
}

const proposals = new PersistentMap<string, Proposal>("p");
const proposalStatuses = new PersistentMap<string, string>("s");

// TODO: Create proposal
export function propose(proposal: Proposal): string {
  proposals.set("17", proposal);
  return "17";
}

// TODO: Vote; return status
export function vote(proposalId: string, approved: boolean) {
  proposalStatuses.set(proposalId, approved ? "approved" : "denied");
}

// TODO: Create sub-DAO
export function execute(proposalId: string) {
  const status = proposalStatuses.get(proposalId);
  assert(status === "approved");
}
