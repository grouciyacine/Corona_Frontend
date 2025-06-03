import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    nomUtilisateur: string | null;
    id: string | null;
    role: string | null;
}

const initialState: UserState = {
    nomUtilisateur: null,
    id: null,
    role: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.nomUtilisateur = action.payload.nomUtilisateur;
            state.id = action.payload.id;
            state.role = action.payload.role;
        },
        logout(state) {
            state.nomUtilisateur = null;
            state.id = null;
            state.role = null;
        }
    },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
