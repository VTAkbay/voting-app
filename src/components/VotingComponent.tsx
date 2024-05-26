import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useReadContracts,
  BaseError,
  useBlockNumber,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toNumber } from "ethers";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  Box,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import LoadingButton from "@mui/lab/LoadingButton";
import { green, red } from "@mui/material/colors";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { contractABI, contractAddress, extractReason } from "../utils";
import RegisterModal from "./RegisterModal";

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

const VotingComponent: React.FC = () => {
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const {
    data: hash,
    writeContract,
    error: writeContractError,
    isPending,
  } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: adminAddress } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "admin",
  });

  const { data: totalCandidatesData } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getTotalCandidates",
  });

  const totalCandidates = useMemo(
    () => (totalCandidatesData ? Number(totalCandidatesData) : 0),
    [totalCandidatesData]
  );

  const contractReads = useMemo(() => {
    return totalCandidates > 0
      ? Array.from({ length: totalCandidates }, (_, i) => ({
          address: contractAddress,
          abi: contractABI,
          functionName: "getCandidate",
          args: [i],
        }))
      : [];
  }, [totalCandidates, contractAddress, contractABI]);

  const {
    data: candidatesData,
    isLoading: isLoadingCandidates,
    refetch: refetchCandidatesData,
  } = useReadContracts({
    contracts: contractReads,
  });

  const {
    data: voterData,
    isLoading: isLoadingVoterData,
    refetch: refetchVoterData,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "voters",
    args: [address],
  });

  const handleVote = useCallback(
    (candidateId: number) => {
      writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "vote",
        args: [candidateId],
      });
    },
    [contractAddress, contractABI, writeContract]
  );

  useEffect(() => {
    if (Array.isArray(voterData) && voterData.length > 0) {
      setIsRegistered(voterData[0] as boolean);
      setIsVoted(voterData[1] as boolean);
    }
  }, [voterData]);

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

  useEffect(() => {
    setIsLoading(isLoadingVoterData || isLoadingCandidates);
  }, [isLoadingVoterData, isLoadingCandidates]);

  useEffect(() => {
    refetchCandidatesData();
    refetchVoterData();
  }, [blockNumber]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Decentralized Voting System
      </Typography>

      {address ? (
        isLoading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {isAdmin && (
              <Box mt={3}>
                <Alert
                  variant="outlined"
                  severity="info"
                  action={
                    <Button onClick={handleOpen} color="inherit" size="small">
                      Register
                    </Button>
                  }
                >
                  You are admin and can register new voters by clicking the
                  Register button.
                </Alert>
              </Box>
            )}

            <Typography mt={3} variant="h5" component="h2" gutterBottom>
              Candidates
            </Typography>

            {!isVoted ? (
              <Alert severity={isRegistered ? "success" : "warning"}>
                {isRegistered
                  ? "You are registered for voting. Please vote."
                  : "You are not registered for voting. Ask the admin to register you if you are not."}
              </Alert>
            ) : (
              <Alert severity="success">You have voted.</Alert>
            )}

            <List>
              {candidates.map((candidate) => (
                <ListItem
                  key={candidate.id}
                  alignItems="flex-start"
                  sx={{ mb: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor:
                          isRegistered && !isVoted ? green[500] : red[500],
                      }}
                    >
                      {isRegistered && !isVoted ? (
                        <HowToVoteIcon />
                      ) : (
                        <CheckCircleIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div">
                        {candidate.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        Votes: {toNumber(candidate.voteCount)}
                      </Typography>
                    }
                  />
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleVote(candidate.id)}
                    disabled={!isRegistered || isVoted}
                    loading={isPending || isConfirming}
                  >
                    Vote
                  </LoadingButton>
                </ListItem>
              ))}
            </List>

            {writeContractError && (
              <Alert severity="error">
                {extractReason((writeContractError as BaseError).shortMessage)}
              </Alert>
            )}
          </Box>
        )
      ) : (
        <>
          <Alert severity="warning">Please connect wallet to vote.</Alert>
        </>
      )}

      <RegisterModal open={open} handleClose={handleClose} />
    </Container>
  );
};

export default VotingComponent;
