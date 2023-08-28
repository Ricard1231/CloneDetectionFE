import Choices from "./Choices";
import Snippets from "./Snippets"
import useFetch from "./useFetch";
import { useNavigate } from "react-router-dom";
import { BE_HOST } from "./constants";

const Home = ({ token, setResetHome, setToken }) => {
    const navigate = useNavigate();
    
    if (!token) {
        navigate('/login', { replace: true});
    }
    const { data, isPending, error } = useFetch(BE_HOST + '/api/snippets', "GET", null, token);

    const handleReload = (e) => {
        setResetHome(new Date());
    }

    const handleLogout = (e) => {
        setToken(null);
        navigate('/login', { replace: true});
    }

    return (
        <>
            <div className="top-buttons">
                {(data || error) && <button type="button" className="btn btn-info btn-reload" onClick={handleReload}>Reload</button>}
                <button type="button" className="btn btn-danger btn-logout" onClick={handleLogout}>Logout</button>
            </div>
            {data && <Snippets snippet1={data.snippet1} snippet2={data.snippet2} />}
            {isPending && <div className="spinner-border" role="status"/>}
            {error && !data && <div>An error occured while fetching data. Please reload.</div>}
            {data && <Choices pairId={data.pairId} setResetHome={setResetHome} token={token} />}
        </>
    )
}

export default Home;