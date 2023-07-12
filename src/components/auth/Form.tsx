import LoginForm from "./LoginForm";
import RegForm from "./RegForm";
import {Stack} from "@mui/material";

export const Form = () => {
    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="stretch"
            spacing={1}
            style={{'marginBottom':'4vw','marginTop':'7vw'}}
        >
            <LoginForm/>
            <RegForm/>
        </Stack>
    );
};