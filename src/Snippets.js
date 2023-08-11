const Snippets = ({snippet1, snippet2}) => {

    return (
        <div className="snippets">
            <div className="code1">
                <h2>Code 1</h2>
                <textarea value= {snippet1} readOnly />
            </div>
            <div className="code2">
                <h2>Code 2</h2>
                <textarea value= {snippet2} readOnly />
            </div>
        </div>
    );
}

export default Snippets;