import React, { useState, useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useReadContracts,
} from "wagmi";
import VotingArtifact from "../artifacts/Voting.json";
import { isAddress, toNumber } from "ethers";
import { Abi } from "viem";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";

const contractAddress = "0x98E97B7852e5F439f9119756B9803b0EA480b53F";
const contractABI = VotingArtifact.abi as Abi;

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

const VotingComponent: React.FC = () => {
  const { address } = useAccount();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [voterAddress, setVoterAddress] = useState<string>("");
  const [isValidVoterAddress, setIsValidVoterAddress] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  console.log("candidates", candidates);

  const {
    data: hash,
    writeContract,
    error: writeContractError,
  } = useWriteContract();
  console.log("writeContractError", writeContractError);
  console.log("hash", hash);

  const { data: adminAddress, error: adminError } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "admin",
  });
  if (adminError) {
    console.log("adminError", adminError);
  }

  const { data: totalCandidatesData, error: totalCandidatesError } =
    useReadContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "getTotalCandidates",
    });
  if (totalCandidatesError) {
    console.log("totalCandidatesError", totalCandidatesError);
  }

  const totalCandidates = totalCandidatesData ? Number(totalCandidatesData) : 0;

  const contractConfig = {
    address: contractAddress,
    abi: contractABI,
  } as const;

  const contractReads =
    totalCandidates > 0
      ? Array.from({ length: totalCandidates }, (_, i) => ({
          ...contractConfig,
          functionName: "getCandidate",
          args: [i],
        }))
      : [];

  const { data: candidatesData } = useReadContracts({
    contracts: contractReads,
  });
  console.log("candidatesData", candidatesData);

  useEffect(() => {
    if (adminAddress && address) {
      setIsAdmin(adminAddress === address);
    }
  }, [adminAddress, address]);

  useEffect(() => {
    if (candidatesData) {
      const candidateList: Candidate[] = candidatesData.map(
        (candidateData, index) => ({
          id: index,
          name: (candidateData as any).result.name,
          voteCount: (candidateData as any).result.voteCount,
        })
      );
      setCandidates(candidateList);
    }
  }, [candidatesData]);

  const handleRegisterVoter = () => {
    if (isAddress(voterAddress)) {
      setIsValidVoterAddress(true);
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "registerVoter",
        args: [voterAddress],
      });
    } else {
      setIsValidVoterAddress(false);
    }
  };

  const handleVote = (candidateId: number) => {
    writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "vote",
      args: [candidateId],
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      {address ? (
        <>
          <Typography variant="h4" component="h1" gutterBottom>
            Decentralized Voting System
          </Typography>
          {isAdmin && (
            <div>
              <Typography variant="h5" component="h2">
                Register Voter
              </Typography>
              <TextField
                label="Voter Address"
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                error={!isValidVoterAddress}
                helperText={
                  !isValidVoterAddress ? "Invalid Ethereum address." : ""
                }
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleRegisterVoter}
              >
                Register
              </Button>
            </div>
          )}
          <Typography mt={5} variant="h5" component="h2" gutterBottom>
            Candidates
          </Typography>
          <List>
            {candidates.map((candidate) => (
              <ListItem key={candidate.id}>
                <ListItemText
                  primary={`${candidate.name} - Votes: ${toNumber(candidate.voteCount)}`}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleVote(candidate.id)}
                >
                  Vote
                </Button>
              </ListItem>
            ))}
          </List>
          {writeContractError && (
            <Alert severity="error">{writeContractError.message}</Alert>
          )}
        </>
      ) : (
        <>
          <Alert severity="warning">Please connect wallet to vote.</Alert>
        </>
      )}
    </Container>
  );
};

export default VotingComponent;
