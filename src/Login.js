import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const url = BE_HOST + '/api/user/authenticate';
        
        const request = {
            email,
            password
        };

        fetch(url, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            console.log(res);
            if (res.status == 404) {
                throw Error('Username not found');
            }
            if (!res.ok) {
                throw Error('An error occured while trying to login. Please retry.');
            }
            return res.json();
        })
        .then(data => {
            setToken('Bearer ' + data.token);
            setError(null);
            setIsPending(false);
            navigate('/', { replace: true});
        })
        .catch(err => {
            if (err.name === 'AbortError') {
                console.log('fetch aborted');
            } else {
                setIsPending(false);
                setError(err.message);
            }
        });
    }

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/register');
    }

    return (
        <div className="login">
            {!isPending && <form>
                <div className="row mb-3">
                    <label htmlFor="emailInput" className="col-sm-3 col-form-label">Email</label>
                    <div className="col-sm-9">
                        <input type="email" id="emailInput" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="passwordInput" className="col-sm-3 col-form-label">Password</label>
                    <div className="col-sm-9">
                        <input type="password" id="passwordInput" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="login-buttons">
                    {!isPending && <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Login</button>}
                    {!isPending && <button type="button" className="btn btn-secondary" onClick={handleRegister}>Go to Register Page</button>}
                </div>
                {isPending && <div className="spinner-border" role="status"/>}
                {error && <div className="text-danger">{error}</div>}
            </form>}
        </div>
    )
}

export default Login;