import {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {TAuthUser} from "../remote/sdk/types";
import {authStatus} from "../remote/remote.ts";
import {redirect} from "react-router-dom";

export const AuthContext = createContext<undefined | {
    user: TAuthUser | undefined
    isLoading: boolean
    refresh: () => void
}>(undefined);

export const AuthProvider: FC<PropsWithChildren> = (props) => {
    const [user, setUser] = useState<TAuthUser | undefined>()
    const [loading, setLoading] = useState(false)

    function refreshStatus() {
        if (loading) {
            return
        }
        setLoading(true)
        authStatus()
            .then((authStatus) => {
                setUser(authStatus.user)
            })
            .catch((err) => {
                console.error(err)
                setUser(undefined)
                redirect('/login')
                // navigate('/login', {replace: true}) FIXME
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        refreshStatus();
    }, []);

    return <>
        <AuthContext.Provider value={{
            user,
            isLoading: loading,
            refresh() {
                refreshStatus()
            },
        }}>
            {props.children}
        </AuthContext.Provider>
    </>
};

export const useUser = () => {
    const providedValue = useContext(AuthContext);
    if (!providedValue) {
        throw new Error('useUser: "providedValue" is empty');
    }
    return providedValue;
};
