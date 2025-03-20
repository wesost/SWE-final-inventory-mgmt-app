import React from "react";
import '../styles/Footer.css';

const Footer = () => {
    return (
    <footer class="footer" role="contentinfo">
        <div className="footer--wrapper">
            <div className="footer--sitemap">
                <nav className="footer--nav"></nav>
            </div>
        </div>
        <div className="sub-footer pad_vertical sp_top_lg">
            <div className="footer--pad">
                <div className="sub-footer--row">
                    <div className="sub-footer--contact-info">
                        <div className="sub-footer--item">
                            <span className="tx-grey">© Whitworth University</span>
                        </div>
                        <div className="sub-footer--item">
                            <span className="street-address tx-grey">300 W. Hawthorne Road</span>
                        </div>
                            <div className="sub-footer--item">
                            <span className="locality tx-grey">Spokane, </span>
                            <span className="region tx-grey">WA </span>
                            <span className="postal-code tx-grey">99251</span>
                        </div>
                        <div className="sub-footer--item">
                            <a href="tel:5097771000" className="tel tx-grey">P: 509.777.1000</a>
                        </div>
                        <div className="sub-footer--item">
                            <span><a href="/cms/about/contact-us/" className="tx-grey tx-no-decoration">Contact Us</a></span>
                        </div>
                    </div>
                    <div className="sub-footer--item-social">
                        <ul className="footer--social-list inline-list sp_top">
                            <li><a href="https://www.facebook.com/whitworthuniversity" className="footer--social-icon icon-facebook">Facebook</a></li>
                            <li><a href="https://twitter.com/whitworth" className="footer--social-icon icon-twitter-x">Twitter</a></li>
                            <li><a href="https://www.youtube.com/whitworthuniversity" className="footer--social-icon icon-youtube">YouTube</a></li>
                            <li><a href="https://www.instagram.com/whitworthuniversity/" className="footer--social-icon icon-instagram">Instagram</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    );
};

export default Footer;