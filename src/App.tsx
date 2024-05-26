import { useAccount, useConnect, useDisconnect } from "wagmi";
import VotingComponent from "./components/VotingComponent";
import {
  Container,
  Typography,
  Box,
  Alert,
  ThemeProvider,
  createTheme,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

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
          <Card>
            <CardHeader title="Account" />
            <CardContent>
              <Typography variant="body1">
                <strong>Status:</strong> {account.status}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1">
                <strong>Addresses:</strong>
              </Typography>
              <Paper
                variant="outlined"
                sx={{ maxHeight: 200, overflow: "auto", mt: 1, mb: 2 }}
              >
                <List>
                  {account.addresses?.map((address, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={address} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1">
                <strong>ChainId:</strong> {account.chainId}
              </Typography>
              <LoadingButton
                variant="contained"
                color="error"
                onClick={() => disconnect()}
                sx={{ mt: 2 }}
                disabled={account.status !== "connected"}
                loading={
                  account.status === "connecting" ||
                  account.status === "reconnecting"
                }
              >
                Disconnect
              </LoadingButton>
            </CardContent>
          </Card>
        </Box>

        <Box my={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            Connect
          </Typography>
          {connectors.map((connector) => (
            <LoadingButton
              key={connector.uid}
              variant="contained"
              color="primary"
              onClick={() => connect({ connector })}
              sx={{ mt: 1, mr: 1 }}
              disabled={account.status === "connected"}
              loading={
                account.status === "connecting" ||
                account.status === "reconnecting"
              }
            >
              {connector.name}
            </LoadingButton>
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
