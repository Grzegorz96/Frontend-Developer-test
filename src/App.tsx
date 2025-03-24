// App.tsx
import { FormulaInput } from "./components/FormulaInput";
import { Container, CssBaseline, Typography } from "@mui/material";
import { Global, css } from "@emotion/react";

const GlobalStyles = () => (
    <Global
        styles={css`
            body {
                font-family: "Roboto", sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
        `}
    />
);

const App: React.FC = () => {
    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <GlobalStyles />
            <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
                Formula Editor
            </Typography>
            <FormulaInput />
        </Container>
    );
};

export default App;
