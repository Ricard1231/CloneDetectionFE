import { useState } from "react";

const Choices = ({ pairId, setResetHome, token }) => {

    const [choice, setChoice] = useState('');
    const [validation, setValidation] = useState({});
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setValidation({});

        let validations = {};

        if (choice == '') {
            validations.choice = true;
        }

        if (Object.keys(validations).length > 0) {
            setValidation(validations);
            return;
        }

        setIsPending(true);
        setError(null);

        const url = 'http://localhost:8081/api/snippets';
        
        const request = {
            snippetPairId: pairId,
            response: choice
        };

        fetch(url, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        .then(res => {
            if (!res.ok) {
                throw Error('could not fetch data for ' + url);
            }
            return res.json();
        })
        .then(data => {
            if (data.isSuccess) {
                setError(null);
                setResetHome(new Date());
            } else {
                setError("Could not save response. Please try again");
            }
            setIsPending(false);
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

    const onRadioChange = (e) => {
        setChoice(e.target.value);
    }
    return (
        <div className="choices">
            <form>
                <h3>Clone Type</h3>
                <div className="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
                    <div className="choice-item btn btn-outline-secondary">
                        <input type="radio" name="buttonGroup" value="1" id="one" className="form-check-input" onChange={onRadioChange} /><label className="form-check-label" htmlFor="one">Type 1: Exact copy, only differences in white space and comments.</label>
                    </div>
                    <div className="choice-item btn btn-outline-secondary">
                        <input type="radio" name="buttonGroup" value="2" id="two" className="form-check-input" onChange={onRadioChange} /><label className="form-check-label" htmlFor="two">Type 2: Same as <i>Type 1</i>, but also variable renaming.</label>
                    </div>
                    <div className="choice-item btn btn-outline-secondary">
                        <input type="radio" name="buttonGroup" value="3" id="three" className="form-check-input" onChange={onRadioChange} /><label className="form-check-label" htmlFor="three">Type 3: Same as <i>Type 2</i>, but also changing or adding few statements.</label>
                    </div>
                    <div className="choice-item btn btn-outline-secondary">
                        <input type="radio" name="buttonGroup" value="4" id="four" className="form-check-input" onChange={onRadioChange} /><label className="form-check-label" htmlFor="four">Type 4: Semantically identical, but not necessarily same syntax.</label>
                    </div>
                    <div className="choice-item btn btn-outline-secondary">
                        <input type="radio" name="buttonGroup" value="5" id="five" className="form-check-input" onChange={onRadioChange} /><label className="form-check-label" htmlFor="five">Not a clone</label>
                    </div>
                    {validation.choice && <div className="text-danger">
                            Please choose a clone type.
                        </div>}
                </div>
                {!isPending && <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>}
                {isPending && <div className="spinner-border" role="status"/>}
                {error && <div>An error occured while submitting data. Please retry.</div>}
            </form>
        </div>
    );
}

export default Choices;