import { useState } from "react";
import { Button, Typography, Container, Box } from "@mui/material";

const Home = () => {
    const [count, setCount] = useState(0);

    return (
        <Container
            disableGutters
            maxWidth={false}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "100vw",
                height: "100vh",
                boxSizing: "border-box",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                    border: 1,
                    borderColor: "primary.main",
                    boxSizing: "inherit"
                }}
            >
                <Box sx={{ flex: 1, borderRight: 1, borderColor: "primary.light", p: 2 }}>
                    <Typography align="center">Box 1</Typography>
                </Box>
                <Box sx={{ flex: 1, borderRight: 1, borderColor: "primary.light", p: 2 }}>
                    <Typography align="center">Box 2</Typography>
                    <Typography variant="h4" align="center" mt={4}>
                        Welcome to MUI + Vite!
                    </Typography>

                    <Typography align="center" mt={2}>
                        Count: {count}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setCount(count + 1)}
                        sx={{ display: "block", mx: "auto", mt: 2 }}
                    >
                        Increase Count
                    </Button>
                </Box>
                <Box sx={{ flex: 1, p: 2 }}>
                    <Typography align="center">Box 3</Typography>
                </Box>
            </Box>
        </Container>
    );
  };
  
  export default Home;
  