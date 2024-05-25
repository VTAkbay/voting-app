import { useAccount, useConnect, useDisconnect } from "wagmi";
import VotingComponent from "./components/VotingComponent";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();

  const { disconnect } = useDisconnect();

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Account
          </Typography>
          <Box>
            <Typography variant="body1">Status: {account.status}</Typography>
            <Typography variant="body1">
              Addresses: {JSON.stringify(account.addresses)}
            </Typography>
            <Typography variant="body1">ChainId: {account.chainId}</Typography>
          </Box>
          {account.status === "connected" && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => disconnect()}
              sx={{ mt: 2 }}
            >
              Disconnect
            </Button>
          )}
        </Box>

        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Connect
          </Typography>
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="contained"
              color="primary"
              onClick={() => connect({ connector })}
              sx={{ mt: 1, mr: 1 }}
            >
              {connector.name}
            </Button>
          ))}
          <Box my={2}>
            {status && <Alert severity="info">{status}</Alert>}
            {error && <Alert severity="error">{error.message}</Alert>}
          </Box>
        </Box>

        <VotingComponent />
      </Container>
    </ThemeProvider>
  );
}

export default App;
