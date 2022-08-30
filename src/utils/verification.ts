// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import CryptoJS from "crypto-js";
import MerkleTools from "merkle-tools";

import { Audit } from "../types.js";
import { PublishedRoots } from "./arweave.js";

// @ts-ignore
const merkleTools = new MerkleTools();

const decodeHash = (value: string): CryptoJS.lib.WordArray => {
  return CryptoJS.enc.Hex.parse(value);
};

const hashPair = (hash1: CryptoJS.lib.WordArray, hash2: CryptoJS.lib.WordArray): string => {
  var sha256 = CryptoJS.algo.SHA256.create();

  sha256.update(hash1);
  sha256.update(hash2);

  return sha256.finalize().toString();
};

type Hash = string;

interface ProofItem {
  side: string;
  nodeHash: CryptoJS.lib.WordArray;
}

interface RightProof {
  right: string;
}

interface LeftProof {
  left: string;
}

const decodeProof = (data: string): ProofItem[] => {
  const proof: ProofItem[] = [];
  data.split(",").forEach((item) => {
    const parts = item.split(":");
    proof.push({
      side: parts[0] == "l" ? "left" : "right",
      nodeHash: decodeHash(parts[1]),
    });
  });
  return proof;
};

const constructProof = (data: string): (LeftProof | RightProof)[] => {
  // @ts-ignore
  const proofs: (LeftProof | RightProof)[] = data.split(",").map((item) => {
    const parts = item.split(":");
    const side = parts[0] == "l" ? "left" : "right";
    return {
      [side]: parts[1],
    };
  });

  return proofs;
};

interface RootProofItem {
  nodeHash: CryptoJS.lib.WordArray;
  proof: ProofItem[];
}

const decodeRootProof = (data: string[]): RootProofItem[] => {
  const rootProof: RootProofItem[] = [];
  data.forEach((item) => {
    const [nodeHash, ...proofData] = item.split(",");

    rootProof.push({
      nodeHash: decodeHash(nodeHash.split(":")[1]),
      proof: decodeProof(proofData.join(",")),
    });
  });
  return rootProof;
};

const verifyLogProof = (
  initialNodeHash: CryptoJS.lib.WordArray,
  rootHash: CryptoJS.lib.WordArray,
  proofs: ProofItem[]
): boolean => {
  let nodeHash = initialNodeHash;
  for (let idx = 0; idx < proofs.length; idx++) {
    const proofHash = proofs[idx].nodeHash;

    nodeHash = decodeHash(
      proofs[idx].side === "left" ? hashPair(proofHash, nodeHash) : hashPair(nodeHash, proofHash)
    );
  }

  return nodeHash.toString() === rootHash.toString();
};

export const verifyMembershipProof = ({
  record,
  root,
}: {
  record: Audit.AuditRecord;
  root: Audit.Root;
}): boolean => {
  if (!record.membership_proof) return false;
  if (!record.hash) return false;

  const proofs = constructProof(record.membership_proof);
  return merkleTools.validateProof(
    // @ts-ignore
    proofs,
    record.hash,
    root.root_hash
  );
};

export const verifyConsistencyProof_ = ({
  newRoot,
  prevRoot,
}: {
  record: Audit.AuditRecord;
  newRoot: Audit.Root;
  prevRoot: Audit.Root;
}): boolean => {
  if (!newRoot || !prevRoot) {
    return false;
  }

  const prevRootHash = decodeHash(prevRoot.root_hash);
  const newRootHash = decodeHash(newRoot.root_hash);
  const consistencyProof = decodeRootProof(newRoot.consistency_proof);

  let rootHash = consistencyProof[0].nodeHash;
  consistencyProof.forEach((rootProof, idx) => {
    if (idx === 0) return;
    rootHash = decodeHash(hashPair(rootProof.nodeHash, rootHash));
  });

  if (rootHash.toString() !== prevRootHash.toString()) {
    return false;
  }

  for (var idx = 0; idx < consistencyProof.length; idx++) {
    const rootProof = consistencyProof[idx];

    if (!verifyLogProof(rootProof.nodeHash, newRootHash, rootProof.proof)) {
      return false;
    }
  }

  return true;
};

export const verifyConsistencyProof = ({
  publishedRoots,
  record,
}: {
  publishedRoots: PublishedRoots;
  record: Audit.AuditRecord;
}): boolean => {
  const leafIndex = Number(record.leaf_index);
  const newRoot = publishedRoots[leafIndex + 1];
  const prevRoot = publishedRoots[leafIndex];

  return verifyConsistencyProof_({ newRoot, prevRoot, record });
};
