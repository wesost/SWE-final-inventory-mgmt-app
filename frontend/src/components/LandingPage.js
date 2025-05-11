import React, { useCallback, useEffect, useState, useRef } from "react";
//import { Link } from "react-router-dom"; 
import '../styles/LandingPage.css';
import whitworthLogo from '../assets/whitworth-logo.png'; // Import the logo directly

const LandingPage = () => {

//function LandingPage() {

    // state for product info and errors - interacting with backend/apis
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    // state to hold digits when something is scanned and enter is pressed
    // (this is what the scanner does, types the digits and hits enter)
    // user just needs to scan item
    const [scannedUpcBuffer, setScannedUpcBuffer] = useState('');

    // variable to store timeout id for clearing the buffer
    const bufferTimeoutRef = useRef(null);

    const lookupUpc = useCallback(async (upcToLookup) => {
        if (!upcToLookup) return; // don't lookup if empty
        setError(null); // reset errors on new lookup
        setProduct(null);// clear previous product on new lookup
        console.log(`Looking up UPC: ${upcToLookup}`);

        try{
            const response = await fetch('http://localhost:5000/api/upc-lookup', {
                method: 'POST',
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({ upc: upcToLookup, mode: 'OUT' }),
            });

            //check if response status is failiure
            // catches backend erros before trying to parse json
            if (!response.ok){
                // try to get error msg from backend response
                let errorMsg = `Request failed with status ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorData.message || errorMsg; // use backend msg if available
                } catch (jsonError) {
                    // ignore if response body isn't valid json
                    console.error("Could not parse error response JSON:", jsonError);
                }
                throw new Error(errorMsg);
            }

            // if response.ok is true, parse json
            const data = await response.json();
            console.log("Recieved data from backend:", data);

            //check if response has expected properties
            if (data.message && data.title) { // id and title should always be there
                setProduct(data); // data object is the product info set from the backend after it does its thing
                setError(null); // clear previous errors if needed
                console.log("Product found and stored:", data);
            }
            else {
                // if it doesn't match what we are looking for, assume prod not found
                // handles cases where api returns some random thing
                // or if backend sent 404 message object/error
                setProduct(null);
                // use message from backend if available, otherwise default message
                setError(data.message || `No product found for UPC: ${upcToLookup}.`);
                console.log("Product not found or backend response format unrecognized.", data);
            }
        } catch (err) {
            console.error("Error fetching product:", err);
            setError(`Scanned item with code ${upcToLookup} not found in database, please add from admin dashboard`); // shouldn't be scanning things that aren't already in db on landing page
            setProduct(null);

        } finally {
            //clear buffer regardless of success or failure after lookup attempt is made
            setScannedUpcBuffer('');

        }

    }, []); // empty dependency array means function is created once

    useEffect(() => {
        const handleKeyDown = (event) => {
            //clear existing timeout when new key is pressed
            if (bufferTimeoutRef.current) {
                clearTimeout(bufferTimeoutRef.current);
            }
            // if enter key pressed, attempt lookup with current buffer content (all keys pressed up 
            // till this point, should be a full upc code from the scanner)
            if (event.key === 'Enter') {
                // only lookup if buffer isn't empty
                if (scannedUpcBuffer.length > 0) {
                    event.preventDefault(); // prevent potential default actions such as form submission or other unwanted things

                    // lookup the upc, buffer is cleared inside lookupUpc function so don't worry about that here
                    lookupUpc(scannedUpcBuffer); 

                    
                }
            }
            // if printable character (most likely digit from scanner)
            else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                // append character to buffer
                setScannedUpcBuffer((prevBuffer) => prevBuffer + event.key);
            }
            // else ignore other keys ie shift ctrl alt arrows etc

            // set timeout to clear buffer if no new key is pressed quickly enough
            // (scanner 'types' keys very quickly) 200ms delay has worked nicely 
            // scanner probably has a documented speed you could look up if you wanted to
            bufferTimeoutRef.current = setTimeout(() => {
                setScannedUpcBuffer(''); // clear buffer if a pause has been detected
                // console.log("buffer cleared due to timeout");

            }, 200); // gives 200ms delay
        };
        window.addEventListener('keydown', handleKeyDown); // adds event listener when component mounts

        //cleanup listener/timeout when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (bufferTimeoutRef.current) {
                clearTimeout(bufferTimeoutRef.current);
            }
        };
    }, [scannedUpcBuffer, lookupUpc]); // Rerun effect if buffer or lookup function changes
    // (buffer and lookup function are )

    // set/clear a timer when new items are scanned, so that 
    // the displayed data will clear and the page will go back to 
    // showing the scanner animation after 20seconds
    useEffect(() => {
        if (!product) return; // no timeout needed if no current product

        const timeoutID = setTimeout(() => {
            setProduct(null); // clear product after 20sec

        }, 20000); // 20seconds
        return () => clearTimeout(timeoutID); // clear timeout if product changes before 20sec
    }, [product]); // product is this effect's dependency, run when product state changes


    return (
        <div className="LandingPage">
            <div className="main-content">
            {/* {error && <p style={{ color: 'blue' }}>Error: {error}</p>} */}

                <div className="landing-container">
                    {/* You can add the logo here if needed */}
                    <div className="logo">
                        <img src={whitworthLogo} alt="Whitworth Logo" />
                    </div>
                    <h1 className="landing-title">Welcome to Whitworth University Nutrition Center</h1>
                    <h2 className="landing-subtitle">Please Scan Items Barcodes</h2>
                    {
                    /* display product info with conditional rendering
                    only shows this part of the website if a product has been scanned 
                    todo: add a timeout of maybe 10sec to make the product info disappear
                    after a bit so it doesn't just stay on the screen forever after the last thing is scanned
                    
                    the following code works like this:
                    if product is true (not null), render the following to the screen*/
                    }
                    {/* {product && (
                        <div>
                            <p>product title: {product.title || 'N/A'}</p>
                        </div>
                    )} */}
                    <div className="landing-scanner-area">
                    {product && (
                        <div>
                          <h2>Product Information</h2>
                           {/*some of the fields returned by the api */}

                          <p><strong>Title:</strong> {product.title || 'N/A'}</p>
                          <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
                          <p><strong>Category:</strong> {product.category || 'N/A'}</p>
                          {product.images && product.images.length > 0 && (
                            <img src={product.images[0]} alt={product.title || 'Product Image'} width="200" />
                          )}
             
                        </div>
                    )}
                    {/* no product and no error - show scan box animation */}
                    {!product && !error && (
                        
                        <div className="scanner-box">
                            <div className="scanner-animation"></div>
                            <p>Position barcode in scanning area</p>
                        </div>
                    )}
                    {/* no product and an error - display error message */}
                    {!product && error && (
                        <div>
                            <p style={{ color: 'blue' }}>Error: {error} </p>
                        </div>
                    )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

