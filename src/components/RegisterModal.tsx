import React, { useState } from "react";
import { Box, Modal, Typography, TextField, Alert } from "@mui/material";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from "wagmi";
import { isAddress } from "viem";
import { contractABI, contractAddress, extractReason } from "../utils";
import { LoadingButton } from "@mui/lab";

interface RegisterModalProps {
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const RegisterModal: React.FC<RegisterModalProps> = ({ open, handleClose }) => {
  const [voterAddress, setVoterAddress] = useState<string>("");
  const [isValidVoterAddress, setIsValidVoterAddress] = useState<boolean>(true);

  const {
    writeContract,
    data: hash,
    error: writeContractError,
    isPending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h5" component="h2">
          Register Voter
        </Typography>
        <TextField
          label="Voter Address"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
          error={!isValidVoterAddress}
          helperText={!isValidVoterAddress ? "Invalid Ethereum address." : ""}
          fullWidth
          margin="normal"
        />
        <LoadingButton
          sx={{ mt: 1, mb: 1 }}
          variant="contained"
          color="primary"
          onClick={handleRegisterVoter}
          loading={isPending || isConfirming}
        >
          Register
        </LoadingButton>

        {writeContractError && (
          <Alert severity="error">
            {extractReason((writeContractError as BaseError).shortMessage)}
          </Alert>
        )}

        {isConfirmed && (
          <Alert variant="outlined" severity="success">
            Registered!
          </Alert>
        )}
      </Box>
    </Modal>
  );
};

export default RegisterModal;
