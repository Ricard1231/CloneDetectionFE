import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [experience, setExperience] = useState(0);
    const [education, setEducation] = useState(null);
    const [validation, setValidation] = useState({});
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/login');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setValidation({});

        let validations = {};

        if (confirmPassword != password) {
            validations.confirmPassword = true;
        }

        if (education == null) {
            validations.education = true;
        }

        if (Object.keys(validations).length > 0) {
            setValidation(validations);
            return;
        }

        setIsPending(true);
        setError(null);

        const url = BE_HOST + '/api/user/register';
        
        const request = {
            email,
            password,
            experience,
            education
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
            if (res.status == 400) {
                throw Error('Username/email already exists, please use a different username or go to login page.');
            }
            if (!res.ok) {
                throw Error('An error occured while trying to register. Please retry.');
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

    return (
        <div className="register">
            {!isPending && <form>
                <div className="row mb-3">
                    <label htmlFor="emailInput" className="col-sm-4 col-form-label">Email</label>
                    <div className="col-sm-8">
                        <input type="email" id="emailInput" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="passwordInput" className="col-sm-4 col-form-label">Password</label>
                    <div className="col-sm-8">
                        <input type="password" name="passwordInput" id="passwordInput" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="confirmPasswordInput" className="col-sm-4 col-form-label">Confirm Password</label>
                    <div className="col-sm-8">
                        <input type="password" name="confirmPasswordInput" id="confirmPasswordInput" className="form-control" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {validation.confirmPassword && <div className="text-danger">
                            Password does not match.
                        </div>}
                    </div>
                </div>
                <div className="row mb-3 valign">
                    <label htmlFor="experienceInput" className="col-sm-4 col-form-label">Programming Work Experience (years)</label>
                    <div className="col-sm-8">
                        <input type="number" id="experienceInput" className="form-control" required min={0} value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="educationSelect" className="col-sm-4 col-form-label">Education</label>
                    <div className="col-sm-8">
                        <select id="educationSelect" className="form-select" required value={education} onChange={(e) => setEducation(e.target.value)}>
                            <option value={null}>Choose...</option>
                            <option value="High School">High School</option>
                            <option value="Bachelors">Bachelors</option>
                            <option value="Masters">Masters</option>
                        </select>
                        {validation.education && <div className="text-danger">
                            Please choose education.
                        </div>}
                    </div>
                </div>
                <div className="register-buttons">
                    {!isPending && <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Register</button>}
                    {!isPending && <button type="button" className="btn btn-secondary" onClick={handleLogin}>Go to Login Page</button>}
                </div>
                {isPending && <div className="spinner-border" role="status"/>}
                {error && <div className="text-danger">{error}</div>}
            </form>}
        </div>
    )
}

export default Register;